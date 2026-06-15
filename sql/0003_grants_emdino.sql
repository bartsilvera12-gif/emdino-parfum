-- ============================================================
-- EMDINO PERFUMERIA — parche de permisos
-- Aplicar DESPUES de 0001 + 0002 si el GET / rest/v1 devuelve
-- "permission denied for table ...". RLS necesita que el rol tenga
-- antes el SELECT a nivel de tabla, y despues evalua la policy.
-- ============================================================

-- Asegurar uso del schema (idempotente)
grant usage on schema emdino to anon, authenticated, service_role;

-- Lectura publica del catalogo (stores + categorias + productos + variantes + combos + items + settings)
grant select on emdino.stores              to anon, authenticated;
grant select on emdino.perfume_categories  to anon, authenticated;
grant select on emdino.products            to anon, authenticated;
grant select on emdino.product_variants    to anon, authenticated;
grant select on emdino.combos              to anon, authenticated;
grant select on emdino.combo_items         to anon, authenticated;
grant select on emdino.settings            to anon, authenticated;

-- Profiles: solo authenticated (cada uno ve el suyo via RLS)
grant select, insert, update, delete on emdino.profiles to authenticated;

-- Orders / order_items: NO conceder al anon. Authenticated escribe via RLS (admin).
grant select, insert, update, delete on emdino.orders      to authenticated;
grant select, insert, update, delete on emdino.order_items to authenticated;

-- Authenticated puede CRUDear todo el catalogo (RLS gatea por store_id + role)
grant insert, update, delete on emdino.perfume_categories to authenticated;
grant insert, update, delete on emdino.products           to authenticated;
grant insert, update, delete on emdino.product_variants   to authenticated;
grant insert, update, delete on emdino.combos             to authenticated;
grant insert, update, delete on emdino.combo_items        to authenticated;
grant insert, update, delete on emdino.settings           to authenticated;

-- service_role bypassa RLS de todos modos pero por completitud
grant all on all tables in schema emdino to service_role;

-- RPC: ya estaba en 0001 pero por idempotencia
grant execute on function emdino.create_public_order(jsonb) to anon, authenticated;
grant execute on function emdino.current_store_id() to anon, authenticated;
grant execute on function emdino.current_role() to anon, authenticated;

-- Default privileges para tablas futuras creadas en el schema (no hace falta correr esto
-- de nuevo cuando agregues columnas o creas tablas nuevas).
alter default privileges in schema emdino grant select on tables to anon, authenticated;
alter default privileges in schema emdino grant insert, update, delete on tables to authenticated;
alter default privileges in schema emdino grant all on tables to service_role;
alter default privileges in schema emdino grant execute on functions to anon, authenticated, service_role;
