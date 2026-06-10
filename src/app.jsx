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

function App() {
  const [cart, setCart] = useStateApp(loadCart);
  const [cartOpen, setCartOpen] = useStateApp(false);
  const [checkoutOpen, setCheckoutOpen] = useStateApp(false);
  const [toast, setToast] = useStateApp(null);

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
  }, []);

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
        <Hero />
        <BrandMarquee />
        <HowItWorks />
        <ProductCatalog onAdd={addProduct} />
        <ComboSection onAdd={addCombo} />
        <ShippingSection />
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
      <Toast toast={toast} />
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
