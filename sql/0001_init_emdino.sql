-- ============================================================
-- EMDINO PERFUMERÍA — schema + tablas + RLS + helper + RPC
-- Idempotente: usa CREATE IF NOT EXISTS / DROP POLICY IF EXISTS.
-- Aplicar como superusuario (postgres) en Supabase self-hosted.
-- ============================================================

create schema if not exists emdino;
grant usage on schema emdino to anon, authenticated, service_role;

-- Habilitar extensiones requeridas en el schema extensions (estandar Supabase)
create extension if not exists "pgcrypto" with schema public;

-- ============================================================
-- TABLAS
-- ============================================================

-- A) stores ----------------------------------------------------
create table if not exists emdino.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- B) profiles --------------------------------------------------
create table if not exists emdino.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  store_id uuid not null references emdino.stores(id) on delete cascade,
  email text,
  role text not null check (role in ('admin','editor')),
  created_at timestamptz not null default now()
);
create index if not exists profiles_store_id_idx on emdino.profiles(store_id);

-- C) perfume_categories ----------------------------------------
create table if not exists emdino.perfume_categories (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references emdino.stores(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(store_id, slug)
);
create index if not exists perfume_categories_store_active_idx on emdino.perfume_categories(store_id, active);

-- D) products --------------------------------------------------
create table if not exists emdino.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references emdino.stores(id) on delete cascade,
  category_id uuid references emdino.perfume_categories(id) on delete set null,
  name text not null,
  slug text not null,
  brand text not null,
  gender text not null check (gender in ('masculino','femenino')),
  short_description text,
  long_description text,
  main_image_url text,
  featured boolean not null default false,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(store_id, slug)
);
create index if not exists products_store_gender_idx on emdino.products(store_id, gender, active);
create index if not exists products_store_category_idx on emdino.products(store_id, category_id, active);

-- E) product_variants ------------------------------------------
create table if not exists emdino.product_variants (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references emdino.stores(id) on delete cascade,
  product_id uuid not null references emdino.products(id) on delete cascade,
  label text not null,
  volume_ml numeric,
  sku text,
  price numeric not null default 0,
  stock int not null default 0,
  stock_minimum int not null default 0,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists product_variants_product_idx on emdino.product_variants(product_id, active);
create index if not exists product_variants_store_idx on emdino.product_variants(store_id);

-- F) combos ----------------------------------------------------
create table if not exists emdino.combos (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references emdino.stores(id) on delete cascade,
  name text not null,
  slug text not null,
  tagline text,
  presentation text,
  normal_price numeric not null default 0,
  promo_price numeric not null default 0,
  featured boolean not null default false,
  active boolean not null default true,
  sort_order int not null default 0,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(store_id, slug)
);

-- G) combo_items -----------------------------------------------
create table if not exists emdino.combo_items (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references emdino.stores(id) on delete cascade,
  combo_id uuid not null references emdino.combos(id) on delete cascade,
  product_id uuid references emdino.products(id) on delete set null,
  sort_order int not null default 0
);
create index if not exists combo_items_combo_idx on emdino.combo_items(combo_id);

-- H) orders ----------------------------------------------------
create table if not exists emdino.orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references emdino.stores(id) on delete cascade,
  customer_name text,
  customer_phone text,
  customer_document text,
  city text,
  address text,
  delivery_method text check (delivery_method in ('retiro','envio')),
  notes text,
  status text not null default 'nuevo' check (status in ('nuevo','contactado','confirmado','preparado','entregado','cancelado')),
  total numeric not null default 0,
  whatsapp_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_store_status_idx on emdino.orders(store_id, status, created_at desc);

-- I) order_items -----------------------------------------------
create table if not exists emdino.order_items (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references emdino.stores(id) on delete cascade,
  order_id uuid not null references emdino.orders(id) on delete cascade,
  product_id uuid references emdino.products(id) on delete set null,
  variant_id uuid references emdino.product_variants(id) on delete set null,
  combo_id uuid references emdino.combos(id) on delete set null,
  item_type text not null check (item_type in ('product','combo')),
  name text,
  variant_label text,
  qty int not null default 1 check (qty > 0),
  unit_price numeric not null default 0,
  subtotal numeric not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists order_items_order_idx on emdino.order_items(order_id);

-- J) settings --------------------------------------------------
create table if not exists emdino.settings (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references emdino.stores(id) on delete cascade,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(store_id, key)
);

