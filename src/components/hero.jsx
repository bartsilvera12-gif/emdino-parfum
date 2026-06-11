// EMDINO — Hero editorial premium + vitrina boutique interactiva (PerfumeShelf)
const { useState: useHeroState } = React;

const SHELF_ROWS = [
  ["versace-eros", "jpg-le-male-elixir", "ysl-y-edp"],
  ["tf-ombre-leather", "rasasi-hawas-ice", "pr-invictus-victory-elixir"],
  ["jpg-le-beau-edt", "lattafa-khamrah", "versace-eros-flame"],
];
const shelfCut = (id) => "assets/perfumes-cut/" + id + ".png";

function PerfumeShelf({ onOpenDetail }) {
  const { PRODUCTS_BY_ID } = window.EMDINO_DATA;
  const { formatGs } = window.EMDINO_UTILS;
  const flat = SHELF_ROWS.flat();
  const [activeId, setActiveId] = useHeroState(flat[0]);
  const active = PRODUCTS_BY_ID[activeId] || null;

  return (
    <figure className="shelf">
      <span className="shelf-aura" aria-hidden="true"></span>
      <div className="shelf-cabinet">
        <span className="shelf-backlight" aria-hidden="true"></span>
        <div className="shelf-rows">
          {SHELF_ROWS.map((row, ri) => (
            <div className="shelf-row" key={ri}>
              {row.map((id) => {
                const p = PRODUCTS_BY_ID[id];
                if (!p) return null;
                return (
                  <button
                    type="button"
                    key={id}
                    className={"shelf-bottle" + (id === activeId ? " is-active" : "")}
                    onMouseEnter={() => setActiveId(id)}
                    onFocus={() => setActiveId(id)}
                    onClick={() => { setActiveId(id); onOpenDetail && onOpenDetail(p); }}
                    aria-label={"Ver detalle de " + p.marca + " " + p.nombre}
                  >
                    <img src={shelfCut(id)} alt="" loading="lazy" />
                    <span className="shelf-bottle-shadow" aria-hidden="true"></span>
                  </button>
                );
              })}
              <span className="shelf-board" aria-hidden="true"></span>
            </div>
          ))}
        </div>
      </div>

      {active && (
        <figcaption className="shelf-ficha" aria-live="polite">
          <span className="shelf-ficha-brand">{active.marca}</span>
          <span className="shelf-ficha-name display">{active.nombre}</span>
          <span className="shelf-ficha-price">Desde {formatGs(active.precios["3ml"])}</span>
        </figcaption>
      )}
    </figure>
  );
}

function Hero({ onOpenDetail }) {
  const { waLink } = EMDINO_UTILS;
  return (
    <section className="hero" id="inicio" data-screen-label="Hero">
      <div className="hero-bg" aria-hidden="true"></div>
      <span className="hero-orb hero-orb-1" aria-hidden="true"></span>
      <span className="hero-orb hero-orb-2" aria-hidden="true"></span>
      <span className="hero-rule" aria-hidden="true"></span>

      <div className="wrap hero-grid">
        <div className="hero-left">
          <p className="eyebrow"><span className="tick"></span>Decants originales · Encarnación</p>
          <h1 className="display hero-title">
            Descubrí tu próxima fragancia <span className="y italic">sin comprar el frasco entero</span>.
          </h1>
          <p className="hero-sub">
            Perfumes de diseñador, árabes y nicho en presentaciones de 3, 5, 10 y 30&nbsp;ml.
            Probá, elegí y encontrá tu firma personal con una experiencia premium.
          </p>
          <div className="hero-actions">
            <a href="#fragancias" className="btn yellow">Explorar fragancias</a>
            <a href={waLink("Hola, quiero consultar por los decants de Emdino Perfumería.")} target="_blank" rel="noopener" className="btn outline-dark">Consultar por WhatsApp</a>
          </div>
          <ul className="hero-trust">
            <li className="ht"><span className="ht-n">+68</span><span className="ht-l">fragancias masculinas</span></li>
            <li className="ht"><span className="ht-n">3·5·10·30</span><span className="ht-l">presentaciones en ml</span></li>
            <li className="ht"><span className="ht-n">Todo el país</span><span className="ht-l">envíos a Paraguay</span></li>
            <li className="ht"><span className="ht-n">Encarnación</span><span className="ht-l">retiro en tienda</span></li>
          </ul>
        </div>

        <div className="hero-right">
          <PerfumeShelf onOpenDetail={onOpenDetail} />
        </div>
      </div>

      <a href="#fragancias" className="hero-scroll" aria-label="Bajar al catálogo">
        <span>Descubrí</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 5v14M6 13l6 6 6-6"></path></svg>
      </a>
    </section>
  );
}

window.Hero = Hero;
