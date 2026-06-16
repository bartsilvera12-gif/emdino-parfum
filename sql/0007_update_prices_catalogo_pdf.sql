-- ============================================================
-- EMDINO PERFUMERIA - update precios segun CATALOGO DECANTS MASCULINO (PDF)
-- 69 productos x 4 variantes (3ml, 5ml, 10ml, 30ml)
-- ============================================================

do $$
declare
  v_store_id uuid;
  v_count int := 0;
  r record;
  prices jsonb := '[
    {"slug":"jpg-le-beau-edt","p":[35000,50000,80000,250000]},
    {"slug":"jpg-le-male-elixir","p":[45000,66000,110000,300000]},
    {"slug":"armani-adg-parfum","p":[50000,80000,125000,325000]},
    {"slug":"xerjoff-erba-pura","p":[85000,120000,210000,650000]},
    {"slug":"xerjoff-naxos","p":[85000,130000,240000,660000]},
    {"slug":"afnan-9pm","p":[25000,35000,50000,130000]},
    {"slug":"lattafa-qaed-al-fursan","p":[25000,35000,50000,130000]},
    {"slug":"lattafa-asad-zanzibar","p":[25000,35000,45000,130000]},
    {"slug":"azzaro-most-wanted-parfum","p":[44000,66000,110000,295000]},
    {"slug":"lattafa-khamrah","p":[25000,45000,70000,128000]},
    {"slug":"bvlgari-man-in-black","p":[50000,70000,120000,355000]},
    {"slug":"valentino-bir-intense","p":[56000,75000,135000,400000]},
    {"slug":"pdm-layton","p":[80000,120000,220000,660000]},
    {"slug":"alharamain-amber-oud-gold","p":[30000,45000,70000,180000]},
    {"slug":"armani-swy-intensely","p":[43000,65000,110000,300000]},
    {"slug":"versace-eros","p":[32000,48000,80000,250000]},
    {"slug":"armaf-cdn-intense","p":[30000,40000,60000,150000]},
    {"slug":"rasasi-hawas-ice","p":[30000,45000,60000,160000]},
    {"slug":"armaf-mandarin-sky","p":[25000,35000,50000,128000]},
    {"slug":"lattafa-asad","p":[25000,35000,50000,128000]},
    {"slug":"pr-invictus-victory-elixir","p":[45000,57000,100000,300000]},
    {"slug":"dior-homme-intense","p":[46000,70000,120000,330000]},
    {"slug":"fa-liquid-brun","p":[28000,38000,56000,160000]},
    {"slug":"jpg-le-beau-le-parfum","p":[50000,66000,110000,350000]},
    {"slug":"bharara-king","p":[30000,45000,70000,185000]},
    {"slug":"jpg-le-male-le-parfum","p":[44000,66000,110000,300000]},
    {"slug":"ysl-myslf","p":[50000,70000,120000,350000]},
    {"slug":"valentino-coral-fantasy","p":[48000,70000,120000,350000]},
    {"slug":"ysl-y-edp","p":[48000,70000,120000,340000]},
    {"slug":"armaf-cdn-iconic","p":[28000,40000,60000,155000]},
    {"slug":"armani-swy-edt","p":[43000,65000,110000,300000]},
    {"slug":"versace-eros-flame","p":[35000,48000,80000,220000]},
    {"slug":"rasasi-hawas-elixir","p":[30000,40000,60000,150000]},
    {"slug":"rayhaan-elixir","p":[25000,38000,58000,130000]},
    {"slug":"vr-spicebomb-extreme","p":[45000,65000,120000,350000]},
    {"slug":"lattafa-hayaati","p":[28000,35000,50000,130000]},
    {"slug":"jpg-scandal-le-parfum","p":[50000,65000,115000,360000]},
    {"slug":"afnan-turathi-blue","p":[28000,40000,60000,135000]},
    {"slug":"rasasi-hawas-fire","p":[30000,40000,60000,155000]},
    {"slug":"lattafa-ramz-silver","p":[28000,40000,60000,130000]},
    {"slug":"rasasi-hawas-black","p":[30000,45000,60000,150000]},
    {"slug":"lattafa-khamrah-dukhan","p":[28000,45000,70000,128000]},
    {"slug":"lattafa-khamrah-qahwa","p":[28000,45000,70000,128000]},
    {"slug":"lattafa-asad-bourbon","p":[28000,38000,56000,145000]},
    {"slug":"mb-legend-spirit","p":[35000,45000,65000,155000]},
    {"slug":"afnan-turathi-electric","p":[28000,40000,60000,135000]},
    {"slug":"azzaro-most-wanted-intense","p":[45000,65000,110000,300000]},
    {"slug":"jpg-le-beau-paradise-garden","p":[43000,65000,110000,295000]},
    {"slug":"alharamain-amber-oud-aqua-dubai","p":[30000,45000,70000,190000]},
    {"slug":"rasasi-hawas-kobra","p":[30000,40000,60000,160000]},
    {"slug":"rasasi-hawas-tropical","p":[30000,40000,60000,160000]},
    {"slug":"fa-vulcan-feu","p":[30000,45000,70000,180000]},
    {"slug":"im-leau-dissey","p":[30000,40000,60000,180000]},
    {"slug":"afnan-9pm-night-out","p":[30000,45000,70000,180000]},
    {"slug":"armani-adg-edt","p":[35000,50000,90000,230000]},
    {"slug":"givenchy-reserve-privee","p":[46000,66000,110000,330000]},
    {"slug":"versace-dylan-blue","p":[35000,55000,85000,220000]},
    {"slug":"dg-light-blue","p":[38000,60000,90000,280000]},
    {"slug":"armani-adg-profondo","p":[45000,65000,125000,295000]},
    {"slug":"jpg-scandal-absolu","p":[50000,65000,115000,360000]},
    {"slug":"tf-ombre-leather","p":[80000,140000,240000,660000]},
    {"slug":"armaf-cdn-precieux","p":[40000,60000,100000,255000]},
    {"slug":"ch-212-vip-black","p":[45000,60000,100000,280000]},
    {"slug":"nishane-hacivat","p":[85000,140000,240000,660000]},
    {"slug":"afnan-9pm-rebel","p":[28000,40000,60000,135000]},
    {"slug":"jpg-scandal-ph","p":[36000,65000,95000,260000]},
    {"slug":"chanel-allure-sport-extreme","p":[60000,100000,180000,556000]},
    {"slug":"prada-lhomme-intense","p":[50000,75000,135000,330000]},
    {"slug":"ed-espada-guarani","p":[30000,40000,55000,150000]}
  ]'::jsonb;
  labels text[] := ARRAY['3ml','5ml','10ml','30ml'];
begin
  select id into v_store_id from emdino.stores where slug = 'emdino';
  if v_store_id is null then
    raise exception 'Store emdino no encontrado';
  end if;

  for r in select elem from jsonb_array_elements(prices) as t(elem)
  loop
    for i in 1..4 loop
      update emdino.product_variants pv
      set price = (r.elem->'p'->>(i-1))::numeric,
          updated_at = now()
      where pv.product_id = (
        select id from emdino.products
        where store_id = v_store_id and slug = (r.elem->>'slug')
      )
      and pv.label = labels[i];

      if found then
        v_count := v_count + 1;
      end if;
    end loop;
  end loop;

  raise notice 'Variantes actualizadas: %', v_count;
end $$;
