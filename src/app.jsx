// EMDINO — App principal: estado de carrito (localStorage) + composición
const { useState: useStateApp, useEffect: useEffectApp } = React;

const CART_LS_KEY = "emdino_cart_v1";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function SectionDivider() {
  return (
    <div className="section-divider" role="separator" aria-hidden="true">
      <span className="sd-line"></span>
      <svg className="sd-ornament" viewBox="0 0 320 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* curvas elegantes a cada lado (volutas tipo flourish) */}
        <path d="M20 18 C 60 18, 90 22, 120 18 C 130 16.5, 138 15, 145 14"
              stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
        <path d="M300 18 C 260 18, 230 22, 200 18 C 190 16.5, 182 15, 175 14"
              stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
        {/* pequeños puntos en los extremos de las volutas */}
        <circle cx="16" cy="18" r="1.2" fill="currentColor" />
        <circle cx="304" cy="18" r="1.2" fill="currentColor" />
        {/* base curva tipo cáliz que sostiene el cetro */}
        <path d="M135 18 C 142 22, 178 22, 185 18"
              stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" />
        {/* pétalos del cetro central */}
        <g className="sd-gem">
          <path d="M160 5 L160 16"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M160 7 C 156 9, 154 13, 153 16 C 156 15, 159 13, 160 10 Z"
                fill="currentColor" stroke="currentColor" strokeWidth="0.6" />
          <path d="M160 7 C 164 9, 166 13, 167 16 C 164 15, 161 13, 160 10 Z"
                fill="currentColor" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="160" cy="4" r="1.5" fill="currentColor" />
        </g>
      </svg>
      <span className="sd-line"></span>
    </div>
  );
}

