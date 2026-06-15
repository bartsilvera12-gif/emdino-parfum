// EMDINO — Hero editorial premium con fondo fotográfico estático
const WA = window.EMDINO_UTILS;

function Hero() {
  const waMsg = "Hola, quiero consultar por las fragancias de Emdino Perfumería.";
  return (
    <section className="hero hero-photo" id="inicio" data-screen-label="Hero">
      <div className="hero-photo-bg" aria-hidden="true"></div>
      <div className="hero-photo-overlay" aria-hidden="true"></div>

      <div className="wrap hero-photo-grid">
        <div className="hero-photo-copy">
          <p className="eyebrow"><span className="tick"></span>Decants originales · Encarnación</p>
          <h1 className="display hero-photo-title">
            Descubrí tu próxima fragancia <span className="hp-accent">sin comprar el frasco entero</span>.
          </h1>
          <p className="hero-photo-sub">
            Perfumes de diseñador, árabes y nicho en presentaciones de 3, 5, 10 y 30&nbsp;ml.
            Probá, elegí y encontrá tu firma personal con una experiencia premium.
          </p>
          <div className="hero-photo-actions">
            <a href="#fragancias" className="btn yellow">Explorar fragancias</a>
            <a href={WA.waLink(waMsg)} target="_blank" rel="noopener" className="btn outline-dark">Consultar por WhatsApp</a>
          </div>
        </div>
      </div>

    </section>
  );
}

window.Hero = Hero;
