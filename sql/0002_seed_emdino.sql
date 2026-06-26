-- ============================================================
-- EMDINO PERFUMERÍA — seed inicial
-- Idempotente: usa ON CONFLICT DO NOTHING/UPDATE.
-- Toma los datos actuales de src/data/catalogs.js y src/data/combos.js.
-- Aplicar DESPUES de 0001_init_emdino.sql
-- ============================================================

-- A) Store -----------------------------------------------------
insert into emdino.stores (name, slug) values
  ('Emdino Perfumeria', 'emdino')
on conflict (slug) do nothing;

-- B) Settings iniciales ----------------------------------------
with s as (select id from emdino.stores where slug = 'emdino')
insert into emdino.settings (store_id, key, value)
select s.id, k.key, k.value::jsonb from s, (values
  ('whatsapp_number',    '"595972562362"'),
  ('whatsapp_display',   '"0972 562 362"'),
  ('instagram_handle',   '"@emdinoo__"'),
  ('instagram_url',      '"https://instagram.com/emdinoo__"'),
  ('free_shipping_from', '300000'),
  ('show_female_catalog', 'false')
) as k(key, value)
on conflict (store_id, key) do nothing;

-- C) Categorías ------------------------------------------------
with s as (select id from emdino.stores where slug = 'emdino')
insert into emdino.perfume_categories (store_id, name, slug, description, sort_order)
select s.id, c.name, c.slug, c.description, c.so from s, (values
  ('Diseñador', 'disenador', 'Las casas de moda y sus iconos contemporaneos.', 1),
  ('Árabe',     'arabe',     'Estelas potentes y dulces del Medio Oriente.',   2),
  ('Nicho',     'nicho',     'Perfumeria de autor, rara y de alta concentracion.', 3)
) as c(name, slug, description, so)
on conflict (store_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

-- ============================================================
-- D) Productos masculinos (catalogo actual)
-- Las imagenes se sirven desde /assets/perfumes/<slug>.jpg (path
-- relativo a la raiz publica del sitio).
-- ============================================================
with s as (select id as store_id from emdino.stores where slug = 'emdino'),
     cat as (select slug, id as category_id from emdino.perfume_categories
              where store_id = (select store_id from s))
insert into emdino.products
  (store_id, category_id, slug, name, brand, gender, main_image_url, active, sort_order)
select
  s.store_id, c.category_id, p.slug, p.name, p.brand, 'masculino',
  case when p.has_image then '/assets/perfumes/' || p.slug || '.jpg' else null end,
  true, p.so
