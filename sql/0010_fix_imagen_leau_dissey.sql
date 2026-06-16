-- ============================================================
-- EMDINO PERFUMERIA - fix imagen faltante de L'Eau d'Issey Pour Homme
-- main_image_url quedo en null; la imagen ya existe en el repo.
-- ============================================================
do $$
declare v_store_id uuid;
begin
  select id into v_store_id from emdino.stores where slug = 'emdino';
  if v_store_id is null then raise exception 'Store emdino no encontrado'; end if;

  update emdino.products
     set main_image_url = '/assets/perfumes/im-leau-dissey.jpg',
         updated_at = now()
   where store_id = v_store_id
     and slug = 'im-leau-dissey'
     and (main_image_url is null or main_image_url = '');

  raise notice 'Imagen de L''Eau d''Issey actualizada.';
end $$;
