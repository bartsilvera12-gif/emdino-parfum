// EMDINO — Header (negro, sticky, scroll-aware, logo real)
const { useState: useHState, useEffect: useHEffect } = React;

const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#fragancias", label: "Fragancias" },
  { href: "#combos", label: "Combos" },
  { href: "#envios", label: "Envíos" },
  { href: "#contacto", label: "Contacto" },
];

function Header({ cartCount, onCartOpen }) {
  const [open, setOpen] = useHState(false);
  const [scrolled, setScrolled] = useHState(false);
  const [bump, setBump] = useHState(false);

  useHEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useHEffect(() => {
    if (cartCount > 0) { setBump(true); const t = setTimeout(() => setBump(false), 380); return () => clearTimeout(t); }
  }, [cartCount]);

  useHEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={"site-header" + (scrolled ? " scrolled" : "")} data-screen-label="Header">
      <div className="wrap header-inner">
        <button className="burger" aria-label="Menú" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span className={"bz" + (open ? " o1" : "")}></span>
          <span className={"bz" + (open ? " o2" : "")}></span>
        </button>

        <a href="#inicio" className="logo-link" aria-label="Emdino Perfumería — Inicio">
          <img src="assets/logo-dark.png" alt="Emdino Perfumería" className="logo-img" />
        </a>

        <nav className="main-nav" aria-label="Navegación principal">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-link"><span>{l.label}</span></a>
          ))}
        </nav>

        <button className={"cart-btn" + (bump ? " bump" : "")} onClick={onCartOpen} aria-label="Abrir carrito">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="M5 8.5h14l-1.1 11.1a1 1 0 0 1-1 .9H7.1a1 1 0 0 1-1-.9L5 8.5Z"></path>
            <path d="M8.7 8.5V7a3.3 3.3 0 0 1 6.6 0v1.5"></path>
          </svg>
          <span className="cart-label">Carrito</span>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </div>

      <div className={"mobile-menu" + (open ? " open" : "")}>
        <nav>
          {NAV_LINKS.map((l, i) => (
            <a key={l.href} href={l.href} className="m-link" style={{ transitionDelay: open ? 60 + i * 50 + "ms" : "0ms" }} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="m-foot">
          <span>Encarnación · Paraguay</span>
          <a href={EMDINO_UTILS.waLink("Hola, quiero más información sobre Emdino Perfumería.")} target="_blank" rel="noopener">WhatsApp {EMDINO_UTILS.WHATSAPP_DISPLAY}</a>
        </div>
      </div>
    </header>
  );
}

window.Header = Header;