function getRoute() {
  const h = (window.location.hash || "").replace(/^#/, "");
  const [base] = h.split("?");
  if (base === "fragancias") return "catalog";
  if (base === "combos") return "combos";
  return "home";
}

function getHashParam(key) {
  const h = (window.location.hash || "").replace(/^#/, "");
  const qIdx = h.indexOf("?");
  if (qIdx === -1) return null;
  const params = new URLSearchParams(h.slice(qIdx + 1));
  return params.get(key);
}

function App() {
  const [cart, setCart] = useStateApp(loadCart);
  const [cartOpen, setCartOpen] = useStateApp(false);
  const [checkoutOpen, setCheckoutOpen] = useStateApp(false);
  const [toast, setToast] = useStateApp(null);
  const [route, setRoute] = useStateApp(getRoute);
  const [detail, setDetail] = useStateApp(null);
  const [comboDetail, setComboDetail] = useStateApp(null);

  useEffectApp(() => {
    const openFromHash = () => {
      const pid = getHashParam("p");
      if (pid) {
        const p = window.EMDINO_DATA && window.EMDINO_DATA.PRODUCTS_BY_ID[pid];
        if (p) setDetail(p);
      }
    };
    const onHash = () => {
      const newRoute = getRoute();
      setRoute(newRoute);
      const h = (window.location.hash || "").replace(/^#/, "");
      const [base] = h.split("?");
      // Si el hash apunta a un anchor del home (envios, contacto, inicio, etc.)
      // y no a una ruta o producto, hacemos scroll al elemento después del render.
      const isAnchor = base && newRoute === "home" && !getHashParam("p");
      if (isAnchor) {
        // dos rAF + setTimeout para que React monte el home antes de buscar el elemento
        const scrollAttempt = (tries) => {
          const el = document.getElementById(base);
          if (el) {
            const targetY = el.getBoundingClientRect().top + window.scrollY - 12;
            window.scrollTo({ top: targetY, behavior: "smooth" });
            // Fallback inmediato (algunos browsers/headless ignoran smooth)
            setTimeout(() => { if (Math.abs(window.scrollY - targetY) > 4) window.scrollTo(0, targetY); }, 700);
          }
          else if (tries > 0) setTimeout(() => scrollAttempt(tries - 1), 60);
          else window.scrollTo({ top: 0 });
        };
        requestAnimationFrame(() => setTimeout(() => scrollAttempt(8), 30));
      } else {
        window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
      }
      openFromHash();
    };
    window.addEventListener("hashchange", onHash);
    // abrir modal si la URL inicial ya trae ?p=<id>
    openFromHash();
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // persistir carrito
  useEffectApp(() => {
    try {
      localStorage.setItem(CART_LS_KEY, JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // bloquear scroll con drawer/modal abierto
  useEffectApp(() => {
    document.body.style.overflow = cartOpen || checkoutOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, checkoutOpen]);

  // reveal sutil al hacer scroll (con fallback robusto)
  useEffectApp(() => {
    const els = Array.from(document.querySelectorAll(".reveal, .stagger"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    // Seguridad: si algo quedó por encima del viewport o el observer no
    // disparó, revelarlo igual (nunca dejar contenido invisible).
    const safety = setTimeout(() => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add("in");
      });
    }, 1400);
    return () => { io.disconnect(); clearTimeout(safety); };
  }, [route]);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => setToast(null), 2200);
  };

  const cartCount = cart.reduce((s, it) => s + it.qty, 0);

  // ---- acciones de carrito ----
  const addProduct = (product, size) => {
    const key = product.id + "::" + size;
    setCart((prev) => {
      const found = prev.find((it) => it.key === key);
      if (found) {
        return prev.map((it) =>
          it.key === key ? { ...it, qty: it.qty + 1 } : it
        );
      }
      return [
        ...prev,
        {
          key,
          type: "product",
          id: product.id,
          name: product.marca + " " + product.nombre,
          size,
          unitPrice: product.precios[size],
          qty: 1,
        },
      ];
    });
    showToast(product.nombre + " (" + size + ") agregado al carrito");
  };

  const addCombo = (combo) => {
    const key = "combo::" + combo.id;
    setCart((prev) => {
      const found = prev.find((it) => it.key === key);
      if (found) {
        return prev.map((it) =>
          it.key === key ? { ...it, qty: it.qty + 1 } : it
        );
      }
      return [
        ...prev,
        {
          key,
          type: "combo",
          id: combo.id,
          name: "Combo " + combo.nombre,
          detail: combo.presentacion + " · " + combo.incluye.join(", "),
          unitPrice: combo.precioPromo,
          qty: 1,
        },
      ];
    });
    showToast("Combo " + combo.nombre + " agregado al carrito");
  };

  const setQty = (key, qty) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((it) => it.key !== key)
        : prev.map((it) => (it.key === key ? { ...it, qty } : it))
    );
  };

  const removeItem = (key) => {
    setCart((prev) => prev.filter((it) => it.key !== key));
  };

  const openCheckout = () => {
    if (cart.length === 0) return;
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <React.Fragment>
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <main>
        {route === "catalog" ? (
          <ProductCatalog onAdd={addProduct} onOpenDetail={setDetail} />
        ) : route === "combos" ? (
          <ComboPage onAdd={addCombo} onOpenCombo={setComboDetail} />
        ) : (
          <React.Fragment>
            <Hero onOpenDetail={setDetail} />
            <BrandMarquee />
            <FeaturedUniverse />
            <SectionDivider />
            <ComboSection onAdd={addCombo} onOpenCombo={setComboDetail} />
            <SectionDivider />
            <HowItWorks />
            <SectionDivider />
            <ShippingSection />
          </React.Fragment>
        )}
      </main>
      <Footer />
      <WhatsAppFloatingButton />
      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onQty={setQty}
        onRemove={removeItem}
        onCheckout={openCheckout}
      />
      <CheckoutModal
        open={checkoutOpen}
        items={cart}
        onClose={() => setCheckoutOpen(false)}
      />
      <ProductModal
        product={detail}
        onClose={() => {
          setDetail(null);
          if (window.location.hash.indexOf("?p=") !== -1) {
            const [base] = window.location.hash.split("?");
            history.replaceState(null, "", base);
          }
        }}
        onAdd={addProduct}
      />
      <ComboModal
        combo={comboDetail}
        onClose={() => setComboDetail(null)}
        onAdd={addCombo}
      />
      <Toast toast={toast} />
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
