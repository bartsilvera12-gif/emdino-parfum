-- ============================================================
-- EMDINO PERFUMERIA - update de precios desde mmfragrances
-- Generado por scrape automatizado, validado con catalogs.js actual.
-- 
-- Excluye 2 productos por race-condition del scraper:
--   mm 62199 (212 VIP Black) y 63825 (Ombre Leather)
-- Si los queres actualizar despues, hace lo manual desde el panel admin.
-- 
-- Idempotente: corre las veces que quieras.
-- Aplicar como postgres en el SQL Editor.
-- ============================================================

do $$
declare
  v_store_id uuid;
  v_count int := 0;
begin
  select id into v_store_id from emdino.stores where slug = 'emdino';
  if v_store_id is null then
    raise exception 'Store emdino no encontrado';
  end if;

  -- jpg-le-beau-le-parfum
  update emdino.product_variants v set price = 75000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-le-beau-le-parfum' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-le-beau-le-parfum 5ml: % filas (em=66000 -> mm=75000)', v_count;
  update emdino.product_variants v set price = 130000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-le-beau-le-parfum' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-le-beau-le-parfum 10ml: % filas (em=110000 -> mm=130000)', v_count;
  -- jpg-le-beau-paradise-garden
  update emdino.product_variants v set price = 40000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-le-beau-paradise-garden' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-le-beau-paradise-garden 3ml: % filas (em=43000 -> mm=40000)', v_count;
  update emdino.product_variants v set price = 60000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-le-beau-paradise-garden' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-le-beau-paradise-garden 5ml: % filas (em=65000 -> mm=60000)', v_count;
  update emdino.product_variants v set price = 290000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-le-beau-paradise-garden' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-le-beau-paradise-garden 30ml: % filas (em=295000 -> mm=290000)', v_count;
  -- jpg-le-beau-edt
  update emdino.product_variants v set price = 40000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-le-beau-edt' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-le-beau-edt 3ml: % filas (em=35000 -> mm=40000)', v_count;
  update emdino.product_variants v set price = 60000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-le-beau-edt' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-le-beau-edt 5ml: % filas (em=50000 -> mm=60000)', v_count;
  update emdino.product_variants v set price = 100000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-le-beau-edt' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-le-beau-edt 10ml: % filas (em=80000 -> mm=100000)', v_count;
  update emdino.product_variants v set price = 260000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-le-beau-edt' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-le-beau-edt 30ml: % filas (em=250000 -> mm=260000)', v_count;
  -- jpg-le-male-elixir
  update emdino.product_variants v set price = 40000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-le-male-elixir' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-le-male-elixir 3ml: % filas (em=45000 -> mm=40000)', v_count;
  update emdino.product_variants v set price = 60000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-le-male-elixir' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-le-male-elixir 5ml: % filas (em=66000 -> mm=60000)', v_count;
  update emdino.product_variants v set price = 115000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-le-male-elixir' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-le-male-elixir 10ml: % filas (em=110000 -> mm=115000)', v_count;
  -- jpg-le-male-le-parfum
  update emdino.product_variants v set price = 45000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-le-male-le-parfum' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-le-male-le-parfum 3ml: % filas (em=44000 -> mm=45000)', v_count;
  update emdino.product_variants v set price = 65000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-le-male-le-parfum' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-le-male-le-parfum 5ml: % filas (em=66000 -> mm=65000)', v_count;
  update emdino.product_variants v set price = 115000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-le-male-le-parfum' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-le-male-le-parfum 10ml: % filas (em=110000 -> mm=115000)', v_count;
  update emdino.product_variants v set price = 295000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-le-male-le-parfum' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-le-male-le-parfum 30ml: % filas (em=300000 -> mm=295000)', v_count;
  -- jpg-scandal-le-parfum
  update emdino.product_variants v set price = 45000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-scandal-le-parfum' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-scandal-le-parfum 3ml: % filas (em=50000 -> mm=45000)', v_count;
  update emdino.product_variants v set price = 110000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-scandal-le-parfum' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-scandal-le-parfum 10ml: % filas (em=115000 -> mm=110000)', v_count;
  update emdino.product_variants v set price = 320000 from emdino.products p where v.product_id = p.id and p.slug = 'jpg-scandal-le-parfum' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'jpg-scandal-le-parfum 30ml: % filas (em=360000 -> mm=320000)', v_count;
  -- valentino-bir-intense
  update emdino.product_variants v set price = 75000 from emdino.products p where v.product_id = p.id and p.slug = 'valentino-bir-intense' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'valentino-bir-intense 3ml: % filas (em=56000 -> mm=75000)', v_count;
  update emdino.product_variants v set price = 105000 from emdino.products p where v.product_id = p.id and p.slug = 'valentino-bir-intense' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'valentino-bir-intense 5ml: % filas (em=75000 -> mm=105000)', v_count;
  update emdino.product_variants v set price = 180000 from emdino.products p where v.product_id = p.id and p.slug = 'valentino-bir-intense' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'valentino-bir-intense 10ml: % filas (em=135000 -> mm=180000)', v_count;
  update emdino.product_variants v set price = 510000 from emdino.products p where v.product_id = p.id and p.slug = 'valentino-bir-intense' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'valentino-bir-intense 30ml: % filas (em=400000 -> mm=510000)', v_count;
  -- valentino-coral-fantasy
  update emdino.product_variants v set price = 45000 from emdino.products p where v.product_id = p.id and p.slug = 'valentino-coral-fantasy' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'valentino-coral-fantasy 3ml: % filas (em=48000 -> mm=45000)', v_count;
  update emdino.product_variants v set price = 65000 from emdino.products p where v.product_id = p.id and p.slug = 'valentino-coral-fantasy' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'valentino-coral-fantasy 5ml: % filas (em=70000 -> mm=65000)', v_count;
  -- armani-swy-intensely
  update emdino.product_variants v set price = 50000 from emdino.products p where v.product_id = p.id and p.slug = 'armani-swy-intensely' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'armani-swy-intensely 3ml: % filas (em=43000 -> mm=50000)', v_count;
  update emdino.product_variants v set price = 70000 from emdino.products p where v.product_id = p.id and p.slug = 'armani-swy-intensely' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'armani-swy-intensely 5ml: % filas (em=65000 -> mm=70000)', v_count;
  update emdino.product_variants v set price = 125000 from emdino.products p where v.product_id = p.id and p.slug = 'armani-swy-intensely' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'armani-swy-intensely 10ml: % filas (em=110000 -> mm=125000)', v_count;
  update emdino.product_variants v set price = 355000 from emdino.products p where v.product_id = p.id and p.slug = 'armani-swy-intensely' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'armani-swy-intensely 30ml: % filas (em=300000 -> mm=355000)', v_count;
  -- armani-adg-profondo
  update emdino.product_variants v set price = 50000 from emdino.products p where v.product_id = p.id and p.slug = 'armani-adg-profondo' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'armani-adg-profondo 3ml: % filas (em=45000 -> mm=50000)', v_count;
  update emdino.product_variants v set price = 70000 from emdino.products p where v.product_id = p.id and p.slug = 'armani-adg-profondo' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'armani-adg-profondo 5ml: % filas (em=65000 -> mm=70000)', v_count;
  update emdino.product_variants v set price = 355000 from emdino.products p where v.product_id = p.id and p.slug = 'armani-adg-profondo' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'armani-adg-profondo 30ml: % filas (em=295000 -> mm=355000)', v_count;
  -- armani-adg-parfum
  update emdino.product_variants v set price = 70000 from emdino.products p where v.product_id = p.id and p.slug = 'armani-adg-parfum' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'armani-adg-parfum 5ml: % filas (em=80000 -> mm=70000)', v_count;
  -- rasasi-hawas-ice
  update emdino.product_variants v set price = 28000 from emdino.products p where v.product_id = p.id and p.slug = 'rasasi-hawas-ice' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'rasasi-hawas-ice 3ml: % filas (em=30000 -> mm=28000)', v_count;
  update emdino.product_variants v set price = 40000 from emdino.products p where v.product_id = p.id and p.slug = 'rasasi-hawas-ice' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'rasasi-hawas-ice 5ml: % filas (em=45000 -> mm=40000)', v_count;
  update emdino.product_variants v set price = 75000 from emdino.products p where v.product_id = p.id and p.slug = 'rasasi-hawas-ice' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'rasasi-hawas-ice 10ml: % filas (em=60000 -> mm=75000)', v_count;
  update emdino.product_variants v set price = 150000 from emdino.products p where v.product_id = p.id and p.slug = 'rasasi-hawas-ice' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'rasasi-hawas-ice 30ml: % filas (em=160000 -> mm=150000)', v_count;
  -- bharara-king
  update emdino.product_variants v set price = 40000 from emdino.products p where v.product_id = p.id and p.slug = 'bharara-king' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'bharara-king 3ml: % filas (em=30000 -> mm=40000)', v_count;
  update emdino.product_variants v set price = 60000 from emdino.products p where v.product_id = p.id and p.slug = 'bharara-king' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'bharara-king 5ml: % filas (em=45000 -> mm=60000)', v_count;
  update emdino.product_variants v set price = 105000 from emdino.products p where v.product_id = p.id and p.slug = 'bharara-king' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'bharara-king 10ml: % filas (em=70000 -> mm=105000)', v_count;
  update emdino.product_variants v set price = 195000 from emdino.products p where v.product_id = p.id and p.slug = 'bharara-king' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'bharara-king 30ml: % filas (em=185000 -> mm=195000)', v_count;
  -- armaf-cdn-intense
  update emdino.product_variants v set price = 28000 from emdino.products p where v.product_id = p.id and p.slug = 'armaf-cdn-intense' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'armaf-cdn-intense 3ml: % filas (em=30000 -> mm=28000)', v_count;
  update emdino.product_variants v set price = 38000 from emdino.products p where v.product_id = p.id and p.slug = 'armaf-cdn-intense' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'armaf-cdn-intense 5ml: % filas (em=40000 -> mm=38000)', v_count;
  update emdino.product_variants v set price = 55000 from emdino.products p where v.product_id = p.id and p.slug = 'armaf-cdn-intense' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'armaf-cdn-intense 10ml: % filas (em=60000 -> mm=55000)', v_count;
  -- azzaro-most-wanted-intense
  update emdino.product_variants v set price = 115000 from emdino.products p where v.product_id = p.id and p.slug = 'azzaro-most-wanted-intense' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'azzaro-most-wanted-intense 10ml: % filas (em=110000 -> mm=115000)', v_count;
  -- azzaro-most-wanted-parfum
  update emdino.product_variants v set price = 42000 from emdino.products p where v.product_id = p.id and p.slug = 'azzaro-most-wanted-parfum' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'azzaro-most-wanted-parfum 3ml: % filas (em=44000 -> mm=42000)', v_count;
  update emdino.product_variants v set price = 62000 from emdino.products p where v.product_id = p.id and p.slug = 'azzaro-most-wanted-parfum' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'azzaro-most-wanted-parfum 5ml: % filas (em=66000 -> mm=62000)', v_count;
  update emdino.product_variants v set price = 310000 from emdino.products p where v.product_id = p.id and p.slug = 'azzaro-most-wanted-parfum' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'azzaro-most-wanted-parfum 30ml: % filas (em=295000 -> mm=310000)', v_count;
  -- versace-eros-flame
  update emdino.product_variants v set price = 45000 from emdino.products p where v.product_id = p.id and p.slug = 'versace-eros-flame' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'versace-eros-flame 3ml: % filas (em=35000 -> mm=45000)', v_count;
  update emdino.product_variants v set price = 65000 from emdino.products p where v.product_id = p.id and p.slug = 'versace-eros-flame' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'versace-eros-flame 5ml: % filas (em=48000 -> mm=65000)', v_count;
  update emdino.product_variants v set price = 105000 from emdino.products p where v.product_id = p.id and p.slug = 'versace-eros-flame' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'versace-eros-flame 10ml: % filas (em=80000 -> mm=105000)', v_count;
  update emdino.product_variants v set price = 285000 from emdino.products p where v.product_id = p.id and p.slug = 'versace-eros-flame' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'versace-eros-flame 30ml: % filas (em=220000 -> mm=285000)', v_count;
  -- versace-eros
  update emdino.product_variants v set price = 40000 from emdino.products p where v.product_id = p.id and p.slug = 'versace-eros' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'versace-eros 3ml: % filas (em=32000 -> mm=40000)', v_count;
  update emdino.product_variants v set price = 55000 from emdino.products p where v.product_id = p.id and p.slug = 'versace-eros' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'versace-eros 5ml: % filas (em=48000 -> mm=55000)', v_count;
  update emdino.product_variants v set price = 95000 from emdino.products p where v.product_id = p.id and p.slug = 'versace-eros' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'versace-eros 10ml: % filas (em=80000 -> mm=95000)', v_count;
  update emdino.product_variants v set price = 230000 from emdino.products p where v.product_id = p.id and p.slug = 'versace-eros' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'versace-eros 30ml: % filas (em=250000 -> mm=230000)', v_count;
  -- pr-invictus-victory-elixir
  update emdino.product_variants v set price = 50000 from emdino.products p where v.product_id = p.id and p.slug = 'pr-invictus-victory-elixir' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'pr-invictus-victory-elixir 3ml: % filas (em=45000 -> mm=50000)', v_count;
  update emdino.product_variants v set price = 75000 from emdino.products p where v.product_id = p.id and p.slug = 'pr-invictus-victory-elixir' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'pr-invictus-victory-elixir 5ml: % filas (em=57000 -> mm=75000)', v_count;
  update emdino.product_variants v set price = 125000 from emdino.products p where v.product_id = p.id and p.slug = 'pr-invictus-victory-elixir' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'pr-invictus-victory-elixir 10ml: % filas (em=100000 -> mm=125000)', v_count;
  update emdino.product_variants v set price = 310000 from emdino.products p where v.product_id = p.id and p.slug = 'pr-invictus-victory-elixir' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'pr-invictus-victory-elixir 30ml: % filas (em=300000 -> mm=310000)', v_count;
  -- lattafa-asad
  update emdino.product_variants v set price = 55000 from emdino.products p where v.product_id = p.id and p.slug = 'lattafa-asad' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'lattafa-asad 10ml: % filas (em=50000 -> mm=55000)', v_count;
  update emdino.product_variants v set price = 105000 from emdino.products p where v.product_id = p.id and p.slug = 'lattafa-asad' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'lattafa-asad 30ml: % filas (em=128000 -> mm=105000)', v_count;
  -- lattafa-asad-bourbon
  update emdino.product_variants v set price = 35000 from emdino.products p where v.product_id = p.id and p.slug = 'lattafa-asad-bourbon' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'lattafa-asad-bourbon 5ml: % filas (em=38000 -> mm=35000)', v_count;
  update emdino.product_variants v set price = 55000 from emdino.products p where v.product_id = p.id and p.slug = 'lattafa-asad-bourbon' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'lattafa-asad-bourbon 10ml: % filas (em=56000 -> mm=55000)', v_count;
  update emdino.product_variants v set price = 160000 from emdino.products p where v.product_id = p.id and p.slug = 'lattafa-asad-bourbon' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'lattafa-asad-bourbon 30ml: % filas (em=145000 -> mm=160000)', v_count;
  -- afnan-9pm
  update emdino.product_variants v set price = 55000 from emdino.products p where v.product_id = p.id and p.slug = 'afnan-9pm' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'afnan-9pm 10ml: % filas (em=50000 -> mm=55000)', v_count;
  -- armaf-cdn-iconic
  update emdino.product_variants v set price = 35000 from emdino.products p where v.product_id = p.id and p.slug = 'armaf-cdn-iconic' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'armaf-cdn-iconic 3ml: % filas (em=28000 -> mm=35000)', v_count;
  update emdino.product_variants v set price = 50000 from emdino.products p where v.product_id = p.id and p.slug = 'armaf-cdn-iconic' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'armaf-cdn-iconic 5ml: % filas (em=40000 -> mm=50000)', v_count;
  update emdino.product_variants v set price = 80000 from emdino.products p where v.product_id = p.id and p.slug = 'armaf-cdn-iconic' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'armaf-cdn-iconic 10ml: % filas (em=60000 -> mm=80000)', v_count;
  -- ysl-y-edp
  update emdino.product_variants v set price = 50000 from emdino.products p where v.product_id = p.id and p.slug = 'ysl-y-edp' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'ysl-y-edp 3ml: % filas (em=48000 -> mm=50000)', v_count;
  update emdino.product_variants v set price = 75000 from emdino.products p where v.product_id = p.id and p.slug = 'ysl-y-edp' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'ysl-y-edp 5ml: % filas (em=70000 -> mm=75000)', v_count;
  update emdino.product_variants v set price = 130000 from emdino.products p where v.product_id = p.id and p.slug = 'ysl-y-edp' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'ysl-y-edp 10ml: % filas (em=120000 -> mm=130000)', v_count;
  -- ch-212-vip-black
  update emdino.product_variants v set price = 35000 from emdino.products p where v.product_id = p.id and p.slug = 'ch-212-vip-black' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'ch-212-vip-black 3ml: % filas (em=45000 -> mm=35000)', v_count;
  update emdino.product_variants v set price = 50000 from emdino.products p where v.product_id = p.id and p.slug = 'ch-212-vip-black' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'ch-212-vip-black 5ml: % filas (em=60000 -> mm=50000)', v_count;
  update emdino.product_variants v set price = 90000 from emdino.products p where v.product_id = p.id and p.slug = 'ch-212-vip-black' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'ch-212-vip-black 10ml: % filas (em=100000 -> mm=90000)', v_count;
  update emdino.product_variants v set price = 225000 from emdino.products p where v.product_id = p.id and p.slug = 'ch-212-vip-black' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'ch-212-vip-black 30ml: % filas (em=280000 -> mm=225000)', v_count;
  -- afnan-9pm-rebel
  update emdino.product_variants v set price = 30000 from emdino.products p where v.product_id = p.id and p.slug = 'afnan-9pm-rebel' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'afnan-9pm-rebel 3ml: % filas (em=28000 -> mm=30000)', v_count;
  update emdino.product_variants v set price = 45000 from emdino.products p where v.product_id = p.id and p.slug = 'afnan-9pm-rebel' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'afnan-9pm-rebel 5ml: % filas (em=40000 -> mm=45000)', v_count;
  update emdino.product_variants v set price = 75000 from emdino.products p where v.product_id = p.id and p.slug = 'afnan-9pm-rebel' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'afnan-9pm-rebel 10ml: % filas (em=60000 -> mm=75000)', v_count;
  update emdino.product_variants v set price = 190000 from emdino.products p where v.product_id = p.id and p.slug = 'afnan-9pm-rebel' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'afnan-9pm-rebel 30ml: % filas (em=135000 -> mm=190000)', v_count;
  -- alharamain-amber-oud-gold
  update emdino.product_variants v set price = 185000 from emdino.products p where v.product_id = p.id and p.slug = 'alharamain-amber-oud-gold' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'alharamain-amber-oud-gold 30ml: % filas (em=180000 -> mm=185000)', v_count;
  -- rayhaan-elixir
  update emdino.product_variants v set price = 30000 from emdino.products p where v.product_id = p.id and p.slug = 'rayhaan-elixir' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'rayhaan-elixir 5ml: % filas (em=38000 -> mm=30000)', v_count;
  update emdino.product_variants v set price = 50000 from emdino.products p where v.product_id = p.id and p.slug = 'rayhaan-elixir' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'rayhaan-elixir 10ml: % filas (em=58000 -> mm=50000)', v_count;
  update emdino.product_variants v set price = 155000 from emdino.products p where v.product_id = p.id and p.slug = 'rayhaan-elixir' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'rayhaan-elixir 30ml: % filas (em=130000 -> mm=155000)', v_count;
  -- fa-liquid-brun
  update emdino.product_variants v set price = 40000 from emdino.products p where v.product_id = p.id and p.slug = 'fa-liquid-brun' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'fa-liquid-brun 5ml: % filas (em=38000 -> mm=40000)', v_count;
  update emdino.product_variants v set price = 65000 from emdino.products p where v.product_id = p.id and p.slug = 'fa-liquid-brun' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'fa-liquid-brun 10ml: % filas (em=56000 -> mm=65000)', v_count;
  update emdino.product_variants v set price = 150000 from emdino.products p where v.product_id = p.id and p.slug = 'fa-liquid-brun' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'fa-liquid-brun 30ml: % filas (em=160000 -> mm=150000)', v_count;
  -- fa-vulcan-feu
  update emdino.product_variants v set price = 40000 from emdino.products p where v.product_id = p.id and p.slug = 'fa-vulcan-feu' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'fa-vulcan-feu 5ml: % filas (em=45000 -> mm=40000)', v_count;
  update emdino.product_variants v set price = 65000 from emdino.products p where v.product_id = p.id and p.slug = 'fa-vulcan-feu' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'fa-vulcan-feu 10ml: % filas (em=70000 -> mm=65000)', v_count;
  update emdino.product_variants v set price = 170000 from emdino.products p where v.product_id = p.id and p.slug = 'fa-vulcan-feu' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'fa-vulcan-feu 30ml: % filas (em=180000 -> mm=170000)', v_count;
  -- xerjoff-erba-pura
  update emdino.product_variants v set price = 80000 from emdino.products p where v.product_id = p.id and p.slug = 'xerjoff-erba-pura' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'xerjoff-erba-pura 3ml: % filas (em=85000 -> mm=80000)', v_count;
  update emdino.product_variants v set price = 220000 from emdino.products p where v.product_id = p.id and p.slug = 'xerjoff-erba-pura' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'xerjoff-erba-pura 10ml: % filas (em=210000 -> mm=220000)', v_count;
  -- pdm-layton
  update emdino.product_variants v set price = 75000 from emdino.products p where v.product_id = p.id and p.slug = 'pdm-layton' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'pdm-layton 3ml: % filas (em=80000 -> mm=75000)', v_count;
  update emdino.product_variants v set price = 130000 from emdino.products p where v.product_id = p.id and p.slug = 'pdm-layton' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'pdm-layton 5ml: % filas (em=120000 -> mm=130000)', v_count;
  update emdino.product_variants v set price = 230000 from emdino.products p where v.product_id = p.id and p.slug = 'pdm-layton' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'pdm-layton 10ml: % filas (em=220000 -> mm=230000)', v_count;
  update emdino.product_variants v set price = 550000 from emdino.products p where v.product_id = p.id and p.slug = 'pdm-layton' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'pdm-layton 30ml: % filas (em=660000 -> mm=550000)', v_count;
  -- xerjoff-naxos
  update emdino.product_variants v set price = 70000 from emdino.products p where v.product_id = p.id and p.slug = 'xerjoff-naxos' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'xerjoff-naxos 3ml: % filas (em=85000 -> mm=70000)', v_count;
  update emdino.product_variants v set price = 115000 from emdino.products p where v.product_id = p.id and p.slug = 'xerjoff-naxos' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'xerjoff-naxos 5ml: % filas (em=130000 -> mm=115000)', v_count;
  update emdino.product_variants v set price = 210000 from emdino.products p where v.product_id = p.id and p.slug = 'xerjoff-naxos' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'xerjoff-naxos 10ml: % filas (em=240000 -> mm=210000)', v_count;
  update emdino.product_variants v set price = 640000 from emdino.products p where v.product_id = p.id and p.slug = 'xerjoff-naxos' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'xerjoff-naxos 30ml: % filas (em=660000 -> mm=640000)', v_count;
  -- rasasi-hawas-kobra
  update emdino.product_variants v set price = 65000 from emdino.products p where v.product_id = p.id and p.slug = 'rasasi-hawas-kobra' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'rasasi-hawas-kobra 10ml: % filas (em=60000 -> mm=65000)', v_count;
  update emdino.product_variants v set price = 190000 from emdino.products p where v.product_id = p.id and p.slug = 'rasasi-hawas-kobra' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'rasasi-hawas-kobra 30ml: % filas (em=160000 -> mm=190000)', v_count;
  -- rasasi-hawas-fire
  update emdino.product_variants v set price = 50000 from emdino.products p where v.product_id = p.id and p.slug = 'rasasi-hawas-fire' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'rasasi-hawas-fire 5ml: % filas (em=40000 -> mm=50000)', v_count;
  update emdino.product_variants v set price = 65000 from emdino.products p where v.product_id = p.id and p.slug = 'rasasi-hawas-fire' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'rasasi-hawas-fire 10ml: % filas (em=60000 -> mm=65000)', v_count;
  -- ysl-myslf
  update emdino.product_variants v set price = 60000 from emdino.products p where v.product_id = p.id and p.slug = 'ysl-myslf' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'ysl-myslf 3ml: % filas (em=50000 -> mm=60000)', v_count;
  update emdino.product_variants v set price = 85000 from emdino.products p where v.product_id = p.id and p.slug = 'ysl-myslf' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'ysl-myslf 5ml: % filas (em=70000 -> mm=85000)', v_count;
  update emdino.product_variants v set price = 145000 from emdino.products p where v.product_id = p.id and p.slug = 'ysl-myslf' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'ysl-myslf 10ml: % filas (em=120000 -> mm=145000)', v_count;
  update emdino.product_variants v set price = 380000 from emdino.products p where v.product_id = p.id and p.slug = 'ysl-myslf' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'ysl-myslf 30ml: % filas (em=350000 -> mm=380000)', v_count;
  -- afnan-9pm-night-out
  update emdino.product_variants v set price = 75000 from emdino.products p where v.product_id = p.id and p.slug = 'afnan-9pm-night-out' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'afnan-9pm-night-out 10ml: % filas (em=70000 -> mm=75000)', v_count;
  update emdino.product_variants v set price = 195000 from emdino.products p where v.product_id = p.id and p.slug = 'afnan-9pm-night-out' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'afnan-9pm-night-out 30ml: % filas (em=180000 -> mm=195000)', v_count;
  -- dior-homme-intense
  update emdino.product_variants v set price = 55000 from emdino.products p where v.product_id = p.id and p.slug = 'dior-homme-intense' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'dior-homme-intense 3ml: % filas (em=46000 -> mm=55000)', v_count;
  update emdino.product_variants v set price = 75000 from emdino.products p where v.product_id = p.id and p.slug = 'dior-homme-intense' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'dior-homme-intense 5ml: % filas (em=70000 -> mm=75000)', v_count;
  update emdino.product_variants v set price = 145000 from emdino.products p where v.product_id = p.id and p.slug = 'dior-homme-intense' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'dior-homme-intense 10ml: % filas (em=120000 -> mm=145000)', v_count;
  update emdino.product_variants v set price = 420000 from emdino.products p where v.product_id = p.id and p.slug = 'dior-homme-intense' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'dior-homme-intense 30ml: % filas (em=330000 -> mm=420000)', v_count;
  -- rasasi-hawas-tropical
  update emdino.product_variants v set price = 45000 from emdino.products p where v.product_id = p.id and p.slug = 'rasasi-hawas-tropical' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'rasasi-hawas-tropical 5ml: % filas (em=40000 -> mm=45000)', v_count;
  update emdino.product_variants v set price = 70000 from emdino.products p where v.product_id = p.id and p.slug = 'rasasi-hawas-tropical' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'rasasi-hawas-tropical 10ml: % filas (em=60000 -> mm=70000)', v_count;
  update emdino.product_variants v set price = 175000 from emdino.products p where v.product_id = p.id and p.slug = 'rasasi-hawas-tropical' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'rasasi-hawas-tropical 30ml: % filas (em=160000 -> mm=175000)', v_count;
  -- ed-espada-guarani
  update emdino.product_variants v set price = 28000 from emdino.products p where v.product_id = p.id and p.slug = 'ed-espada-guarani' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'ed-espada-guarani 3ml: % filas (em=30000 -> mm=28000)', v_count;
  update emdino.product_variants v set price = 65000 from emdino.products p where v.product_id = p.id and p.slug = 'ed-espada-guarani' and p.store_id = v_store_id and v.label = '10ml';
  get diagnostics v_count = row_count;
  raise notice 'ed-espada-guarani 10ml: % filas (em=55000 -> mm=65000)', v_count;
  update emdino.product_variants v set price = 165000 from emdino.products p where v.product_id = p.id and p.slug = 'ed-espada-guarani' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'ed-espada-guarani 30ml: % filas (em=150000 -> mm=165000)', v_count;
  -- armaf-mandarin-sky
  update emdino.product_variants v set price = 20000 from emdino.products p where v.product_id = p.id and p.slug = 'armaf-mandarin-sky' and p.store_id = v_store_id and v.label = '3ml';
  get diagnostics v_count = row_count;
  raise notice 'armaf-mandarin-sky 3ml: % filas (em=25000 -> mm=20000)', v_count;
  update emdino.product_variants v set price = 30000 from emdino.products p where v.product_id = p.id and p.slug = 'armaf-mandarin-sky' and p.store_id = v_store_id and v.label = '5ml';
  get diagnostics v_count = row_count;
  raise notice 'armaf-mandarin-sky 5ml: % filas (em=35000 -> mm=30000)', v_count;
  update emdino.product_variants v set price = 135000 from emdino.products p where v.product_id = p.id and p.slug = 'armaf-mandarin-sky' and p.store_id = v_store_id and v.label = '30ml';
  get diagnostics v_count = row_count;
  raise notice 'armaf-mandarin-sky 30ml: % filas (em=128000 -> mm=135000)', v_count;
end $$;