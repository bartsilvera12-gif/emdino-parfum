// EMDINO — Envíos, Footer, botón flotante WhatsApp, Toast
const SU = window.EMDINO_UTILS;

function ShippingSection() {
  return (
    <section className="section shipping" id="envios" data-screen-label="Envíos">
      <div className="wrap shipping-grid">
        <div className="shipping-lead reveal">
          <p className="eyebrow"><span className="tick"></span>Envíos</p>
          <h2 className="display">Te lo llevamos<br />donde estés.</h2>
        </div>
        <div className="shipping-cards stagger">
          <div className="ship-card">
            <span className="ship-card-n">Gs. 300.000</span>
            <p className="ship-card-t">Envío gratis</p>
            <p className="ship-card-d">En compras desde Gs. 300.000, el envío corre por nuestra cuenta.</p>
          </div>
          <div className="ship-card">
            <span className="ship-card-n">Encarnación</span>
            <p className="ship-card-t">Retiro local</p>
            <p className="ship-card-d">Coordinás el retiro por WhatsApp y pasás a buscar tu pedido.</p>
          </div>
          <div className="ship-card">
            <span className="ship-card-n">Todo el país</span>
            <p className="ship-card-t">Envíos nacionales</p>
            <p className="ship-card-d">Enviamos a todo Paraguay. La entrega se coordina al confirmar.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" id="contacto" data-screen-label="Footer">
      <div className="wrap footer-top reveal">
        <p className="footer-phrase display">Decants originales para<br />descubrir tu próxima <span className="y italic">fragancia</span>.</p>
        <a href={SU.waLink("Hola, quiero hacer una consulta a Emdino Perfumería.")} target="_blank" rel="noopener" className="btn yellow">Escribinos por WhatsApp</a>
      </div>
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <img src="assets/logo-dark.png" alt="Emdino Perfumería" className="footer-logo" />
          <p className="footer-loc">Encarnación, Paraguay</p>
        </div>
        <div className="footer-col">
          <p className="footer-h">Contacto</p>
          <a href={SU.waLink("Hola, quiero más información sobre Emdino Perfumería.")} target="_blank" rel="noopener" className="footer-link">WhatsApp · {SU.WHATSAPP_DISPLAY}</a>
          <a href={SU.INSTAGRAM_URL} target="_blank" rel="noopener" className="footer-link">Instagram · {SU.INSTAGRAM_HANDLE}</a>
        </div>
        <div className="footer-col">
          <p className="footer-h">Tienda</p>
          <a href="#fragancias" className="footer-link">Fragancias masculinas</a>
          <a href="#combos" className="footer-link">Combos</a>
          <a href="#envios" className="footer-link">Envíos</a>
        </div>
      </div>
      <div className="wrap footer-base">
        <span>© {new Date().getFullYear()} Emdino Perfumería</span>
        <span>Decants 100% originales · Encarnación, PY</span>
      </div>
    </footer>
  );
}

function WhatsAppFloatingButton() {
  return (
    <a className="wa-float" href={SU.waLink("Hola, quiero consultar por los decants de Emdino Perfumería.")} target="_blank" rel="noopener" aria-label="WhatsApp">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9c-1.6 0-3.1-.42-4.4-1.15L3 21l1.2-4.45A8.96 8.96 0 0 1 3 12a9 9 0 0 1 9-9Z"></path><path d="M8.8 9.2c0 3 3 6 6 6l1.4-1.4-1.8-1.2-1 .6c-.9-.5-1.7-1.3-2.2-2.2l.6-1-1.2-1.8-1.8 1Z" fill="currentColor" stroke="none"></path></svg>
    </a>
  );
}

function Toast({ toast }) {
  return <div className={"toast" + (toast ? " show" : "")} role="status" aria-live="polite">{toast}</div>;
}

Object.assign(window, { ShippingSection, Footer, WhatsAppFloatingButton, Toast });
