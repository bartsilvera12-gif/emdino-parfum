-- ============================================================
-- EMDINO PERFUMERIA - combos con precios por tamaño (3/5/10ml)
--   1) tabla combo_variants (analoga a product_variants)
--   2) grants + RLS
--   3) poblar variantes de los 9 combos existentes (precios mmfragrances)
--   4) 3 combos nuevos Dia del Padre (Exclusivo / Economico / Premium)
-- Append-only, idempotente.
-- ============================================================

-- ---------- 1) tabla ----------
create table if not exists emdino.combo_variants (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references emdino.stores(id) on delete cascade,
  combo_id uuid not null references emdino.combos(id) on delete cascade,
  label text not null,
  price numeric not null default 0,
  compare_at_price numeric,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(combo_id, label)
);
create index if not exists combo_variants_combo_idx on emdino.combo_variants(combo_id, active);
create index if not exists combo_variants_store_idx on emdino.combo_variants(store_id);

-- trigger updated_at
drop trigger if exists trg_touch_updated_at on emdino.combo_variants;
create trigger trg_touch_updated_at before update on emdino.combo_variants
  for each row execute function emdino.tg_touch_updated_at();

-- ---------- 2) grants ----------
grant select on emdino.combo_variants to anon, authenticated;
grant insert, update, delete on emdino.combo_variants to authenticated;

-- ---------- 2b) RLS ----------
alter table emdino.combo_variants enable row level security;

drop policy if exists "combo_variants_select_public" on emdino.combo_variants;
create policy "combo_variants_select_public" on emdino.combo_variants for select to anon, authenticated
  using (active = true or store_id = emdino.current_store_id());

drop policy if exists "combo_variants_write_admin" on emdino.combo_variants;
create policy "combo_variants_write_admin" on emdino.combo_variants for all to authenticated
  using (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'))
  with check (store_id = emdino.current_store_id() and emdino.current_role() in ('admin','editor'));

-- ============================================================
-- 3) poblar variantes de los 9 combos existentes
--    price = promo, compare_at_price = normal (precios mmfragrances)
-- ============================================================
do $$
declare
  v_store_id uuid;
  rec record;
  v_combo_id uuid;
  labels text[] := array['3ml','5ml','10ml'];
  i int;
  data jsonb := '[
    {"slug":"combo-party",         "p":[[150000,160000],[220000,240000],[390000,420000]]},
    {"slug":"combo-citas",         "p":[[110000,120000],[155000,167000],[275000,295000]]},
    {"slug":"combo-mix",           "p":[[155000,165000],[225000,230000],[385000,400000]]},
    {"slug":"combo-fresh",         "p":[[102000,108000],[147000,155000],[257000,270000]]},
    {"slug":"combo-irresistible",  "p":[[155000,165000],[225000,235000],[390000,420000]]},
    {"slug":"combo-boliche",       "p":[[70000,78000],[100000,115000],[165000,185000]]},
    {"slug":"combo-linea-le-beau", "p":[[110000,120000],[165000,175000],[295000,320000]]},
    {"slug":"combo-best-sellers",  "p":[[175000,185000],[260000,275000],[455000,480000]]},
    {"slug":"combo-nicho",         "p":[[205000,220000],[335000,360000],[610000,650000]]}
  ]'::jsonb;
begin
  select id into v_store_id from emdino.stores where slug = 'emdino';
  if v_store_id is null then raise exception 'Store emdino no encontrado'; end if;

  for rec in select elem from jsonb_array_elements(data) as t(elem)
  loop
    select id into v_combo_id from emdino.combos
     where store_id = v_store_id and slug = (rec.elem->>'slug');
    if v_combo_id is null then
      raise notice 'Combo % no existe, salteado', rec.elem->>'slug';
      continue;
    end if;

    for i in 1..3 loop
      insert into emdino.combo_variants (store_id, combo_id, label, price, compare_at_price, sort_order, active)
      values (
        v_store_id, v_combo_id, labels[i],
        (rec.elem->'p'->(i-1)->>0)::numeric,
        (rec.elem->'p'->(i-1)->>1)::numeric,
        i*10, true
      )
      on conflict (combo_id, label) do update
        set price = excluded.price,
            compare_at_price = excluded.compare_at_price,
            sort_order = excluded.sort_order,
            active = true,
            updated_at = now();
    end loop;

    -- precio de referencia del combo = 5ml (para badge / orden)
    update emdino.combos
       set promo_price  = (rec.elem->'p'->1->>0)::numeric,
           normal_price = (rec.elem->'p'->1->>1)::numeric,
           updated_at = now()
     where id = v_combo_id;
  end loop;

  raise notice 'Variantes de combos existentes pobladas.';
