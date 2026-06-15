# Emdino Perfumería

Web pública + panel administrador. Vite + React + TypeScript + Supabase + carrito localStorage + checkout por WhatsApp.

---

## Setup local

```bash
npm install
cp .env.example .env.local   # completar con URL real, anon key, schema
npm run dev                  # http://localhost:5173
```

Sin `.env.local` la web pública funciona con catálogo de fallback (`src/data/catalogs.js`) — útil para desarrollo sin DB. El admin requiere Supabase configurado.

## Build estático (Hostinger / Vercel / cualquier hosting)

```bash
npm run build      # genera dist/
```

`dist/` incluye:
- `index.html` + `assets/index-*.js` + `assets/index-*.css`
- Todos los assets de imagen (`assets/perfumes/`, `assets/perfumes-cut/`, `assets/hero-bg.png`, etc.)
- `.htaccess` con fallback SPA para que `/admin/login`, `/admin/productos`, etc. no tiren 404 al refrescar

### Hostinger Custom HTML

Subí **el contenido** de `dist/` al directorio público (`public_html/` o el que use tu plan). El `.htaccess` ya viene incluido.

---

## Variables de entorno

`.env.local` (no commitear):

```
VITE_SUPABASE_URL=https://api.neura.com.py
VITE_SUPABASE_ANON_KEY=eyJhbGciOi…
VITE_BUSINESS_SCHEMA=emdino
```

Toda la integración usa **anon key** (RLS protege los datos). El service_role nunca debe ir al frontend.

---

## Supabase — pasos para activar el admin

### 1. Aplicar el SQL

Ejecutar como `postgres` (Dashboard SQL Editor o `psql`):

```bash
psql "$DATABASE_URL" -f sql/0001_init_emdino.sql
psql "$DATABASE_URL" -f sql/0002_seed_emdino.sql
```

Esto crea el schema `emdino` con tablas: `stores`, `profiles`, `perfume_categories`, `products`, `product_variants`, `combos`, `combo_items`, `orders`, `order_items`, `settings`.

Más:
- Helpers `emdino.current_store_id()`, `emdino.current_role()`
- RLS en todas las tablas (lectura pública del catálogo activo, escritura solo para `admin`/`editor` del store)
- RPC `emdino.create_public_order(payload jsonb)` para que el checkout cree pedidos sin abrir escritura directa
- Seed completo con productos, combos y settings actuales

### 2. Exponer el schema en PostgREST (self-hosted)

**Importante**: no editar `PGRST_DB_SCHEMAS` a mano para no romper otros schemas ya expuestos.

```bash
cd /root/supabase/docker
./exponer-schema.sh emdino
```

Verificar:

```bash
grep '^PGRST_DB_SCHEMAS=' .env
docker compose exec rest env | grep PGRST_DB_SCHEMAS
docker compose logs rest --tail=100
```

Esperado: `emdino` aparece en `PGRST_DB_SCHEMAS`, container `rest` activo sin errores, schemas previos siguen presentes.

### 3. Crear el usuario admin

1. En el Dashboard de Supabase → Authentication → Users → **Add user** (email + contraseña).
2. Copiar el UUID del usuario creado.
3. Insertar el profile:

```sql
insert into emdino.profiles (id, store_id, email, role)
select 'UUID_DEL_USUARIO_AUTH', s.id, 'admin@email.com', 'admin'
from emdino.stores s where s.slug = 'emdino';
```

Sin un profile asignado el usuario NO puede entrar al admin (el `ProtectedRoute` lo expulsa).

---

## Rutas

### Públicas
- `/` — home (hero + marquee + featured + combos + how + envíos)
- `/#fragancias` — catálogo masculino (femenino solo si `settings.show_female_catalog = true`)
- `/#combos` — listado de combos

