// EMDINO — Showcase editorial de fragancias destacadas
const { useState: useFState, useEffect: useFEffect, useRef: useFRef } = React;

const FEATURED_IDS = [
  "versace-eros",
  "jpg-le-male-elixir",
  "ysl-y-edp",
  "armani-swy-intensely",
  "rasasi-hawas-ice",
  "pr-invictus-victory-elixir",
  "lattafa-khamrah",
  "versace-eros-flame",
];

const ROTATE_MS = 6800;
const cutPath = (id) => "assets/perfumes-cut/" + id + ".png";
function pad2(n) { return String(n).padStart(2, "0"); }

function FeaturedFragrances({ onAdd }) {
  const { PRODUCTS_BY_ID, CATEGORY_LABELS, SIZES } = window.EMDINO_DATA;
  const { formatGs: fmt, waLink, waProductMessage } = window.EMDINO_UTILS;
  const items = FEATURED_IDS.map((id) => PRODUCTS_BY_ID[id]).filter(Boolean);

  const [idx, setIdx] = useFState(0);
  const [size, setSize] = useFState("5ml");
  const [paused, setPaused] = useFState(false);
  const timerRef = useFRef(null);

  useFEffect(() => {
    if (paused || items.length <= 1) return;
    timerRef.current = setTimeout(() => {
      setIdx((i) => (i + 1) % items.length);
    }, ROTATE_MS);
    return () => clearTimeout(timerRef.current);
  }, [idx, paused, items.length]);

  const go = (n) => setIdx(((n % items.length) + items.length) % items.length);
  const current = items[idx];

  return (
    <section className="section featured" id="destacadas" data-screen-label="Fragancias destacadas">
      <span className="featured-vignette" aria-hidden="true"></span>
      <div className="wrap">
        <header className="featured-head reveal">
          <p className="eyebrow"><span className="tick"></span>Selección de la casa</p>
          <h2 className="display featured-title">Una curaduría<br /><em>para encontrar tu firma</em></h2>
        </header>

        <div
          className="featured-stage"
          data-cat={current ? current.categoria : "disenador"}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-roledescription="carrusel"
          aria-label="Fragancias destacadas"
        >
          <div className="featured-plate">
            <span className="featured-corner tl" aria-hidden="true"></span>
            <span className="featured-corner tr" aria-hidden="true"></span>
            <span className="featured-corner bl" aria-hidden="true"></span>
            <span className="featured-corner br" aria-hidden="true"></span>
            <span className="featured-halo" aria-hidden="true"></span>
            <span className="featured-shine" aria-hidden="true"></span>

            <div className="featured-bottles">
              {items.map((p, i) => (
                <div
                  key={p.id}
                  className={"featured-bottle" + (i === idx ? " is-active" : "")}
                  role="img"
                  aria-label={p.marca + " " + p.nombre}
                  aria-hidden={i !== idx}
                  style={{ backgroundImage: "url(" + cutPath(p.id) + ")" }}
                ></div>
              ))}
              <span className="featured-floor" aria-hidden="true"></span>
            </div>
          </div>

          <div className="featured-body">
            <div className="featured-copy-stack">
              {items.map((p, i) => (
                <article
                  key={p.id}
                  className={"featured-copy" + (i === idx ? " is-active" : "")}
                  aria-hidden={i !== idx}
                >
                  <p className="featured-cat">{CATEGORY_LABELS[p.categoria]}</p>
                  <p className="featured-brand">{p.marca}</p>
                  <h3 className="featured-name display">{p.nombre}</h3>
                  <span className="featured-rule" aria-hidden="true"></span>
                  <div className="featured-sizes" role="group" aria-label="Presentación">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        className={"featured-size" + (size === s ? " active" : "")}
                        onClick={() => setSize(s)}
                        aria-pressed={size === s}
                      >{s}</button>
                    ))}
                  </div>
                  <div className="featured-price">
                    <span className="featured-price-k">{size}</span>
                    <span className="featured-price-v">{fmt(p.precios[size])}</span>
                  </div>
                  <div className="featured-actions">
                    <button className="btn yellow" onClick={() => onAdd(p, size)}>Agregar {size}</button>
                    <a className="btn outline-dark" href={waLink(waProductMessage(p.marca + " " + p.nombre, size))} target="_blank" rel="noopener">Consultar por WhatsApp</a>
                  </div>
                </article>
              ))}
            </div>

            <div className="featured-rail" role="tablist" aria-label="Seleccionar fragancia">
              {items.map((p, i) => (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={i === idx}
                  className={"featured-thumb" + (i === idx ? " is-active" : "")}
                  onClick={() => go(i)}
                  aria-label={p.marca + " " + p.nombre}
                  style={{ backgroundImage: "url(" + cutPath(p.id) + ")" }}
                >
                  {i === idx && !paused && (
                    <span className="featured-thumb-bar" style={{ animationDuration: ROTATE_MS + "ms" }}></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="featured-controls">
          <button className="featured-nav" aria-label="Anterior" onClick={() => go(idx - 1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="m15 5-7 7 7 7"></path></svg>
          </button>
          <span className="featured-count" aria-live="polite">
            <span className="featured-count-n">{pad2(idx + 1)}</span>
            <span className="featured-count-sep">/</span>
            <span className="featured-count-t">{pad2(items.length)}</span>
          </span>
          <button className="featured-nav" aria-label="Siguiente" onClick={() => go(idx + 1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="m9 5 7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

window.FeaturedFragrances = FeaturedFragrances;