from s
cross join (values
  -- Diseñador
  ('disenador', 'jpg-le-beau-edt',            'Le Beau EDT',                       'Jean Paul Gaultier', true,  10),
  ('disenador', 'jpg-le-male-elixir',         'Le Male Elixir',                    'Jean Paul Gaultier', true,  20),
  ('disenador', 'jpg-le-beau-le-parfum',      'Le Beau Le Parfum',                 'Jean Paul Gaultier', true,  30),
  ('disenador', 'jpg-le-male-le-parfum',      'Le Male Le Parfum',                 'Jean Paul Gaultier', true,  40),
  ('disenador', 'jpg-le-beau-paradise-garden','Le Beau Paradise Garden',           'Jean Paul Gaultier', true,  50),
  ('disenador', 'jpg-scandal-le-parfum',      'Scandal Pour Homme Le Parfum',      'Jean Paul Gaultier', true,  60),
  ('disenador', 'jpg-scandal-absolu',         'Scandal Pour Homme Absolu',         'Jean Paul Gaultier', true,  70),
  ('disenador', 'jpg-scandal-ph',             'Scandal Pour Homme',                'Jean Paul Gaultier', true,  80),
  ('disenador', 'armani-adg-parfum',          'Acqua Di Giò Parfum',               'Giorgio Armani',     true,  90),
  ('disenador', 'armani-adg-edt',             'Acqua Di Giò EDT',                  'Giorgio Armani',     true, 100),
  ('disenador', 'armani-adg-profondo',        'Acqua Di Giò Profondo',             'Giorgio Armani',     true, 110),
  ('disenador', 'armani-swy-intensely',       'Stronger With You Intensely',       'Emporio Armani',     true, 120),
  ('disenador', 'armani-swy-edt',             'Stronger With You EDT',             'Emporio Armani',     true, 130),
  ('disenador', 'armani-swy-powerfully',      'Stronger With You Powerfully',      'Emporio Armani',     true, 135),
  ('disenador', 'azzaro-most-wanted-parfum',  'The Most Wanted Parfum',            'Azzaro',             true, 140),
  ('disenador', 'azzaro-most-wanted-intense', 'The Most Wanted Intense',           'Azzaro',             true, 150),
  ('disenador', 'bvlgari-man-in-black',       'Man In Black',                      'Bvlgari',            true, 160),
  ('disenador', 'valentino-bir-intense',      'Born In Roma Uomo Intense',         'Valentino',          true, 170),
  ('disenador', 'valentino-coral-fantasy',    'Born In Roma Coral Fantasy',        'Valentino',          true, 180),
  ('disenador', 'versace-eros',               'Eros EDT',                          'Versace',            true, 190),
  ('disenador', 'versace-eros-flame',         'Eros Flame',                        'Versace',            true, 200),
  ('disenador', 'versace-dylan-blue',         'Pour Homme Dylan Blue',             'Versace',            true, 210),
  ('disenador', 'pr-invictus-victory-elixir', 'Invictus Victory Elixir',           'Paco Rabanne',       true, 220),
  ('disenador', 'dior-homme-intense',         'Dior Homme Intense',                'Dior',               true, 230),
  ('disenador', 'ysl-myslf',                  'MYSLF EDP',                         'Yves Saint Laurent', true, 240),
  ('disenador', 'ysl-y-edp',                  'Y Eau de Parfum',                   'Yves Saint Laurent', true, 250),
  ('disenador', 'vr-spicebomb-extreme',       'Spicebomb Extreme',                 'Viktor & Rolf',      true, 260),
  ('disenador', 'mb-legend-spirit',           'Legend Spirit',                     'Mont Blanc',         true, 270),
  ('disenador', 'im-leau-dissey',             'L''Eau d''Issey Pour Homme',        'Issey Miyake',       false,280),
  ('disenador', 'givenchy-reserve-privee',    'Gentleman Reserve Privee',          'Givenchy',           true, 290),
  ('disenador', 'dg-light-blue',              'Light Blue Pour Homme',             'Dolce & Gabbana',    true, 300),
  ('disenador', 'ch-212-vip-black',           '212 VIP Black',                     'Carolina Herrera',   true, 310),
  ('disenador', 'chanel-allure-sport-extreme','Allure Homme Sport Eau Extreme',    'Chanel',             true, 320),
  ('disenador', 'prada-lhomme-intense',       'L''Homme Intense',                  'Prada',              true, 330),
  -- Arabe
  ('arabe', 'afnan-9pm',                  '9PM EDP',                'Afnan',          true, 1010),
  ('arabe', 'afnan-9pm-night-out',        '9PM Night Out',          'Afnan',          true, 1020),
  ('arabe', 'afnan-9pm-rebel',            '9PM Rebel',              'Afnan',          true, 1030),
  ('arabe', 'afnan-turathi-blue',         'Turathi Blue',           'Afnan',          true, 1040),
  ('arabe', 'afnan-turathi-electric',     'Turathi Electric',       'Afnan',          true, 1050),
  ('arabe', 'lattafa-qaed-al-fursan',     'Qaed Al Fursan',         'Lattafa',        true, 1060),
  ('arabe', 'lattafa-asad',               'Asad',                   'Lattafa',        true, 1070),
  ('arabe', 'lattafa-asad-zanzibar',      'Asad Zanzibar',          'Lattafa',        true, 1080),
  ('arabe', 'lattafa-asad-bourbon',       'Asad Bourbon',           'Lattafa',        true, 1090),
  ('arabe', 'lattafa-khamrah',            'Khamrah',                'Lattafa',        true, 1100),
  ('arabe', 'lattafa-khamrah-dukhan',     'Khamrah Dukhan',         'Lattafa',        true, 1110),
  ('arabe', 'lattafa-khamrah-qahwa',      'Khamrah Qahwa',          'Lattafa',        true, 1120),
  ('arabe', 'lattafa-hayaati',            'Hayaati',                'Lattafa',        true, 1130),
  ('arabe', 'lattafa-ramz-silver',        'Ramz Silver',            'Lattafa',        true, 1140),
  ('arabe', 'armaf-cdn-intense',          'Club de Nuit Intense',   'Armaf',          true, 1150),
  ('arabe', 'armaf-cdn-iconic',           'Club de Nuit Iconic',    'Armaf',          true, 1160),
  ('arabe', 'armaf-cdn-precieux',         'Club de Nuit Precieux',  'Armaf',          true, 1170),
  ('arabe', 'armaf-mandarin-sky',         'Mandarin Sky',           'Armaf',          true, 1180),
  ('arabe', 'rasasi-hawas-ice',           'Hawas Ice',              'Rasasi',         true, 1190),
  ('arabe', 'rasasi-hawas-elixir',        'Hawas Elixir',           'Rasasi',         true, 1200),
  ('arabe', 'rasasi-hawas-fire',          'Hawas Fire',             'Rasasi',         true, 1210),
  ('arabe', 'rasasi-hawas-black',         'Hawas Black',            'Rasasi',         true, 1220),
  ('arabe', 'rasasi-hawas-kobra',         'Hawas Kobra',            'Rasasi',         true, 1230),
  ('arabe', 'rasasi-hawas-tropical',      'Hawas Tropical',         'Rasasi',         true, 1240),
  ('arabe', 'rayhaan-elixir',             'Rayhaan Elixir',         'Rayhaan',        true, 1250),
  ('arabe', 'alharamain-amber-oud-gold',  'Amber Oud Gold Edition', 'Al Haramain',    true, 1260),
  ('arabe', 'alharamain-amber-oud-aqua-dubai','Amber Oud Aqua Dubai','Al Haramain',   true, 1270),
  ('arabe', 'bharara-king',               'King',                   'Bharara',        true, 1280),
  ('arabe', 'fa-liquid-brun',             'Liquid Brun',            'French Avenue',  true, 1290),
  ('arabe', 'fa-vulcan-feu',              'Vulcan Feu',             'French Avenue',  true, 1300),
  -- Nicho
  ('nicho', 'xerjoff-erba-pura',     'Erba Pura',       'Xerjoff',          true, 2010),
  ('nicho', 'xerjoff-naxos',         'Naxos',           'Xerjoff',          true, 2020),
  ('nicho', 'pdm-layton',            'Layton',          'Parfums de Marly', true, 2030),
  ('nicho', 'nishane-hacivat',       'Hacivat',         'Nishane',          true, 2040),
  ('nicho', 'tf-ombre-leather',      'Ombre Leather',   'Tom Ford',         true, 2050),
  ('nicho', 'ed-espada-guarani',     'Espada Guarani',  'Estella Dustin',   true, 2060)
) as p(cat_slug, slug, name, brand, has_image, so)
join cat c on c.slug = p.cat_slug
on conflict (store_id, slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  category_id = excluded.category_id,
  main_image_url = excluded.main_image_url,
  sort_order = excluded.sort_order;

-- ============================================================
-- E) Variantes por producto (3ml / 5ml / 10ml / 30ml)
-- Precios reales tomados de src/data/catalogs.js
-- ============================================================
-- Helper inline: para cada (slug, p3, p5, p10, p30) insertar 4 variantes
with prices(slug, p3, p5, p10, p30) as (values
  -- Diseñador
  ('jpg-le-beau-edt',            35000, 50000, 80000, 250000),
  ('jpg-le-male-elixir',         45000, 66000, 110000, 300000),
  ('jpg-le-beau-le-parfum',      50000, 66000, 110000, 350000),
  ('jpg-le-male-le-parfum',      44000, 66000, 110000, 300000),
  ('jpg-le-beau-paradise-garden',43000, 65000, 110000, 295000),
  ('jpg-scandal-le-parfum',      50000, 65000, 115000, 360000),
  ('jpg-scandal-absolu',         50000, 65000, 115000, 360000),
  ('jpg-scandal-ph',             36000, 65000, 95000, 260000),
  ('armani-adg-parfum',          50000, 80000, 125000, 325000),
  ('armani-adg-edt',             35000, 50000, 90000, 230000),
  ('armani-adg-profondo',        45000, 65000, 125000, 295000),
  ('armani-swy-intensely',       43000, 65000, 110000, 300000),
  ('armani-swy-edt',             43000, 65000, 110000, 300000),
  ('armani-swy-powerfully',      43000, 65000, 110000, 300000),
  ('azzaro-most-wanted-parfum',  44000, 66000, 110000, 295000),
  ('azzaro-most-wanted-intense', 45000, 65000, 110000, 300000),
  ('bvlgari-man-in-black',       50000, 70000, 120000, 355000),
  ('valentino-bir-intense',      56000, 75000, 135000, 400000),
  ('valentino-coral-fantasy',    48000, 70000, 120000, 350000),
  ('versace-eros',               32000, 48000, 80000, 250000),
  ('versace-eros-flame',         35000, 48000, 80000, 220000),
  ('versace-dylan-blue',         35000, 55000, 85000, 220000),
  ('pr-invictus-victory-elixir', 45000, 57000, 100000, 300000),
  ('dior-homme-intense',         46000, 70000, 120000, 330000),
  ('ysl-myslf',                  50000, 70000, 120000, 350000),
  ('ysl-y-edp',                  48000, 70000, 120000, 340000),
  ('vr-spicebomb-extreme',       45000, 65000, 120000, 350000),
  ('mb-legend-spirit',           35000, 45000, 65000, 155000),
  ('im-leau-dissey',             30000, 40000, 60000, 180000),
  ('givenchy-reserve-privee',    46000, 66000, 110000, 330000),
  ('dg-light-blue',              38000, 60000, 90000, 280000),
  ('ch-212-vip-black',           45000, 60000, 100000, 280000),
  ('chanel-allure-sport-extreme',60000,100000,180000, 556000),
  ('prada-lhomme-intense',       50000, 75000, 135000, 330000),
  -- Arabe
  ('afnan-9pm',                  25000, 35000, 50000, 130000),
  ('afnan-9pm-night-out',        30000, 45000, 70000, 180000),
  ('afnan-9pm-rebel',            28000, 40000, 60000, 135000),
  ('afnan-turathi-blue',         28000, 40000, 60000, 135000),
  ('afnan-turathi-electric',     28000, 40000, 60000, 135000),
  ('lattafa-qaed-al-fursan',     25000, 35000, 50000, 130000),
  ('lattafa-asad',               25000, 35000, 50000, 128000),
  ('lattafa-asad-zanzibar',      25000, 35000, 45000, 130000),
  ('lattafa-asad-bourbon',       28000, 38000, 56000, 145000),
  ('lattafa-khamrah',            25000, 45000, 70000, 128000),
  ('lattafa-khamrah-dukhan',     28000, 45000, 70000, 128000),
  ('lattafa-khamrah-qahwa',      28000, 45000, 70000, 128000),
  ('lattafa-hayaati',            28000, 35000, 50000, 130000),
  ('lattafa-ramz-silver',        28000, 40000, 60000, 130000),
  ('armaf-cdn-intense',          30000, 40000, 60000, 150000),
  ('armaf-cdn-iconic',           28000, 40000, 60000, 155000),
  ('armaf-cdn-precieux',         40000, 60000, 100000, 255000),
  ('armaf-mandarin-sky',         25000, 35000, 50000, 128000),
  ('rasasi-hawas-ice',           30000, 45000, 60000, 160000),
  ('rasasi-hawas-elixir',        30000, 40000, 60000, 150000),
  ('rasasi-hawas-fire',          30000, 40000, 60000, 155000),
  ('rasasi-hawas-black',         30000, 45000, 60000, 150000),
  ('rasasi-hawas-kobra',         30000, 40000, 60000, 160000),
  ('rasasi-hawas-tropical',      30000, 40000, 60000, 160000),
  ('rayhaan-elixir',             25000, 38000, 58000, 130000),
  ('alharamain-amber-oud-gold',  30000, 45000, 70000, 180000),
  ('alharamain-amber-oud-aqua-dubai',30000,45000,70000,190000),
  ('bharara-king',               30000, 45000, 70000, 185000),
  ('fa-liquid-brun',             28000, 38000, 56000, 160000),
  ('fa-vulcan-feu',              30000, 45000, 70000, 180000),
  -- Nicho
  ('xerjoff-erba-pura',          85000, 120000, 210000, 650000),
  ('xerjoff-naxos',              85000, 130000, 240000, 660000),
  ('pdm-layton',                 80000, 120000, 220000, 660000),
  ('nishane-hacivat',            85000, 140000, 240000, 660000),
  ('tf-ombre-leather',           80000, 140000, 240000, 660000),
  ('ed-espada-guarani',          30000, 40000, 55000, 150000)
),
sp as (
  select pr.slug, p.id as product_id, p.store_id,
         pr.p3, pr.p5, pr.p10, pr.p30
    from prices pr
    join emdino.products p
      on p.slug = pr.slug
     and p.store_id = (select id from emdino.stores where slug='emdino')
),
expanded as (
  select store_id, product_id, slug, '3ml'  as label,  3 as ml, p3  as price, 1 as so from sp
  union all
  select store_id, product_id, slug, '5ml'  as label,  5 as ml, p5  as price, 2 as so from sp
  union all
  select store_id, product_id, slug, '10ml' as label, 10 as ml, p10 as price, 3 as so from sp
  union all
  select store_id, product_id, slug, '30ml' as label, 30 as ml, p30 as price, 4 as so from sp
)
insert into emdino.product_variants
  (store_id, product_id, label, volume_ml, sku, price, stock, stock_minimum, active, sort_order)
