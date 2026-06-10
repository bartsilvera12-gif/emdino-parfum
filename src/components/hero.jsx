// EMDINO — Hero editorial: vitrina con cortina que se abre al cargar
const { useState: useHeroState, useEffect: useHeroEffect } = React;

function Hero() {
  const { waLink } = EMDINO_UTILS;
  // cortina: closed -> opening -> open (estado final estático = abierta)
  const [curtain, setCurtain] = useHeroState("closed");
  useHeroEffect(() => {
    const r = requestAnimationFrame(() => setCurtain("opening"));
    const t = setTimeout(() => setCurtain("open"), 2600);
    return () => { cancelAnimationFrame(r); clearTimeout(t); };
  }, []);
  const shelves = [
    ["versace-eros", "jpg-le-male-elixir", "ysl-y-edp"],
    ["armani-swy-intensely", "rasasi-hawas-ice", "pr-invictus-victory-elixir"],
    ["jpg-le-beau-edt", "lattafa-khamrah", "versace-eros-flame"],
  ];
  return (
    <section className="hero" id="inicio" data-screen-label="Hero">
      <div className="hero-bg" aria-hidden="true"></div>
      <div className="wrap hero-grid">
        <div className="hero-left">
          <p className="eyebrow on-dark"><span className="tick"></span>Decants 100% originales · Encarnación</p>
          <h1 className="display hero-title">
            El lujo de probar<br />antes de <span className="y italic">elegir</span>.
          </h1>
          <p className="hero-sub">
            Fraccionamos perfumes de diseñador, árabes y de nicho en
            presentaciones de 3, 5, 10 y 30&nbsp;ml. Descubrí tu próxima firma
            sin comprar el frasco entero.
          </p>
          <div className="hero-actions">
            <a href="#fragancias" className="btn yellow">Ver fragancias</a>
            <a href={waLink("Hola, quiero consultar por los decants de Emdino Perfumería.")} target="_blank" rel="noopener" className="btn outline-light">Consultar por WhatsApp</a>
          </div>
          <div className="hero-trust">
            <div className="ht"><span className="ht-n">+68</span><span className="ht-l">fragancias masculinas</span></div>
            <div className="ht"><span className="ht-n">4</span><span className="ht-l">presentaciones · 3·5·10·30 ml</span></div>
            <div className="ht"><span className="ht-n">Gratis</span><span className="ht-l">envío desde Gs. 300.000</span></div>
          </div>
        </div>

        <div className="hero-right" aria-hidden="true">
          <div className={"vitrina curtain-" + curtain}>
            <span className="vitrina-glow"></span>
            <span className="vitrina-sheen"></span>
            <span className="vitrina-spot"></span>
            <div className="vitrina-inner">
              {shelves.map((row, r) => (
                <div className="vshelf" key={r}>
                  <span className="vshelf-light"></span>
                  <div className="vshelf-row">
                    {row.map((b) => (
                      <span className="vcell" key={b}>
                        <img className="vb" src={"assets/perfumes-cut/" + b + ".png"} alt="" />
                        <span className="vb-reflect" style={{ backgroundImage: "url(assets/perfumes-cut/" + b + ".png)" }}></span>
                      </span>
                    ))}
                  </div>
                  <span className="vplank"></span>
                </div>
              ))}
            </div>
            <figcaption className="hero-tag">
              <span className="hero-tag-k">La vitrina</span>
              <span className="hero-tag-v">Una selección de la colección</span>
            </figcaption>
            <div className="curtain">
              <span className="curtain-valance"></span>
              <span className="curtain-panel cp-left"></span>
              <span className="curtain-panel cp-right"></span>
            </div>
          </div>
        </div>
      </div>
      <a href="#fragancias" className="hero-scroll" aria-label="Bajar">
        <span>Descubrí</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 5v14M6 13l6 6 6-6"></path></svg>
      </a>
    </section>
  );
}

window.Hero = Hero;