end $$;

-- ============================================================
-- 4) 3 combos nuevos Dia del Padre
--    precio unico (sin descuento): price = valor, compare_at = null
-- ============================================================
do $$
declare
  v_store_id uuid;
  rec record;
  v_combo_id uuid;
  labels text[] := array['3ml','5ml','10ml'];
  i int;
  prod_slug text;
  v_prod_id uuid;
  combos jsonb := '[
    {
      "slug":"combo-dia-padre-exclusivo",
      "name":"Día del Padre Exclusivo",
      "tagline":"Regalá lo que realmente lo representa",
      "presentation":"3 fragancias · elegí tu tamaño",
      "image":"/assets/combos/combo-dia-padre-exclusivo.jpg",
      "sort":1, "featured":true,
      "items":["xerjoff-naxos","pdm-layton","nishane-hacivat"],
      "prices":[235000,350000,660000]
    },
    {
      "slug":"combo-dia-padre-premium",
      "name":"Día del Padre Premium",
      "tagline":"Para cada momento de papá",
      "presentation":"3 fragancias · elegí tu tamaño",
      "image":"/assets/combos/combo-dia-padre-premium.jpg",
      "sort":2, "featured":false,
      "items":["prada-lhomme-intense","chanel-allure-sport-extreme","tf-ombre-leather"],
      "prices":[175000,290000,515000]
    },
    {
      "slug":"combo-dia-padre-economico",
      "name":"Día del Padre Económico",
      "tagline":"Regalá lo que realmente lo representa",
      "presentation":"3 fragancias · elegí tu tamaño",
      "image":"/assets/combos/combo-dia-padre-economico.jpg",
      "sort":3, "featured":false,
      "items":["rasasi-hawas-ice","dior-homme-intense","vr-spicebomb-extreme"],
      "prices":[120000,180000,280000]
    }
  ]'::jsonb;
begin
  select id into v_store_id from emdino.stores where slug = 'emdino';
  if v_store_id is null then raise exception 'Store emdino no encontrado'; end if;

  for rec in select elem from jsonb_array_elements(combos) as t(elem)
  loop
    -- upsert combo (precio referencia = 5ml)
    insert into emdino.combos (store_id, name, slug, tagline, presentation, normal_price, promo_price, featured, active, sort_order, image_url)
    values (
      v_store_id, rec.elem->>'name', rec.elem->>'slug', rec.elem->>'tagline', rec.elem->>'presentation',
      (rec.elem->'prices'->>1)::numeric, (rec.elem->'prices'->>1)::numeric,
      (rec.elem->>'featured')::boolean, true, (rec.elem->>'sort')::int, rec.elem->>'image'
    )
    on conflict (store_id, slug) do update
      set name = excluded.name, tagline = excluded.tagline, presentation = excluded.presentation,
          normal_price = excluded.normal_price, promo_price = excluded.promo_price,
          featured = excluded.featured, active = true, sort_order = excluded.sort_order,
          image_url = excluded.image_url, updated_at = now()
    returning id into v_combo_id;

    -- items (borrar y reinsertar)
    delete from emdino.combo_items where combo_id = v_combo_id;
    i := 0;
    for prod_slug in select jsonb_array_elements_text(rec.elem->'items')
    loop
      i := i + 1;
      select id into v_prod_id from emdino.products where store_id = v_store_id and slug = prod_slug;
      if v_prod_id is not null then
        insert into emdino.combo_items (store_id, combo_id, product_id, sort_order)
        values (v_store_id, v_combo_id, v_prod_id, i);
      else
        raise notice 'Producto % no encontrado para %', prod_slug, rec.elem->>'slug';
      end if;
    end loop;

    -- variantes (precio unico, sin descuento)
    for i in 1..3 loop
      insert into emdino.combo_variants (store_id, combo_id, label, price, compare_at_price, sort_order, active)
      values (v_store_id, v_combo_id, labels[i], (rec.elem->'prices'->>(i-1))::numeric, null, i*10, true)
      on conflict (combo_id, label) do update
        set price = excluded.price, compare_at_price = null, active = true, updated_at = now();
    end loop;
  end loop;

  raise notice 'Combos Dia del Padre creados.';