select store_id, product_id, label, ml,
       'EMDINO-' || upper(replace(slug,'-','_')) || '-' || replace(label,'ml','') || 'ML',
       price, 0, 0, true, so
from expanded
on conflict do nothing;

-- ============================================================
-- F) Combos (precios y descripciones reales de src/data/combos.js)
-- ============================================================
with s as (select id as store_id from emdino.stores where slug='emdino')
insert into emdino.combos
  (store_id, slug, name, tagline, presentation, normal_price, promo_price, featured, active, sort_order)
select s.store_id, c.slug, c.name, c.tagline, c.pres, c.norm, c.promo, c.feat, true, c.so from s,
(values
  ('combo-party',      'Party',       'Para encender la noche',     '3 decants · 5 ml', 160000, 150000, true,  10),
  ('combo-mix',        'Mix',         'Versatil, de dia y de noche','3 decants · 5 ml', 165000, 155000, false, 20),
  ('combo-fresh',      'Fresh',       'Frescura para todo el dia',  '3 decants · 3 ml', 108000, 102000, false, 30),
  ('combo-irresistible','Irresistible','Los que dejan huella',      '3 decants · 5 ml', 165000, 155000, false, 40),
  ('combo-black',      'Black',       'Arabes intensos',            '3 decants · 5 ml', 125000, 115000, false, 50),
  ('combo-intenso',    'Intenso',     'Estela de maxima potencia',  '3 decants · 5 ml', 187000, 175000, false, 60),
  ('combo-elite',      'Élite',       'Diseñador, de pura firma',   '3 decants · 5 ml', 183000, 172000, false, 70),
  ('combo-oud-royale', 'Oud Royale',  'Lujo arabe, dulce y oscuro', '3 decants · 5 ml', 125000, 116000, false, 80),
  ('combo-vertigo',    'Vértigo',     'Noche intensa y magnetica',  '3 decants · 5 ml', 171000, 160000, false, 90)
) as c(slug, name, tagline, pres, norm, promo, feat, so)
on conflict (store_id, slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  presentation = excluded.presentation,
  normal_price = excluded.normal_price,
  promo_price = excluded.promo_price,
  featured = excluded.featured,
  sort_order = excluded.sort_order;

-- ============================================================
-- G) combo_items: relacion combo - productos
-- ============================================================
-- Borrar y reinsertar es lo mas simple para mantener idempotencia
with s as (select id as store_id from emdino.stores where slug='emdino')
delete from emdino.combo_items where store_id = (select store_id from s);

