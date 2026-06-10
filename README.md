# Emdino Perfumería — Web

Tienda de decants de perfumes originales — Encarnación, Paraguay.
Diseño editorial premium, con fotos y precios reales del catálogo.

## Stack

- HTML + React 18 (UMD) + Babel standalone — sin build, sin backend, sin base de datos.
- CSS organizado en `src/styles/` (sistema visual + 2 hojas de layout).
- Estado del carrito en React, persistido en `localStorage`.
- Pedidos y consultas por WhatsApp (`wa.me`).
- Tipografía: **Bodoni Moda** (display, en sintonía con el logo) + **Hanken Grotesk** (UI).

> El pedido original sugería Vite. Esta versión corre sin instalar nada
> (abrís el HTML y funciona) y ya está separada en componentes/data/utils/styles,
> así que migrar a Vite después es directo.

## Cómo correr local

Servidor estático, por ejemplo:

```
npx serve .
```

y entrar a `http://localhost:3000/Emdino%20Perfumeria.html`.

## Estructura

```
Emdino Perfumeria.html        ← página principal
archive/Emdino v1.html        ← versión anterior (respaldo)
assets/
  logo-crop.png               ← logo real recortado
  perfumes/<id>.jpg           ← 68 fotos reales (frasco recortado, del PDF)
  perfumes-cut/<id>.png       ← frascos sin fondo (para combos y hero)
src/
  app.jsx                     ← App + carrito + localStorage + reveals
  components/  header · hero · editorial · catalog · combos · cart · sections
  data/        catalogs.js (masculino visible + femenino preparado) · combos.js
  utils/       helpers.js (WhatsApp, Gs., contacto)
  styles/      global.css · layout.css · components.css
```

## Cómo cambiar datos

- **WhatsApp / Instagram / envío gratis:** `src/utils/helpers.js`.
- **Logo:** reemplazar `assets/logo-crop.png` (header y footer).
- **Productos y precios:** `src/data/catalogs.js`.
- **Combos:** `src/data/combos.js` (cada combo arma su visual con los `items`).
- **Foto de un producto:** poné el JPG en `assets/perfumes/<id>.jpg`.

## Imágenes

- 68 de los 69 productos tienen **foto real** extraída del PDF del catálogo y
  recortada (frasco sobre fondo claro). El único sin foto en el PDF es
  **L'Eau d'Issey Pour Homme** → muestra un placeholder elegante.
- Los frascos de los combos y el del hero usan versiones sin fondo
  (`assets/perfumes-cut/`).

## Precios

- Individuales (3/5/10/30 ml): **reales, del PDF** del catálogo masculino.
- Combos Party / Mix / Fresh / Irresistible: precios de la referencia web.
- Combos Black / Intenso: `precio promocional pendiente de confirmar`.

## Catálogo femenino

Preparado en `catalogs.femenino` (vacío). No se renderiza en la web.
