-- ============================================================
-- EMDINO PERFUMERIA - sync de combos con mmfragrances
-- (categoria DECANTS COMBOS al 2026-06-16)
--
-- Aplicar como postgres en SQL Editor de Supabase.
-- Idempotente: corre las veces que quieras.
-- ============================================================

do $$
declare
  v_store_id uuid;
begin
  select id into v_store_id from emdino.stores where slug = 'emdino';
  if v_store_id is null then
    raise exception 'Store emdino no encontrado';
  end if;

  -- ===== UPSERT de los 9 combos vigentes =====
  insert into emdino.combos (store_id, slug, name, tagline, presentation, normal_price, promo_price, featured, active, sort_order, image_url)
  values
    (v_store_id, 'combo-party',         'Party',        'Para encender la noche',     '3 decants · 5 ml', 160000, 150000, true,  true, 10, '/assets/combos/combo-party.jpg'),
    (v_store_id, 'combo-citas',         'Citas',        'Para conquistar',            '3 decants · 5 ml', 120000, 110000, false, true, 20, '/assets/combos/combo-citas.jpg'),
    (v_store_id, 'combo-mix',           'Mix',          'Versatil, de dia y de noche','3 decants · 5 ml', 165000, 155000, false, true, 30, '/assets/combos/combo-mix.jpg'),
    (v_store_id, 'combo-fresh',         'Fresh',        'Frescura para todo el dia',  '3 decants · 5 ml', 108000, 102000, false, true, 40, '/assets/combos/combo-fresh.jpg'),
    (v_store_id, 'combo-irresistible',  'Irresistible', 'Los que dejan huella',       '3 decants · 5 ml', 165000, 155000, false, true, 50, '/assets/combos/combo-irresistible.jpg'),
    (v_store_id, 'combo-boliche',       'Boliche',      'Estela para la noche',       '3 decants · 5 ml',  78000,  70000, false, true, 60, '/assets/combos/combo-boliche.jpg'),
    (v_store_id, 'combo-linea-le-beau', 'Linea Le Beau','Toda la familia Le Beau',    '3 decants · 5 ml', 120000, 110000, false, true, 70, '/assets/combos/combo-linea-le-beau.jpg'),
    (v_store_id, 'combo-best-sellers',  'Best Sellers', 'Los que mas se venden',      '3 decants · 5 ml', 185000, 175000, true,  true, 80, '/assets/combos/combo-best-sellers.jpg'),
    (v_store_id, 'combo-nicho',         'Nicho',        'Perfumeria de autor',        '3 decants · 5 ml', 220000, 205000, false, true, 90, '/assets/combos/combo-nicho.jpg')
  on conflict (store_id, slug) do update set
    name = excluded.name,
    tagline = excluded.tagline,
    presentation = excluded.presentation,
    normal_price = excluded.normal_price,
    promo_price = excluded.promo_price,
    featured = excluded.featured,
    active = true,
    sort_order = excluded.sort_order,
    image_url = excluded.image_url;

  -- ===== Desactivar combos viejos que ya no estan en mmfragrances =====
  update emdino.combos set active = false
   where store_id = v_store_id
     and slug in ('combo-black','combo-intenso','combo-elite','combo-oud-royale','combo-vertigo');

  -- ===== Reemplazar items: borrar todos los items de los 9 combos y reinsertar =====
  delete from emdino.combo_items
   where store_id = v_store_id
     and combo_id in (select id from emdino.combos where store_id = v_store_id and slug in (
       'combo-party','combo-citas','combo-mix','combo-fresh','combo-irresistible',
       'combo-boliche','combo-linea-le-beau','combo-best-sellers','combo-nicho'
     ));

  insert into emdino.combo_items (store_id, combo_id, product_id, sort_order)
  select v_store_id, c.id, p.id, i.sort_order
  from (values
    -- combo_slug, product_slug, sort_order
    ('combo-party',         'versace-eros-flame',         1),
    ('combo-party',         'xerjoff-erba-pura',          2),
    ('combo-party',         'jpg-le-male-elixir',         3),

    ('combo-citas',         'armani-swy-edt',             1),
    ('combo-citas',         'fa-liquid-brun',             2),
    ('combo-citas',         'azzaro-most-wanted-parfum',  3),

    ('combo-mix',           'valentino-bir-intense',      1),
    ('combo-mix',           'ysl-y-edp',                  2),
    ('combo-mix',           'jpg-le-male-le-parfum',      3),

    ('combo-fresh',         'ysl-y-edp',                  1),
    ('combo-fresh',         'rasasi-hawas-ice',           2),

    ('combo-irresistible',  'armani-swy-intensely',       1),
    ('combo-irresistible',  'valentino-bir-intense',      2),
    ('combo-irresistible',  'jpg-le-beau-le-parfum',      3),

    ('combo-boliche',       'alharamain-amber-oud-gold',  1),
    ('combo-boliche',       'armaf-mandarin-sky',         2),
    ('combo-boliche',       'afnan-9pm-rebel',            3),

    ('combo-linea-le-beau', 'jpg-le-beau-edt',            1),
    ('combo-linea-le-beau', 'jpg-le-beau-le-parfum',      2),
    ('combo-linea-le-beau', 'jpg-le-beau-paradise-garden',3),

    ('combo-best-sellers',  'armani-adg-profondo',        1),
    ('combo-best-sellers',  'xerjoff-erba-pura',          2),
    ('combo-best-sellers',  'valentino-bir-intense',      3),

    ('combo-nicho',         'xerjoff-erba-pura',          1),
    ('combo-nicho',         'pdm-layton',                 2),
    ('combo-nicho',         'xerjoff-naxos',              3)
  ) as i(combo_slug, product_slug, sort_order)
  join emdino.combos c on c.slug = i.combo_slug and c.store_id = v_store_id
  join emdino.products p on p.slug = i.product_slug and p.store_id = v_store_id;

  raise notice 'Combos sincronizados: 9 activos, 5 desactivados.';
end $$;

-- Verificacion:
-- select c.slug, c.name, c.promo_price, c.active, c.image_url, count(ci.id) as items
-- from emdino.combos c
-- left join emdino.combo_items ci on ci.combo_id = c.id
-- where c.store_id = (select id from emdino.stores where slug = 'emdino')
-- group by c.slug, c.name, c.promo_price, c.active, c.image_url, c.sort_order
-- order by c.sort_order;