-- ============================================================
-- TRIGGERS de updated_at
-- ============================================================
create or replace function emdino.tg_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'perfume_categories','products','product_variants','combos','orders','settings'
  ]
  loop
    execute format('drop trigger if exists trg_touch_updated_at on emdino.%I', t);
    execute format('create trigger trg_touch_updated_at before update on emdino.%I
                    for each row execute function emdino.tg_touch_updated_at()', t);
  end loop;
end $$;

-- ============================================================
-- HELPER: emdino.current_store_id()
-- Devuelve el store_id del usuario autenticado o NULL.
-- ============================================================
create or replace function emdino.current_store_id()
returns uuid language sql stable security definer set search_path = emdino, public as $$
  select p.store_id
  from emdino.profiles p
  where p.id = auth.uid()
  limit 1;
$$;
grant execute on function emdino.current_store_id() to anon, authenticated;

-- ============================================================
-- HELPER: emdino.current_role()
-- ============================================================
create or replace function emdino.current_role()
returns text language sql stable security definer set search_path = emdino, public as $$
  select p.role from emdino.profiles p where p.id = auth.uid() limit 1;
$$;
grant execute on function emdino.current_role() to anon, authenticated;

-- ============================================================
-- RLS
-- ============================================================
alter table emdino.stores              enable row level security;
alter table emdino.profiles            enable row level security;
alter table emdino.perfume_categories  enable row level security;
alter table emdino.products            enable row level security;
alter table emdino.product_variants    enable row level security;
alter table emdino.combos              enable row level security;
alter table emdino.combo_items         enable row level security;
alter table emdino.orders              enable row level security;
alter table emdino.order_items         enable row level security;
alter table emdino.settings            enable row level security;

-- Macro: lectura publica de catalogo activo
-- (productos, variantes, combos, combo_items, categorias y settings de la tienda)

-- stores: lectura publica anonima (solo nombre/slug, no datos sensibles)
drop policy if exists "stores_select_all" on emdino.stores;
create policy "stores_select_all" on emdino.stores for select to anon, authenticated using (true);

-- profiles: solo el propio usuario ve y administra su profile
drop policy if exists "profiles_self_select" on emdino.profiles;
create policy "profiles_self_select" on emdino.profiles for select to authenticated
  using (id = auth.uid() or store_id = emdino.current_store_id());

drop policy if exists "profiles_self_admin" on emdino.profiles;
create policy "profiles_self_admin" on emdino.profiles for all to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- perfume_categories: lectura publica activos / admin escribe
drop policy if exists "perfume_categories_select_public" on emdino.perfume_categories;
create policy "perfume_categories_select_public" on emdino.perfume_categories for select to anon, authenticated
  using (active = true or store_id = emdino.current_store_id());

drop policy if exists "perfume_categories_write_admin" on emdino.perfume_categories;
create policy "perfume_categories_write_admin" on emdino.perfume_categories for all to authenticated
  using (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'))
  with check (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'));

-- products: lectura publica activos / admin escribe
drop policy if exists "products_select_public" on emdino.products;
create policy "products_select_public" on emdino.products for select to anon, authenticated
  using (active = true or store_id = emdino.current_store_id());

drop policy if exists "products_write_admin" on emdino.products;
create policy "products_write_admin" on emdino.products for all to authenticated
  using (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'))
  with check (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'));

-- product_variants: lectura publica activos / admin escribe
drop policy if exists "product_variants_select_public" on emdino.product_variants;
create policy "product_variants_select_public" on emdino.product_variants for select to anon, authenticated
  using (active = true or store_id = emdino.current_store_id());

drop policy if exists "product_variants_write_admin" on emdino.product_variants;
create policy "product_variants_write_admin" on emdino.product_variants for all to authenticated
  using (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'))
  with check (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'));

-- combos: lectura publica activos / admin escribe
drop policy if exists "combos_select_public" on emdino.combos;
create policy "combos_select_public" on emdino.combos for select to anon, authenticated
  using (active = true or store_id = emdino.current_store_id());

drop policy if exists "combos_write_admin" on emdino.combos;
create policy "combos_write_admin" on emdino.combos for all to authenticated
  using (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'))
  with check (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'));

-- combo_items: lectura publica / admin escribe
drop policy if exists "combo_items_select_public" on emdino.combo_items;
create policy "combo_items_select_public" on emdino.combo_items for select to anon, authenticated using (true);

drop policy if exists "combo_items_write_admin" on emdino.combo_items;
create policy "combo_items_write_admin" on emdino.combo_items for all to authenticated
  using (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'))
  with check (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'));

-- orders / order_items: solo admin del store - NO escritura publica directa
drop policy if exists "orders_admin_only" on emdino.orders;
create policy "orders_admin_only" on emdino.orders for all to authenticated
  using (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'))
  with check (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'));

drop policy if exists "order_items_admin_only" on emdino.order_items;
create policy "order_items_admin_only" on emdino.order_items for all to authenticated
  using (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'))
  with check (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'));

-- settings: lectura publica de claves operativas / admin escribe
drop policy if exists "settings_select_public" on emdino.settings;
create policy "settings_select_public" on emdino.settings for select to anon, authenticated using (true);

drop policy if exists "settings_write_admin" on emdino.settings;
create policy "settings_write_admin" on emdino.settings for all to authenticated
  using (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'))
  with check (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'));

-- ============================================================
-- RPC: emdino.create_public_order(payload jsonb)
-- Crea un pedido para anonimos. Recalcula precios desde DB.
-- SECURITY DEFINER para bypass de RLS interno controlado.
-- ============================================================
-- Payload esperado:
-- {
--   "store_slug": "emdino",
--   "customer": { "name": "...", "phone": "...", "document": "...",
--                 "city": "...", "address": "...",
--                 "delivery_method": "retiro|envio", "notes": "..." },
--   "items": [
--     { "type": "product", "product_slug": "...", "variant_label": "5ml", "qty": 2 },
--     { "type": "combo",   "combo_slug": "...", "qty": 1 }
--   ]
-- }
-- Devuelve: { order_id, total, whatsapp_message }
create or replace function emdino.create_public_order(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = emdino, public
as $$
declare
  v_store_id uuid;
  v_order_id uuid;
  v_total numeric := 0;
  v_msg_lines text[] := array[]::text[];
  v_idx int := 0;
  v_item jsonb;
  v_product_id uuid;
  v_variant_id uuid;
  v_combo_id uuid;
  v_unit numeric;
  v_qty int;
  v_subtotal numeric;
  v_name text;
  v_variant_label text;
  v_customer jsonb := coalesce(payload->'customer', '{}'::jsonb);
  v_delivery text;
  v_msg text;
  v_brand text;
  v_pname text;
begin
  -- 1) Resolver store
  select id into v_store_id from emdino.stores
   where slug = coalesce(payload->>'store_slug', 'emdino');
  if v_store_id is null then
    raise exception 'Store no encontrado';
  end if;

  -- 2) Validar payload basico
  if v_customer->>'name' is null or length(trim(v_customer->>'name')) = 0 then
    raise exception 'Falta nombre del cliente';
  end if;
  if v_customer->>'phone' is null or length(trim(v_customer->>'phone')) = 0 then
    raise exception 'Falta telefono del cliente';
  end if;
  if jsonb_typeof(payload->'items') <> 'array' or jsonb_array_length(payload->'items') = 0 then
    raise exception 'Pedido sin items';
  end if;

  v_delivery := coalesce(v_customer->>'delivery_method', 'retiro');
  if v_delivery not in ('retiro','envio') then
    raise exception 'delivery_method invalido';
  end if;

  -- 3) Crear pedido (sin total aun, se actualiza al final)
  insert into emdino.orders (
    store_id, customer_name, customer_phone, customer_document,
    city, address, delivery_method, notes, status, total
  ) values (
    v_store_id,
    v_customer->>'name',
    v_customer->>'phone',
    v_customer->>'document',
    v_customer->>'city',
    v_customer->>'address',
    v_delivery,
    v_customer->>'notes',
    'nuevo',
    0
  ) returning id into v_order_id;

  -- 4) Procesar items
  for v_item in select * from jsonb_array_elements(payload->'items')
  loop
    v_idx := v_idx + 1;
    v_qty := greatest(1, coalesce((v_item->>'qty')::int, 1));

    if (v_item->>'type') = 'product' then
      -- Resolver producto y variante por slug + label, recalculando precio
      select p.id, p.brand, p.name into v_product_id, v_brand, v_pname
        from emdino.products p
       where p.store_id = v_store_id
         and p.slug = v_item->>'product_slug'
         and p.active = true;
      if v_product_id is null then
        raise exception 'Producto no encontrado o inactivo: %', v_item->>'product_slug';
      end if;

      select v.id, v.price, v.label into v_variant_id, v_unit, v_variant_label
        from emdino.product_variants v
       where v.product_id = v_product_id
         and v.label = v_item->>'variant_label'
         and v.active = true;
      if v_variant_id is null then
        raise exception 'Variante no encontrada o inactiva: % %', v_item->>'product_slug', v_item->>'variant_label';
      end if;

      v_subtotal := v_unit * v_qty;
      v_name := v_brand || ' ' || v_pname;

      insert into emdino.order_items (
        store_id, order_id, product_id, variant_id, item_type,
        name, variant_label, qty, unit_price, subtotal
      ) values (
        v_store_id, v_order_id, v_product_id, v_variant_id, 'product',
        v_name, v_variant_label, v_qty, v_unit, v_subtotal
      );

      v_msg_lines := v_msg_lines || (v_idx || '. ' || v_name);
      v_msg_lines := v_msg_lines || ('   Presentacion: ' || v_variant_label);
      v_msg_lines := v_msg_lines || ('   Cantidad: ' || v_qty);
      v_msg_lines := v_msg_lines || ('   Precio unitario: Gs. ' || regexp_replace(round(v_unit)::text, '\B(?=(\d{3})+(?!\d))', '.', 'g'));
      v_msg_lines := v_msg_lines || ('   Subtotal: Gs. ' || regexp_replace(round(v_subtotal)::text, '\B(?=(\d{3})+(?!\d))', '.', 'g'));
      v_msg_lines := v_msg_lines || '';

    elsif (v_item->>'type') = 'combo' then
      select c.id, c.promo_price, c.name into v_combo_id, v_unit, v_name
        from emdino.combos c
       where c.store_id = v_store_id
         and c.slug = v_item->>'combo_slug'
         and c.active = true;
      if v_combo_id is null then
        raise exception 'Combo no encontrado o inactivo: %', v_item->>'combo_slug';
      end if;
      v_subtotal := v_unit * v_qty;

      insert into emdino.order_items (
        store_id, order_id, combo_id, item_type,
        name, qty, unit_price, subtotal
      ) values (
        v_store_id, v_order_id, v_combo_id, 'combo',
        'Combo ' || v_name, v_qty, v_unit, v_subtotal
      );

      v_msg_lines := v_msg_lines || (v_idx || '. Combo ' || v_name);
      v_msg_lines := v_msg_lines || ('   Cantidad: ' || v_qty);
      v_msg_lines := v_msg_lines || ('   Precio unitario: Gs. ' || regexp_replace(round(v_unit)::text, '\B(?=(\d{3})+(?!\d))', '.', 'g'));
      v_msg_lines := v_msg_lines || ('   Subtotal: Gs. ' || regexp_replace(round(v_subtotal)::text, '\B(?=(\d{3})+(?!\d))', '.', 'g'));
      v_msg_lines := v_msg_lines || '';
    else
      raise exception 'item_type invalido';
    end if;

    v_total := v_total + v_subtotal;
  end loop;

  -- 5) Componer mensaje WhatsApp completo
  v_msg :=
    E'Hola, quiero realizar este pedido en Emdino Perfumeria:\n\n' ||
    E'DATOS DEL CLIENTE\n' ||
    'Nombre: ' || coalesce(v_customer->>'name','') || E'\n' ||
    'Telefono: ' || coalesce(v_customer->>'phone','') || E'\n' ||
    'Cedula: ' || coalesce(v_customer->>'document','-') || E'\n' ||
    'Entrega: ' || (case when v_delivery = 'envio' then 'Envio' else 'Retiro en Encarnacion' end) || E'\n';
  if v_delivery = 'envio' then
    v_msg := v_msg ||
      'Ciudad: ' || coalesce(v_customer->>'city','-') || E'\n' ||
      'Direccion/Referencia: ' || coalesce(v_customer->>'address','-') || E'\n';
  end if;
  if coalesce(v_customer->>'notes','') <> '' then
    v_msg := v_msg || 'Observacion: ' || (v_customer->>'notes') || E'\n';
  end if;
  v_msg := v_msg || E'\nPEDIDO\n\n' || array_to_string(v_msg_lines, E'\n') ||
    E'\nTOTAL: Gs. ' || regexp_replace(round(v_total)::text, '\B(?=(\d{3})+(?!\d))', '.', 'g') ||
    E'\n\nQuedo atento/a para confirmar disponibilidad.';

  -- 6) Actualizar total y mensaje en orden
  update emdino.orders
     set total = v_total, whatsapp_message = v_msg
   where id = v_order_id;

  return jsonb_build_object(
    'order_id', v_order_id,
    'total', v_total,
    'whatsapp_message', v_msg
  );
end;
$$;
grant execute on function emdino.create_public_order(jsonb) to anon, authenticated;

-- ============================================================
-- FIN 0001_init_emdino.sql
-- Despues de ejecutar este archivo, correr 0002_seed_emdino.sql
-- y luego: cd /root/supabase/docker && ./exponer-schema.sh emdino
-- ============================================================
