// EMDINO — Marquee de casas + banda "El formato decant"
const HOUSES = [
  "Jean Paul Gaultier", "Xerjoff", "Parfums de Marly", "Giorgio Armani",
  "Lattafa", "Nishane", "Tom Ford", "Versace", "Valentino", "Afnan",
  "Rasasi", "Dior", "Yves Saint Laurent", "Armaf", "Carolina Herrera", "Bvlgari",
];

function BrandMarquee() {
  const row = HOUSES.concat(HOUSES);
  return (
    <div className="marquee" aria-label="Casas de perfumería">
      <div className="marquee-vp" aria-hidden="true">
        <div className="marquee-track">
          {row.map((h, i) => (<span className="m-item" key={i}>{h}<span className="m-dot"></span></span>))}
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  { n: "01", t: "Elegí", d: "Recorré un catálogo curado de fragancias de diseñador, árabes y de nicho. Todas originales." },
  { n: "02", t: "Probá", d: "Llevás 3, 5, 10 o 30 ml. Lo justo para vivir el perfume en tu piel antes del frasco completo." },
  { n: "03", t: "Encontrá tu firma", d: "Sumás al carrito y finalizás por WhatsApp. Coordinamos retiro en Encarnación o envío a tu ciudad." },
];

const TRUST = [
  { t: "Perfumes seleccionados", d: "Diseñador, árabes y nicho. 100% originales." },
  { t: "Presentaciones flexibles", d: "3, 5, 10 y 30 ml para probar sin compromiso." },
  { t: "Atención personalizada", d: "Te asesoramos por WhatsApp antes de comprar." },
  { t: "Llega donde estés", d: "Envíos a todo Paraguay y retiro en Encarnación." },
];

function HowItWorks() {
  return (
    <section className="section how" data-screen-label="El formato decant">
      <div className="wrap how-grid">
        <div className="how-lead reveal">
          <p className="eyebrow"><span className="tick"></span>El formato decant</p>
          <h2 className="display how-title">Un perfume no se elige por la etiqueta. Se elige por cómo te queda.</h2>
          <p className="how-note">Por eso fraccionamos: probás de verdad, sin riesgo, antes de invertir en el frasco entero.</p>
        </div>
        <ol className="how-steps stagger">
          {STEPS.map((s) => (
            <li className="how-step" key={s.n}>
              <span className="how-num">{s.n}</span>
              <div className="how-step-body">
                <h3 className="how-step-t">{s.t}</h3>
                <p className="how-step-d">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="wrap trust-band reveal">
        {TRUST.map((it) => (
          <div className="trust-item" key={it.t}>
            <span className="trust-mark" aria-hidden="true"></span>
            <div>
              <h3 className="trust-t">{it.t}</h3>
              <p className="trust-d">{it.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { BrandMarquee, HowItWorks });