with s as (select id as store_id from emdino.stores where slug='emdino'),
items(combo_slug, product_slug, so) as (values
  ('combo-party',       'versace-eros',              1),
  ('combo-party',       'jpg-le-male-elixir',        2),
  ('combo-party',       'lattafa-khamrah',           3),
  ('combo-mix',         'ysl-y-edp',                 1),
  ('combo-mix',         'jpg-le-beau-edt',           2),
  ('combo-mix',         'armaf-cdn-intense',         3),
  ('combo-fresh',       'ysl-y-edp',                 1),
  ('combo-fresh',       'rasasi-hawas-ice',          2),
  ('combo-fresh',       'fa-vulcan-feu',             3),
  ('combo-irresistible','jpg-le-male-elixir',        1),
  ('combo-irresistible','jpg-le-beau-edt',           2),
  ('combo-irresistible','versace-eros-flame',        3),
  ('combo-black',       'lattafa-asad',              1),
  ('combo-black',       'lattafa-khamrah-dukhan',    2),
  ('combo-black',       'rasasi-hawas-black',        3),
  ('combo-intenso',     'armani-swy-intensely',      1),
  ('combo-intenso',     'pr-invictus-victory-elixir',2),
  ('combo-intenso',     'vr-spicebomb-extreme',      3),
  ('combo-elite',       'versace-eros',              1),
  ('combo-elite',       'armani-swy-intensely',      2),
  ('combo-elite',       'ysl-y-edp',                 3),
  ('combo-oud-royale',  'lattafa-khamrah',           1),
  ('combo-oud-royale',  'lattafa-asad',              2),
  ('combo-oud-royale',  'rasasi-hawas-black',        3),
  ('combo-vertigo',     'jpg-le-male-elixir',        1),
  ('combo-vertigo',     'pr-invictus-victory-elixir',2),
  ('combo-vertigo',     'versace-eros-flame',        3)
)
insert into emdino.combo_items (store_id, combo_id, product_id, sort_order)
select s.store_id, c.id, p.id, i.so
from s
cross join items i
join emdino.combos   c on c.slug = i.combo_slug   and c.store_id = s.store_id
join emdino.products p on p.slug = i.product_slug and p.store_id = s.store_id;

-- ============================================================
-- FIN 0002_seed_emdino.sql
--
-- DESPUES DE EJECUTAR:
--
-- 1) Crear usuario admin en Supabase Auth (UI o Dashboard).
-- 2) Asignar profile con role admin:
--
--    insert into emdino.profiles (id, store_id, email, role)
--    select 'UUID_DEL_USUARIO_AUTH', s.id, 'admin@email.com', 'admin'
--    from emdino.stores s where s.slug = 'emdino';
--
-- 3) Exponer schema (NO SOBREESCRIBIR los schemas existentes):
--
--    cd /root/supabase/docker
--    ./exponer-schema.sh emdino
--
--    Verificar:
--      grep '^PGRST_DB_SCHEMAS=' .env
--      docker compose exec rest env | grep PGRST_DB_SCHEMAS
--      docker compose logs rest --tail=100
-- ============================================================
