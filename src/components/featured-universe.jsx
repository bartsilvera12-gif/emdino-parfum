// EMDINO — "Productos destacados" por género (editorial oscuro estilo campaña)
// Tabs Masculinas/Femeninas · cards grandes verticales · fade+slide al cambiar
// género · hover con zoom/overlay · entrada al hacer scroll (IntersectionObserver).
const { useState: usePuState, useEffect: usePuEffect, useRef: usePuRef } = React;

const puCut = (id) => "assets/perfumes-cut/" + id + ".png";

// Selección masculina: IDs reales del catálogo (imagen recortada sobre negro).
const PU_MASCULINO = [
  "jpg-le-male-elixir",
  "ysl-y-edp",
  "versace-eros",
  "pr-invictus-victory-elixir",
];

// Selección femenina: estructura temporal. Emdino aún no carga línea femenina,
// así que estas tarjetas se muestran como "Próximamente". Para activarlas:
// agregá la imagen real en assets/perfumes-cut/<id>.png (o /perfumes/<id>.jpg),
// poné `image: puCut("<id>")` y sacá `soon: true`.
const PU_FEMENINO = [
  { id: "fem-yara", marca: "Lattafa", name: "Yara", soon: true },
  { id: "fem-mayar", marca: "Lattafa", name: "Mayar", soon: true },
  { id: "fem-libre", marca: "Yves Saint Laurent", name: "Libre", soon: true },
  { id: "fem-myway", marca: "Giorgio Armani", name: "My Way", soon: true },
];

const PU_TABS = [
  { key: "masculino", label: "Fragancias Masculinas" },
  // La línea femenina aún no está disponible. Para reactivarla, descomentá
  // esta entrada (y cargá imágenes reales en PU_FEMENINO).
  // { key: "femenino", label: "Fragancias Femeninas" },
];

function puInitials(marca) {
  return marca.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function PuCard({ item, index }) {
  const href = item.image ? "#fragancias?p=" + item.id : "#fragancias";
  return (
    <a
      className="pu-card"
      href={href}
      style={{ "--i": index }}
      aria-label={item.marca + " " + item.name}
    >
      <div className="pu-card-media">
        {item.image ? (
          <img className="pu-img" src={item.image} alt={item.marca + " " + item.name} loading="lazy" />
        ) : (
          <div className="pu-ph" aria-hidden="true">
            <span className="pu-ph-mono">{puInitials(item.marca)}</span>
            {item.soon && <span className="pu-ph-soon">Próximamente</span>}
          </div>
        )}
        <span className="pu-overlay" aria-hidden="true"></span>
        <span className="pu-shine" aria-hidden="true"></span>
      </div>
      <div className="pu-card-info">
        <span className="pu-brand">{item.marca}</span>
        <h3 className="pu-name">{item.name}<span className="pu-name-line"></span></h3>
      </div>
    </a>
  );
}

function FeaturedUniverse() {
  const { PRODUCTS_BY_ID } = window.EMDINO_DATA;
  const [gender, setGender] = usePuState("masculino");
  const [inView, setInView] = usePuState(false);
  const secRef = usePuRef(null);

  usePuEffect(() => {
    if (!("IntersectionObserver" in window) || !secRef.current) { setInView(true); return; }
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }); },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(secRef.current);
    return () => io.disconnect();
  }, []);

  const items = gender === "masculino"
    ? PU_MASCULINO.map((id) => {
        const p = PRODUCTS_BY_ID[id];
        return p ? { id: p.id, marca: p.marca, name: p.nombre, image: puCut(p.id) } : null;
      }).filter(Boolean)
    : PU_FEMENINO;

  return (
    <section
      className={"pu" + (inView ? " in" : "")}
      id="destacados"
      ref={secRef}
      data-screen-label="Productos destacados"
    >
      <div className="wrap pu-wrap">
        <header className="pu-head">
          <p className="pu-eyebrow">La colección Emdino</p>
          <h2 className="pu-title">Productos destacados</h2>
          {PU_TABS.length > 1 && (
            <div className="pu-tabs" role="tablist" aria-label="Universo de fragancias">
              {PU_TABS.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={gender === t.key}
                  className={"pu-tab" + (gender === t.key ? " is-active" : "")}
                  onClick={() => setGender(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </header>

        <div className="pu-gallery" key={gender}>
          {items.map((it, i) => (
            <PuCard item={it} index={i} key={it.id} />
          ))}
        </div>

        <div className="pu-foot">
          <a className="pu-cta" href="#fragancias">
            Ver todo el catálogo
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
          </a>
        </div>
      </div>
    </section>
  );
}

window.FeaturedUniverse = FeaturedUniverse;
