-- ============================================================
-- EMDINO PERFUMERIA - rebrand de los 4 combos que conservaban nombre original
--   Fresh        -> Azure Privé      (+ se agrega Asad Zanzibar: 3 fragancias)
--   Línea Le Beau -> Paradise Noir
--   Nicho        -> Collection Privée
--   Irresistible -> Noir Allure
-- Los slugs NO cambian (combo-fresh, combo-linea-le-beau, combo-nicho,
-- combo-irresistible) para no romper referencias. Solo cambia name/tagline,
-- la imagen ya fue reemplazada en el repo, y se agrega un item a Azure Privé.
-- ============================================================
do $$
declare
  v_store_id uuid;
  v_combo_id uuid;
  v_prod_id uuid;
begin
  select id into v_store_id from emdino.stores where slug = 'emdino';
  if v_store_id is null then raise exception 'Store emdino no encontrado'; end if;

  -- combo-fresh -> Azure Privé (3 fragancias: YSL Y + Asad Zanzibar + Hawas Ice)
  update emdino.combos
     set name = 'Azure Privé',
         tagline = 'Frescura que impacta, elegancia que perdura',
         presentation = '3 fragancias · elegí tu tamaño',
         updated_at = now()
   where store_id = v_store_id and slug = 'combo-fresh'
  returning id into v_combo_id;

  if v_combo_id is not null then
    delete from emdino.combo_items where combo_id = v_combo_id;
    -- 1) YSL Y
    select id into v_prod_id from emdino.products where store_id = v_store_id and slug = 'ysl-y-edp';
    if v_prod_id is not null then insert into emdino.combo_items (store_id, combo_id, product_id, sort_order) values (v_store_id, v_combo_id, v_prod_id, 1); end if;
    -- 2) Asad Zanzibar (nuevo)
    select id into v_prod_id from emdino.products where store_id = v_store_id and slug = 'lattafa-asad-zanzibar';
    if v_prod_id is not null then insert into emdino.combo_items (store_id, combo_id, product_id, sort_order) values (v_store_id, v_combo_id, v_prod_id, 2); end if;
    -- 3) Hawas Ice
    select id into v_prod_id from emdino.products where store_id = v_store_id and slug = 'rasasi-hawas-ice';
    if v_prod_id is not null then insert into emdino.combo_items (store_id, combo_id, product_id, sort_order) values (v_store_id, v_combo_id, v_prod_id, 3); end if;
  end if;

  -- combo-linea-le-beau -> Paradise Noir
  update emdino.combos
     set name = 'Paradise Noir',
         tagline = 'Frescura tropical, elegancia irresistible',
         updated_at = now()
   where store_id = v_store_id and slug = 'combo-linea-le-beau';

  -- combo-nicho -> Collection Privée
  update emdino.combos
     set name = 'Collection Privée',
         tagline = 'Exclusividad en tres fragancias que dejan huella',
         updated_at = now()
   where store_id = v_store_id and slug = 'combo-nicho';

  -- combo-irresistible -> Noir Allure
  update emdino.combos
     set name = 'Noir Allure',
         tagline = 'Seducción, elegancia y exclusividad en cada esencia',
         updated_at = now()
   where store_id = v_store_id and slug = 'combo-irresistible';

  raise notice 'Rebrand de combos v3 aplicado.';
end $$;
