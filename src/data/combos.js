// ============================================================
// EMDINO PERFUMERÍA — Combos promocionales
// Composición propia para Emdino. Cada combo arma su visual con
// las fotos reales de los frascos incluidos (assets/perfumes/).
//
// PRECIOS PROMO de Party / Mix / Fresh / Irresistible: referencia
// web (mmfragrances.com, combos visibles al 09/06/2026).
// Black / Intenso: precio promocional pendiente de confirmar.
// ============================================================

const combos = [
  {
    id: "combo-party",
    nombre: "Party",
    tagline: "Para encender la noche",
    items: ["versace-eros", "jpg-le-male-elixir", "lattafa-khamrah"],
    incluye: ["Versace Eros", "JPG Le Male Elixir", "Lattafa Khamrah"],
    presentacion: "3 decants · 5 ml",
    precioNormal: 160000,
    precioPromo: 150000,
    destacado: true,
  },
  {
    id: "combo-mix",
    nombre: "Mix",
    tagline: "Versátil, de día y de noche",
    items: ["ysl-y-edp", "jpg-le-beau-edt", "armaf-cdn-intense"],
    incluye: ["YSL Y EDP", "JPG Le Beau EDT", "Club de Nuit Intense"],
    presentacion: "3 decants · 5 ml",
    precioNormal: 165000,
    precioPromo: 155000,
  },
  {
    id: "combo-fresh",
    nombre: "Fresh",
    tagline: "Frescura para todo el día",
    items: ["ysl-y-edp", "rasasi-hawas-ice", "fa-vulcan-feu"],
    incluye: ["YSL Y EDP", "Hawas Ice", "Vulcan Feu"],
    presentacion: "3 decants · 3 ml",
    precioNormal: 108000,
    precioPromo: 102000,
  },
  {
    id: "combo-irresistible",
    nombre: "Irresistible",
    tagline: "Los que dejan huella",
    items: ["jpg-le-male-elixir", "jpg-le-beau-edt", "versace-eros-flame"],
    incluye: ["JPG Le Male Elixir", "JPG Le Beau EDT", "Eros Flame"],
    presentacion: "3 decants · 5 ml",
    precioNormal: 165000,
    precioPromo: 155000,
  },
  {
    id: "combo-black",
    nombre: "Black",
    tagline: "Árabes intensos",
    items: ["lattafa-asad", "lattafa-khamrah-dukhan", "rasasi-hawas-black"],
    incluye: ["Lattafa Asad", "Khamrah Dukhan", "Hawas Black"],
    presentacion: "3 decants · 5 ml",
    precioNormal: 125000,
    precioPromo: 115000,
    promoPendiente: true,
  },
  {
    id: "combo-intenso",
    nombre: "Intenso",
    tagline: "Estela de máxima potencia",
    items: ["armani-swy-intensely", "pr-invictus-victory-elixir", "vr-spicebomb-extreme"],
    incluye: ["SWY Intensely", "Victory Elixir", "Spicebomb Extreme"],
    presentacion: "3 decants · 5 ml",
    precioNormal: 187000,
    precioPromo: 175000,
    promoPendiente: true,
  },
];

window.EMDINO_COMBOS = combos;
