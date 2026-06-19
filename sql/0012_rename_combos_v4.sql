-- ============================================================
-- EMDINO PERFUMERIA - rebrand v4 de los 12 combos (solo nombres)
--   combo-party              Signature          -> Party
--   combo-citas              Rendezvous         -> Citas
--   combo-mix                Prestige Noir      -> Atractivo
--   combo-fresh              Azure Privé        -> Fresco
--   combo-irresistible       Noir Allure        -> Irresistible
--   combo-boliche            After Dark         -> Boliche
--   combo-linea-le-beau      Paradise Noir      -> Le Beau
--   combo-best-sellers       Best Seller        -> Mix
--   combo-nicho              Collection Privée  -> Premium
--   combo-dia-padre-exclusivo  Día del Padre Exclusivo -> Nicho
--   combo-dia-padre-premium    Día del Padre Premium   -> Gentleman
--   combo-dia-padre-economico  Día del Padre Económico -> Formal
--
-- Los slugs NO cambian (para no romper referencias / órdenes existentes).
-- Las fragancias (combo_items) NO cambian: son las mismas, solo el nombre.
-- Las imágenes ya fueron reemplazadas en el repo (mismas rutas image_url).
-- Único tagline que se ajusta: el que mencionaba a papá (combo-dia-padre-premium).
-- ============================================================
do $$
declare
  v_store_id uuid;
begin
  select id into v_store_id from emdino.stores where slug = 'emdino';
  if v_store_id is null then raise exception 'Store emdino no encontrado'; end if;

  update emdino.combos set name = 'Party',        updated_at = now() where store_id = v_store_id and slug = 'combo-party';
  update emdino.combos set name = 'Citas',        updated_at = now() where store_id = v_store_id and slug = 'combo-citas';
  update emdino.combos set name = 'Atractivo',    updated_at = now() where store_id = v_store_id and slug = 'combo-mix';
  update emdino.combos set name = 'Fresco',       updated_at = now() where store_id = v_store_id and slug = 'combo-fresh';
  update emdino.combos set name = 'Irresistible', updated_at = now() where store_id = v_store_id and slug = 'combo-irresistible';
  update emdino.combos set name = 'Boliche',      updated_at = now() where store_id = v_store_id and slug = 'combo-boliche';
  update emdino.combos set name = 'Le Beau',      updated_at = now() where store_id = v_store_id and slug = 'combo-linea-le-beau';
  update emdino.combos set name = 'Mix',          updated_at = now() where store_id = v_store_id and slug = 'combo-best-sellers';
  update emdino.combos set name = 'Premium',      updated_at = now() where store_id = v_store_id and slug = 'combo-nicho';

  -- Ex-Día del Padre -> nombres permanentes
  update emdino.combos set name = 'Nicho',     updated_at = now() where store_id = v_store_id and slug = 'combo-dia-padre-exclusivo';
  update emdino.combos
     set name = 'Gentleman',
         tagline = 'Elegancia para cada ocasión',
         updated_at = now()
   where store_id = v_store_id and slug = 'combo-dia-padre-premium';
  update emdino.combos set name = 'Formal',    updated_at = now() where store_id = v_store_id and slug = 'combo-dia-padre-economico';

  raise notice 'Rebrand de combos v4 aplicado (nombres).';
end $$;