end $$;

-- ============================================================
-- 5) Actualizar RPC create_public_order: combos cobran el precio
--    del tamaño elegido (combo_variants), no el promo_price fijo.
--    Solo cambia la rama 'combo'; el resto es identico.
-- ============================================================
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
  select id into v_store_id from emdino.stores
   where slug = coalesce(payload->>'store_slug', 'emdino');
  if v_store_id is null then raise exception 'Store no encontrado'; end if;

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
  if v_delivery not in ('retiro','envio') then raise exception 'delivery_method invalido'; end if;

  insert into emdino.orders (
    store_id, customer_name, customer_phone, customer_document,
    city, address, delivery_method, notes, status, total
  ) values (
    v_store_id, v_customer->>'name', v_customer->>'phone', v_customer->>'document',
    v_customer->>'city', v_customer->>'address', v_delivery, v_customer->>'notes', 'nuevo', 0
  ) returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(payload->'items')
  loop
    v_idx := v_idx + 1;
    v_qty := greatest(1, coalesce((v_item->>'qty')::int, 1));

    if (v_item->>'type') = 'product' then
      select p.id, p.brand, p.name into v_product_id, v_brand, v_pname
        from emdino.products p
       where p.store_id = v_store_id and p.slug = v_item->>'product_slug' and p.active = true;
      if v_product_id is null then
        raise exception 'Producto no encontrado o inactivo: %', v_item->>'product_slug';
      end if;

      select v.id, v.price, v.label into v_variant_id, v_unit, v_variant_label
        from emdino.product_variants v
       where v.product_id = v_product_id and v.label = v_item->>'variant_label' and v.active = true;
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
       where c.store_id = v_store_id and c.slug = v_item->>'combo_slug' and c.active = true;
      if v_combo_id is null then
        raise exception 'Combo no encontrado o inactivo: %', v_item->>'combo_slug';
      end if;

      -- precio segun tamaño elegido (combo_variants); si no se envia, usa promo_price
      v_variant_label := v_item->>'variant_label';
      if v_variant_label is not null and length(v_variant_label) > 0 then
        select cv.price into v_unit
          from emdino.combo_variants cv
         where cv.combo_id = v_combo_id and cv.label = v_variant_label and cv.active = true;
        if v_unit is null then
          raise exception 'Variante de combo no encontrada: % %', v_item->>'combo_slug', v_variant_label;
        end if;
      else
        v_variant_label := null;
      end if;

      v_subtotal := v_unit * v_qty;

      insert into emdino.order_items (
        store_id, order_id, combo_id, item_type,
        name, variant_label, qty, unit_price, subtotal
      ) values (
        v_store_id, v_order_id, v_combo_id, 'combo',
        'Combo ' || v_name, v_variant_label, v_qty, v_unit, v_subtotal
      );

      v_msg_lines := v_msg_lines || (v_idx || '. Combo ' || v_name);
      if v_variant_label is not null then
        v_msg_lines := v_msg_lines || ('   Presentacion: ' || v_variant_label);
      end if;
      v_msg_lines := v_msg_lines || ('   Cantidad: ' || v_qty);
      v_msg_lines := v_msg_lines || ('   Precio unitario: Gs. ' || regexp_replace(round(v_unit)::text, '\B(?=(\d{3})+(?!\d))', '.', 'g'));
      v_msg_lines := v_msg_lines || ('   Subtotal: Gs. ' || regexp_replace(round(v_subtotal)::text, '\B(?=(\d{3})+(?!\d))', '.', 'g'));
      v_msg_lines := v_msg_lines || '';
    else
      raise exception 'item_type invalido';
    end if;

    v_total := v_total + v_subtotal;
  end loop;

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

  update emdino.orders set total = v_total, whatsapp_message = v_msg where id = v_order_id;

  return jsonb_build_object('order_id', v_order_id, 'total', v_total, 'whatsapp_message', v_msg);
end;
$$;
grant execute on function emdino.create_public_order(jsonb) to anon, authenticated;

-- recargar el cache de esquema de PostgREST para que vea combo_variants
notify pgrst, 'reload schema';
