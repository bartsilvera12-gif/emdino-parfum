-- ============================================================
-- EMDINO PERFUMERIA - rename combos + update image_url a las nuevas PNG
-- Nuevas imagenes premium del cliente (carpeta Emdino)
-- ============================================================

do $$
declare
  v_store_id uuid;
begin
  select id into v_store_id from emdino.stores where slug = 'emdino';
  if v_store_id is null then
    raise exception 'Store emdino no encontrado';
  end if;

  -- combo-party -> Signature
  update emdino.combos
     set name = 'Signature',
         image_url = '/assets/combos/combo-party.png',
         updated_at = now()
   where store_id = v_store_id and slug = 'combo-party';

  -- combo-citas -> Rendezvous
  update emdino.combos
     set name = 'Rendezvous',
         image_url = '/assets/combos/combo-citas.png',
         updated_at = now()
   where store_id = v_store_id and slug = 'combo-citas';

  -- combo-mix -> Prestige Noir
  update emdino.combos
     set name = 'Prestige Noir',
         image_url = '/assets/combos/combo-mix.png',
         updated_at = now()
   where store_id = v_store_id and slug = 'combo-mix';

  -- combo-boliche -> After Dark
  update emdino.combos
     set name = 'After Dark',
         image_url = '/assets/combos/combo-boliche.png',
         updated_at = now()
   where store_id = v_store_id and slug = 'combo-boliche';

  -- combo-best-sellers -> Best Seller (singular)
  update emdino.combos
     set name = 'Best Seller',
         image_url = '/assets/combos/combo-best-sellers.png',
         updated_at = now()
   where store_id = v_store_id and slug = 'combo-best-sellers';

  -- combo-linea-le-beau -> Linea Le Beau (mantiene nombre, solo PNG)
  update emdino.combos
     set name = 'Linea Le Beau',
         image_url = '/assets/combos/combo-linea-le-beau.png',
         updated_at = now()
   where store_id = v_store_id and slug = 'combo-linea-le-beau';

  -- Combos que solo cambian de jpg a png (sin renombrar)
  update emdino.combos
     set image_url = '/assets/combos/combo-fresh.png', updated_at = now()
   where store_id = v_store_id and slug = 'combo-fresh';

  update emdino.combos
     set image_url = '/assets/combos/combo-irresistible.png', updated_at = now()
   where store_id = v_store_id and slug = 'combo-irresistible';

  update emdino.combos
     set image_url = '/assets/combos/combo-nicho.png', updated_at = now()
   where store_id = v_store_id and slug = 'combo-nicho';

  raise notice 'Combos renombrados y imagenes actualizadas a PNG.';
end $$;
