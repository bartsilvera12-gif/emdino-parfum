-- ============================================================
-- EMDINO PERFUMERIA - eliminar combos de prueba del seed inicial
-- Black, Intenso, Elite, Oud Royale, Vertigo no figuran en mmfragrances
-- ni en las imagenes que paso el cliente. Se eliminan definitivamente.
-- ============================================================

do $$
declare
  v_store_id uuid;
begin
  select id into v_store_id from emdino.stores where slug = 'emdino';
  if v_store_id is null then
    raise exception 'Store emdino no encontrado';
  end if;

  -- combo_items se borran en cascada por la FK on delete cascade
  delete from emdino.combos
   where store_id = v_store_id
     and slug in ('combo-black','combo-intenso','combo-elite','combo-oud-royale','combo-vertigo');

  raise notice 'Combos de prueba eliminados.';
end $$;