### Admin (protegidas con Supabase Auth + profile + role)
- `/admin/login` — login con email/contraseña
- `/admin` — Dashboard con KPIs (perfumes, categorías, stock, pedidos)
- `/admin/productos` — CRUD de perfumes + gestión de variantes (precio, stock, mínimo, SKU)
- `/admin/categorias` — CRUD de categorías (bloquea borrar si tiene perfumes asociados)
- `/admin/combos` — CRUD de combos + selección de perfumes incluidos
- `/admin/pedidos` — listado + detalle + cambio de estado + abrir WhatsApp del cliente
- `/admin/clientes` — vista agregada desde `orders` (último pedido, total acumulado)
- `/admin/configuracion` — WhatsApp / Instagram / envío gratis desde / mostrar catálogo femenino

---

## Arquitectura

- **Vite + React 18 + TS**, sin Babel UMD en runtime. Bundle ~498kb minified / 138kb gzip.
- **React Router DOM** para `/admin/*` y catch-all público.
- **Sin shadcn/ui ni Radix**: CSS propio (Marcellus + Manrope + paleta dorada).
- **Lucide-react** para iconos del admin.

### Datos
- `src/lib/supabase.ts` — cliente Supabase con schema configurable (`emdino`).
- `src/lib/catalogSource.ts` — la web pública intenta Supabase; si falla cae a `src/data/catalogs.js` (fallback local) para que el sitio nunca quede vacío.
- `src/lib/adminSession.ts` — hook `useAdminSession()` + `ProtectedRoute` que valida sesión Auth + profile + role.

### Carrito + Checkout
- Carrito en `localStorage` (no cambia).
- Si Supabase está configurado, el checkout llama a la RPC `emdino.create_public_order(payload)` que **recalcula precios desde DB** y devuelve el mensaje de WhatsApp armado. Si la RPC falla, fallback al mensaje generado localmente (sin perder el pedido).

### Seguridad
- RLS activado en todas las tablas, gateando por `store_id` y rol del profile.
- Catálogo y combos: lectura pública solo para `active = true`.
- Pedidos: lectura/escritura solo para admins del store.
- Escritura pública de orders se hace **solo** vía RPC `SECURITY DEFINER` que valida productos/variantes/combos activos y recalcula totales.

---

## Estructura

```
emdino-parfum/
├── index.html                  # Vite entry (root)
├── vite.config.ts
├── tsconfig.json
├── package.json
├── .env.example
├── public/
│   ├── .htaccess               # SPA fallback Hostinger
│   └── assets/                 # imágenes, logos
├── sql/
│   ├── 0001_init_emdino.sql    # schema + RLS + RPC
│   └── 0002_seed_emdino.sql    # datos iniciales (productos, combos, settings)
└── src/
    ├── main.tsx                # router root
    ├── PublicApp.tsx           # wrapper público
    ├── lib/
    │   ├── supabase.ts
    │   ├── catalogSource.ts    # Supabase + fallback
    │   └── adminSession.ts     # auth + profile
    ├── components/
    │   ├── header.jsx, hero.jsx, …  (existentes, portados a ES modules)
    │   └── admin/
    │       ├── ProtectedRoute.tsx
    │       └── AdminLayout.tsx
    ├── pages/admin/
    │   ├── AdminLogin.tsx
    │   ├── AdminDashboard.tsx
    │   ├── AdminProducts.tsx
    │   ├── AdminCategories.tsx
    │   ├── AdminCombos.tsx
    │   ├── AdminOrders.tsx
    │   ├── AdminCustomers.tsx
    │   └── AdminSettings.tsx
    ├── data/
    │   ├── catalogs.js         # fallback
    │   └── combos.js           # fallback
    ├── utils/helpers.js
    └── styles/
        ├── global.css, layout.css, components.css
        └── admin.css
```

---

## Rollback al estado pre-migración

Tag y branch creados antes de la migración:

```bash
git reset --hard pre-admin-panel-b262482
git push --force-with-lease origin main
```

(`pre-admin-panel-b262482` y `backup/pre-admin-panel-b262482` están en `origin`.)
