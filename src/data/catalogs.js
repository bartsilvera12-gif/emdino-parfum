// ============================================================
// EMDINO PERFUMERÍA — Catálogos de decants
// Estructura separada por género. En esta entrega solo se MUESTRA
// el catálogo MASCULINO; el FEMENINO queda preparado (vacío) para
// el futuro y NO se renderiza en la web.
//
// PRECIOS: reales, tomados del PDF "CATÁLOGO DECANTS MASCULINO emdino.pdf".
// IMÁGENES: reales, extraídas del mismo PDF (frasco recortado sobre fondo
// claro) en assets/perfumes/<id>.jpg.
// ============================================================

const SIZES = ["3ml", "5ml", "10ml", "30ml"];

// P(id, nombre, marca, categoria, [3ml,5ml,10ml,30ml], hasImage)
function P(id, nombre, marca, categoria, precios, hasImage = true) {
  return {
    id,
    nombre,
    marca,
    genero: "masculino",
    categoria, // "disenador" | "arabe" | "nicho"
    imagen: hasImage ? "assets/perfumes/" + id + ".jpg" : null,
    precios: { "3ml": precios[0], "5ml": precios[1], "10ml": precios[2], "30ml": precios[3] },
  };
}

const catalogs = {
  masculino: {
    categories: {
      disenador: [
        P("jpg-le-beau-edt", "Le Beau EDT", "Jean Paul Gaultier", "disenador", [35000, 50000, 80000, 250000]),
        P("jpg-le-male-elixir", "Le Male Elixir", "Jean Paul Gaultier", "disenador", [45000, 66000, 110000, 300000]),
        P("jpg-le-beau-le-parfum", "Le Beau Le Parfum", "Jean Paul Gaultier", "disenador", [50000, 66000, 110000, 350000]),
        P("jpg-le-male-le-parfum", "Le Male Le Parfum", "Jean Paul Gaultier", "disenador", [44000, 66000, 110000, 300000]),
        P("jpg-le-beau-paradise-garden", "Le Beau Paradise Garden", "Jean Paul Gaultier", "disenador", [43000, 65000, 110000, 295000]),
        P("jpg-scandal-le-parfum", "Scandal Pour Homme Le Parfum", "Jean Paul Gaultier", "disenador", [50000, 65000, 115000, 360000]),
        P("jpg-scandal-absolu", "Scandal Pour Homme Absolu", "Jean Paul Gaultier", "disenador", [50000, 65000, 115000, 360000]),
        P("jpg-scandal-ph", "Scandal Pour Homme", "Jean Paul Gaultier", "disenador", [36000, 65000, 95000, 260000]),
        P("armani-adg-parfum", "Acqua Di Giò Parfum", "Giorgio Armani", "disenador", [50000, 80000, 125000, 325000]),
        P("armani-adg-edt", "Acqua Di Giò EDT", "Giorgio Armani", "disenador", [35000, 50000, 90000, 230000]),
        P("armani-adg-profondo", "Acqua Di Giò Profondo", "Giorgio Armani", "disenador", [45000, 65000, 125000, 295000]),
        P("armani-swy-intensely", "Stronger With You Intensely", "Emporio Armani", "disenador", [43000, 65000, 110000, 300000]),
        P("armani-swy-edt", "Stronger With You EDT", "Emporio Armani", "disenador", [43000, 65000, 110000, 300000]),
        P("azzaro-most-wanted-parfum", "The Most Wanted Parfum", "Azzaro", "disenador", [44000, 66000, 110000, 295000]),
        P("azzaro-most-wanted-intense", "The Most Wanted Intense", "Azzaro", "disenador", [45000, 65000, 110000, 300000]),
        P("bvlgari-man-in-black", "Man In Black", "Bvlgari", "disenador", [50000, 70000, 120000, 355000]),
        P("valentino-bir-intense", "Born In Roma Uomo Intense", "Valentino", "disenador", [56000, 75000, 135000, 400000]),
        P("valentino-coral-fantasy", "Born In Roma Coral Fantasy", "Valentino", "disenador", [48000, 70000, 120000, 350000]),
        P("versace-eros", "Eros EDT", "Versace", "disenador", [32000, 48000, 80000, 250000]),
        P("versace-eros-flame", "Eros Flame", "Versace", "disenador", [35000, 48000, 80000, 220000]),
        P("versace-dylan-blue", "Pour Homme Dylan Blue", "Versace", "disenador", [35000, 55000, 85000, 220000]),
        P("pr-invictus-victory-elixir", "Invictus Victory Elixir", "Paco Rabanne", "disenador", [45000, 57000, 100000, 300000]),
        P("dior-homme-intense", "Dior Homme Intense", "Dior", "disenador", [46000, 70000, 120000, 330000]),
        P("ysl-myslf", "MYSLF EDP", "Yves Saint Laurent", "disenador", [50000, 70000, 120000, 350000]),
        P("ysl-y-edp", "Y Eau de Parfum", "Yves Saint Laurent", "disenador", [48000, 70000, 120000, 340000]),
        P("vr-spicebomb-extreme", "Spicebomb Extreme", "Viktor & Rolf", "disenador", [45000, 65000, 120000, 350000]),
        P("mb-legend-spirit", "Legend Spirit", "Mont Blanc", "disenador", [35000, 45000, 65000, 155000]),
        P("im-leau-dissey", "L'Eau d'Issey Pour Homme", "Issey Miyake", "disenador", [30000, 40000, 60000, 180000], false),
        P("givenchy-reserve-privee", "Gentleman Réserve Privée", "Givenchy", "disenador", [46000, 66000, 110000, 330000]),
        P("dg-light-blue", "Light Blue Pour Homme", "Dolce & Gabbana", "disenador", [38000, 60000, 90000, 280000]),
        P("ch-212-vip-black", "212 VIP Black", "Carolina Herrera", "disenador", [45000, 60000, 100000, 280000]),
        P("chanel-allure-sport-extreme", "Allure Homme Sport Eau Extrême", "Chanel", "disenador", [60000, 100000, 180000, 556000]),
        P("prada-lhomme-intense", "L'Homme Intense", "Prada", "disenador", [50000, 75000, 135000, 330000]),
      ],
      arabe: [
        P("afnan-9pm", "9PM EDP", "Afnan", "arabe", [25000, 35000, 50000, 130000]),
        P("afnan-9pm-night-out", "9PM Night Out", "Afnan", "arabe", [30000, 45000, 70000, 180000]),
        P("afnan-9pm-rebel", "9PM Rebel", "Afnan", "arabe", [28000, 40000, 60000, 135000]),
        P("afnan-turathi-blue", "Turathi Blue", "Afnan", "arabe", [28000, 40000, 60000, 135000]),
        P("afnan-turathi-electric", "Turathi Electric", "Afnan", "arabe", [28000, 40000, 60000, 135000]),
        P("lattafa-qaed-al-fursan", "Qaed Al Fursan", "Lattafa", "arabe", [25000, 35000, 50000, 130000]),
        P("lattafa-asad", "Asad", "Lattafa", "arabe", [25000, 35000, 50000, 128000]),
        P("lattafa-asad-zanzibar", "Asad Zanzibar", "Lattafa", "arabe", [25000, 35000, 45000, 130000]),
        P("lattafa-asad-bourbon", "Asad Bourbon", "Lattafa", "arabe", [28000, 38000, 56000, 145000]),
        P("lattafa-khamrah", "Khamrah", "Lattafa", "arabe", [25000, 45000, 70000, 128000]),
        P("lattafa-khamrah-dukhan", "Khamrah Dukhan", "Lattafa", "arabe", [28000, 45000, 70000, 128000]),
        P("lattafa-khamrah-qahwa", "Khamrah Qahwa", "Lattafa", "arabe", [28000, 45000, 70000, 128000]),
        P("lattafa-hayaati", "Hayaati", "Lattafa", "arabe", [28000, 35000, 50000, 130000]),
        P("lattafa-ramz-silver", "Ramz Silver", "Lattafa", "arabe", [28000, 40000, 60000, 130000]),
        P("armaf-cdn-intense", "Club de Nuit Intense", "Armaf", "arabe", [30000, 40000, 60000, 150000]),
        P("armaf-cdn-iconic", "Club de Nuit Iconic", "Armaf", "arabe", [28000, 40000, 60000, 155000]),
        P("armaf-cdn-precieux", "Club de Nuit Précieux", "Armaf", "arabe", [40000, 60000, 100000, 255000]),
        P("armaf-mandarin-sky", "Mandarin Sky", "Armaf", "arabe", [25000, 35000, 50000, 128000]),
        P("rasasi-hawas-ice", "Hawas Ice", "Rasasi", "arabe", [30000, 45000, 60000, 160000]),
        P("rasasi-hawas-elixir", "Hawas Elixir", "Rasasi", "arabe", [30000, 40000, 60000, 150000]),
        P("rasasi-hawas-fire", "Hawas Fire", "Rasasi", "arabe", [30000, 40000, 60000, 155000]),
        P("rasasi-hawas-black", "Hawas Black", "Rasasi", "arabe", [30000, 45000, 60000, 150000]),
        P("rasasi-hawas-kobra", "Hawas Kobra", "Rasasi", "arabe", [30000, 40000, 60000, 160000]),
        P("rasasi-hawas-tropical", "Hawas Tropical", "Rasasi", "arabe", [30000, 40000, 60000, 160000]),
        P("rayhaan-elixir", "Rayhaan Elixir", "Rayhaan", "arabe", [25000, 38000, 58000, 130000]),
        P("alharamain-amber-oud-gold", "Amber Oud Gold Edition", "Al Haramain", "arabe", [30000, 45000, 70000, 180000]),
        P("alharamain-amber-oud-aqua-dubai", "Amber Oud Aqua Dubai", "Al Haramain", "arabe", [30000, 45000, 70000, 190000]),
        P("bharara-king", "King", "Bharara", "arabe", [30000, 45000, 70000, 185000]),
        P("fa-liquid-brun", "Liquid Brun", "French Avenue", "arabe", [28000, 38000, 56000, 160000]),
        P("fa-vulcan-feu", "Vulcan Feu", "French Avenue", "arabe", [30000, 45000, 70000, 180000]),
      ],
      nicho: [
        P("xerjoff-erba-pura", "Erba Pura", "Xerjoff", "nicho", [85000, 120000, 210000, 650000]),
        P("xerjoff-naxos", "Naxos", "Xerjoff", "nicho", [85000, 130000, 240000, 660000]),
        P("pdm-layton", "Layton", "Parfums de Marly", "nicho", [80000, 120000, 220000, 660000]),
        P("nishane-hacivat", "Hacivat", "Nishane", "nicho", [85000, 140000, 240000, 660000]),
        P("tf-ombre-leather", "Ombre Leather", "Tom Ford", "nicho", [80000, 140000, 240000, 660000]),
        P("ed-espada-guarani", "Espada Guaraní", "Estella Dustin", "nicho", [30000, 40000, 55000, 150000]),
      ],
    },
  },
  femenino: {
    // Preparado para el futuro. NO se muestra en la web todavía.
    categories: { disenador: [], arabe: [], nicho: [] },
  },
};

const CATEGORY_LABELS = {
  disenador: "Diseñador",
  arabe: "Árabe",
  nicho: "Nicho",
};

const CATEGORY_DESC = {
  disenador: "Las casas de moda y sus íconos contemporáneos.",
  arabe: "Estelas potentes y dulces del Medio Oriente.",
  nicho: "Perfumería de autor, rara y de alta concentración.",
};

const MASCULINO_ALL = Object.entries(catalogs.masculino.categories).flatMap(
  ([, items]) => items
);

// Índice por id para componer combos con imágenes reales
const PRODUCTS_BY_ID = {};
MASCULINO_ALL.forEach((p) => { PRODUCTS_BY_ID[p.id] = p; });

window.EMDINO_DATA = {
  catalogs,
  CATEGORY_LABELS,
  CATEGORY_DESC,
  MASCULINO_ALL,
  PRODUCTS_BY_ID,
  SIZES,
};
