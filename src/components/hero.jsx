// EMDINO — Hero editorial premium + staging fotográfico tipo "Decants Milano"
const { useState: useHeroState } = React;

// Bombilla destacada al centro + 2 a los lados + 3 viales decant al frente
const STAGE_FEATURED = "pr-invictus-victory-elixir";
const STAGE_LEFT = "armani-adg-profondo";
const STAGE_RIGHT = "ysl-y-edp";
const stageCut = (id) => "assets/perfumes-cut/" + id + ".png";

function DecantVial({ i }) {
  return (
    <span className={"stage-vial v-" + i} aria-hidden="true">
      <span className="vial-cap"></span>
      <span className="vial-collar"></span>
      <span className="vial-body">
        <span className="vial-liquid"></span>
        <span className="vial-shine"></span>
      </span>
    </span>
  );
}

function PerfumeStaging({ onOpenDetail }) {
  const { PRODUCTS_BY_ID } = window.EMDINO_DATA;
  const featured = PRODUCTS_BY_ID[STAGE_FEATURED];
  const left = PRODUCTS_BY_ID[STAGE_LEFT];
  const right = PRODUCTS_BY_ID[STAGE_RIGHT];

  return (
    <figure className="stage" aria-label="Vitrina de perfumes destacados">
      <span className="stage-bg" aria-hidden="true"></span>
      <span className="stage-shadow stage-shadow-soft" aria-hidden="true"></span>

      <div className="stage-podium stage-podium-back" aria-hidden="true"></div>
      <div className="stage-podium stage-podium-mid" aria-hidden="true"></div>
      <div className="stage-podium stage-podium-front" aria-hidden="true"></div>

      {left && (
        <button
          type="button"
          className="stage-bottle stage-left"
          onClick={() => onOpenDetail && onOpenDetail(left)}
          aria-label={"Ver " + left.marca + " " + left.nombre}
        >
          <img src={stageCut(STAGE_LEFT)} alt="" loading="lazy" />
        </button>
      )}
      {featured && (
        <button
          type="button"
          className="stage-bottle stage-hero"
          onClick={() => onOpenDetail && onOpenDetail(featured)}
          aria-label={"Ver " + featured.marca + " " + featured.nombre}
        >
          <img src={stageCut(STAGE_FEATURED)} alt="" loading="lazy" />
        </button>
      )}
      {right && (
        <button
          type="button"
          className="stage-bottle stage-right"
          onClick={() => onOpenDetail && onOpenDetail(right)}
          aria-label={"Ver " + right.marca + " " + right.nombre}
        >
          <img src={stageCut(STAGE_RIGHT)} alt="" loading="lazy" />
        </button>
      )}

      <div className="stage-vials" aria-hidden="true">
        <DecantVial i={1} />
        <DecantVial i={2} />
        <DecantVial i={3} />
      </div>
    </figure>
  );
}

function Hero({ onOpenDetail }) {
  return (
    <section className="hero hero-staging" id="inicio" data-screen-label="Hero">
      <div className="hero-bg" aria-hidden="true"></div>
      <span className="hero-orb hero-orb-1" aria-hidden="true"></span>
      <span className="hero-orb hero-orb-2" aria-hidden="true"></span>

      <div className="wrap hero-grid">
        <div className="hero-left">
          <p className="eyebrow"><span className="tick"></span>Decants originales · Encarnación</p>
          <h1 className="display hero-title">
            Probá perfumes originales <span className="y italic">sin comprar el frasco completo</span>.
          </h1>
          <span className="hero-ornament" aria-hidden="true">
            <span className="ho-line"></span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 3v18M3 12h18"/></svg>
            <span className="ho-line"></span>
          </span>
          <p className="hero-sub">
            Decants premium de 3, 5, 10 y 30&nbsp;ml para descubrir nuevos aromas,
            regalar o llevar tus perfumes favoritos a todos lados.
          </p>
          <div className="hero-actions">
            <a href="#fragancias" className="btn yellow">Ver catálogo completo</a>
          </div>
        </div>

        <div className="hero-right">
          <PerfumeStaging onOpenDetail={onOpenDetail} />
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
