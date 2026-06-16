// EMDINO — Public site wrapper. Carga catalogo desde Supabase (con fallback)
// y monta los componentes existentes. Setea window.EMDINO_DATA / EMDINO_COMBOS /
// EMDINO_UTILS antes del primer render para que los componentes existentes
// (que leen esos globals) funcionen sin cambios.
import React, { useEffect, useState } from "react";
import { loadCatalog, type CatalogBundle } from "./lib/catalogSource";
import { emdino, supabaseConfigured, STORE_SLUG } from "./lib/supabase";
import { installUtilsOnWindow, waOrderMessage, waLink } from "./utils/helpers";

// Componentes (estos importan y registran window.X tambien para compat interno)
import Header from "./components/header.jsx";
import Hero from "./components/hero.jsx";
import { BrandMarquee, HowItWorks } from "./components/editorial.jsx";
import { ShippingSection, Footer, WhatsAppFloatingButton, Toast } from "./components/sections.jsx";
import { ProductCatalog, ProductModal } from "./components/catalog.jsx";
import { ComboSection, ComboPage, ComboModal } from "./components/combos.jsx";
import { CartDrawer, CheckoutModal } from "./components/cart.jsx";
import FeaturedUniverse from "./components/featured-universe.jsx";

const CART_LS_KEY = "emdino_cart_v1";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function SectionDivider() {
  return (
    <div className="section-divider" role="separator" aria-hidden="true">
      <span className="sd-line"></span>
      <svg className="sd-ornament" viewBox="0 0 280 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="14" r="1.6" fill="currentColor" />
        <circle cx="264" cy="14" r="1.6" fill="currentColor" />
        <path d="M28 14 H92" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
        <path d="M252 14 H188" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
        <path d="M100 14 C 108 7.5, 116 7.5, 122 14 C 116 20.5, 108 20.5, 100 14 Z" stroke="currentColor" strokeWidth="1" />
        <path d="M180 14 C 172 7.5, 164 7.5, 158 14 C 164 20.5, 172 20.5, 180 14 Z" stroke="currentColor" strokeWidth="1" />
        <g className="sd-gem">
          <g stroke="currentColor" strokeWidth="0.9" fill="currentColor" fillOpacity="0.12">
            <path d="M140 14 C 137.3 10.8, 137.3 7.5, 140 5.5 C 142.7 7.5, 142.7 10.8, 140 14 Z" transform="rotate(0 140 14)" />
            <path d="M140 14 C 137.3 10.8, 137.3 7.5, 140 5.5 C 142.7 7.5, 142.7 10.8, 140 14 Z" transform="rotate(60 140 14)" />
            <path d="M140 14 C 137.3 10.8, 137.3 7.5, 140 5.5 C 142.7 7.5, 142.7 10.8, 140 14 Z" transform="rotate(120 140 14)" />
            <path d="M140 14 C 137.3 10.8, 137.3 7.5, 140 5.5 C 142.7 7.5, 142.7 10.8, 140 14 Z" transform="rotate(180 140 14)" />
            <path d="M140 14 C 137.3 10.8, 137.3 7.5, 140 5.5 C 142.7 7.5, 142.7 10.8, 140 14 Z" transform="rotate(240 140 14)" />
            <path d="M140 14 C 137.3 10.8, 137.3 7.5, 140 5.5 C 142.7 7.5, 142.7 10.8, 140 14 Z" transform="rotate(300 140 14)" />
          </g>
          <circle cx="140" cy="14" r="1.7" fill="currentColor" />
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

function getHashParam(key: string) {
  const h = (window.location.hash || "").replace(/^#/, "");
  const qIdx = h.indexOf("?");
  if (qIdx === -1) return null;
  const params = new URLSearchParams(h.slice(qIdx + 1));
  return params.get(key);
}

function installGlobals(bundle: CatalogBundle) {
  // Construir estructuras compatibles con los componentes existentes
  const SIZES = ["3ml", "5ml", "10ml", "30ml"];
  const products = bundle.products;
  const CATEGORY_LABELS: Record<string, string> = {};
  const CATEGORY_DESC: Record<string, string> = {};
  bundle.categories.forEach((c) => {
    CATEGORY_LABELS[c.slug] = c.name;
    if (c.description) CATEGORY_DESC[c.slug] = c.description;
  });
  // Si la web debe ocultar el catalogo femenino:
  const showFemale = bundle.settings.show_female_catalog;
  const MASCULINO_ALL = products.filter((p) => p.genero === "masculino");
  const FEMENINO_ALL = showFemale ? products.filter((p) => p.genero === "femenino") : [];
  const PRODUCTS_BY_ID: Record<string, any> = {};
  products.forEach((p) => { PRODUCTS_BY_ID[p.id] = p; PRODUCTS_BY_ID[p.slug] = p; });

  (window as any).EMDINO_DATA = {
    catalogs: {
      masculino: { categories: groupByCategory(MASCULINO_ALL) },
      femenino: { categories: groupByCategory(FEMENINO_ALL) },
    },
    CATEGORY_LABELS,
    CATEGORY_DESC,
    MASCULINO_ALL,
    FEMENINO_ALL,
    PRODUCTS_BY_ID,
    SIZES,
  };
  (window as any).EMDINO_COMBOS = bundle.combos.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    tagline: c.tagline,
    items: c.items,
    incluye: c.incluye,
    presentacion: c.presentacion,
    precioNormal: c.precioNormal,
    precioPromo: c.precioPromo,
    precios: c.precios || {},
    preciosNormal: c.preciosNormal || {},
    destacado: c.destacado,
    imagen: c.imagen,
  }));
  installUtilsOnWindow(bundle.settings);
}

function groupByCategory(items: any[]) {
  const out: Record<string, any[]> = { disenador: [], arabe: [], nicho: [] };
  items.forEach((p) => {
    if (!out[p.categoria]) out[p.categoria] = [];
    out[p.categoria].push(p);
  });
  return out;
}

export default function PublicApp() {
  const [bundle, setBundle] = useState<CatalogBundle | null>(null);
  const [cart, setCart] = useState<any[]>(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [route, setRoute] = useState<string>(getRoute);
  const [detail, setDetail] = useState<any>(null);
  const [comboDetail, setComboDetail] = useState<any>(null);

  // Cargar catalogo (Supabase con fallback)
  useEffect(() => {
    let alive = true;
    loadCatalog().then((b) => {
      if (!alive) return;
      installGlobals(b);
      setBundle(b);
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const openFromHash = () => {
      const pid = getHashParam("p");
      if (pid && (window as any).EMDINO_DATA) {
        const p = (window as any).EMDINO_DATA.PRODUCTS_BY_ID[pid];
        if (p) setDetail(p);
      }
    };
    const onHash = () => {
      const newRoute = getRoute();
      setRoute(newRoute);
      const h = (window.location.hash || "").replace(/^#/, "");
      const [base] = h.split("?");
      const isAnchor = base && newRoute === "home" && !getHashParam("p");
      if (isAnchor) {
        const scrollAttempt = (tries: number) => {
          const el = document.getElementById(base);
          if (el) {
            const targetY = el.getBoundingClientRect().top + window.scrollY - 12;
            window.scrollTo({ top: targetY, behavior: "smooth" });
            setTimeout(() => { if (Math.abs(window.scrollY - targetY) > 4) window.scrollTo(0, targetY); }, 700);
          } else if (tries > 0) setTimeout(() => scrollAttempt(tries - 1), 60);
          else window.scrollTo({ top: 0 });
        };
        requestAnimationFrame(() => setTimeout(() => scrollAttempt(8), 30));
      } else {
        window.scrollTo({ top: 0 });
      }
      openFromHash();
    };
    window.addEventListener("hashchange", onHash);
    openFromHash();
    return () => window.removeEventListener("hashchange", onHash);
  }, [bundle]);

  useEffect(() => {
    try { localStorage.setItem(CART_LS_KEY, JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    document.body.style.overflow = cartOpen || checkoutOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, checkoutOpen]);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal, .stagger"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    const safety = setTimeout(() => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add("in");
      });
    }, 1400);
    return () => { io.disconnect(); clearTimeout(safety); };
  }, [route, bundle]);

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout((showToast as any)._t);
    (showToast as any)._t = setTimeout(() => setToast(null), 2200);
  };

  const cartCount = cart.reduce((s, it) => s + it.qty, 0);

  const addProduct = (product: any, size: string, qty?: number) => {
    const addQty = Math.max(1, parseInt(String(qty), 10) || 1);
    const key = product.id + "::" + size;
    setCart((prev) => {
      const found = prev.find((it) => it.key === key);
      if (found) return prev.map((it) => it.key === key ? { ...it, qty: it.qty + addQty } : it);
      return [...prev, {
        key, type: "product", id: product.id, slug: product.slug || product.id,
        name: product.marca + " " + product.nombre,
        size, unitPrice: product.precios[size], qty: addQty,
      }];
    });
    showToast(product.nombre + " (" + size + ") × " + addQty + " agregado al carrito");
  };

  const addCombo = (combo: any, size?: string) => {
    const ml = size || (combo.precios && combo.precios["5ml"] ? "5ml" : Object.keys(combo.precios || {})[0]) || "";
    const unitPrice = (combo.precios && combo.precios[ml]) || combo.precioPromo;
    const key = "combo::" + combo.id + (ml ? "::" + ml : "");
    setCart((prev) => {
      const found = prev.find((it) => it.key === key);
      if (found) return prev.map((it) => it.key === key ? { ...it, qty: it.qty + 1 } : it);
      return [...prev, {
        key, type: "combo", id: combo.id, slug: combo.id, size: ml,
        name: "Combo " + combo.nombre,
        detail: (ml ? ml + " · " : "") + (combo.incluye || []).join(", "),
        unitPrice, qty: 1,
      }];
    });
    showToast("Combo " + combo.nombre + (ml ? " (" + ml + ")" : "") + " agregado al carrito");
  };

  const setQty = (key: string, qty: number) => {
    setCart((prev) => qty <= 0
      ? prev.filter((it) => it.key !== key)
      : prev.map((it) => it.key === key ? { ...it, qty } : it)
    );
  };
  const removeItem = (key: string) => setCart((prev) => prev.filter((it) => it.key !== key));
  const openCheckout = () => { if (cart.length === 0) return; setCartOpen(false); setCheckoutOpen(true); };

  // Checkout pasa por RPC si Supabase configurado, sino fallback a generar el mensaje localmente
  const onCheckoutConfirm = async (form: any) => {
    const total = cart.reduce((s, it) => s + it.unitPrice * it.qty, 0);
    if (supabaseConfigured) {
      try {
        const payload = {
          store_slug: STORE_SLUG,
          customer: {
            name: form.nombre, phone: form.telefono, document: form.documento,
            city: form.ciudad, address: form.direccion,
            delivery_method: form.entrega, notes: form.observacion,
          },
          items: cart.map((it) => it.type === "combo"
            ? { type: "combo", combo_slug: it.slug, variant_label: it.size, qty: it.qty }
            : { type: "product", product_slug: it.slug, variant_label: it.size, qty: it.qty }
          ),
        };
        const { data, error } = await emdino.rpc("create_public_order", { payload });
        if (error) throw error;
        const result = data as any;
        window.open(waLink(result.whatsapp_message), "_blank", "noopener");
        setCart([]);
        return;
      } catch (err) {
        console.warn("[checkout] RPC fallo, uso fallback:", err);
      }
    }
    // Fallback local
    const msg = waOrderMessage(form, cart, total);
    window.open(waLink(msg), "_blank", "noopener");
  };

  if (!bundle) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
        Cargando…
      </div>
    );
  }

  return (
    <>
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <main>
        {route === "catalog" ? (
          <ProductCatalog onAdd={addProduct} onOpenDetail={setDetail} />
        ) : route === "combos" ? (
          <ComboPage onAdd={addCombo} onOpenCombo={setComboDetail} />
        ) : (
          <>
            <Hero onOpenDetail={setDetail} />
            <BrandMarquee />
            <FeaturedUniverse />
            <SectionDivider />
            <ComboSection onAdd={addCombo} onOpenCombo={setComboDetail} />
            <SectionDivider />
            <HowItWorks />
            <SectionDivider />
            <ShippingSection />
          </>
        )}
      </main>
      <Footer />
      <WhatsAppFloatingButton />
      <CartDrawer
        open={cartOpen} items={cart}
        onClose={() => setCartOpen(false)}
        onQty={setQty} onRemove={removeItem}
        onCheckout={openCheckout}
      />
      <CheckoutModal
        open={checkoutOpen} items={cart}
        onClose={() => setCheckoutOpen(false)}
        onConfirm={onCheckoutConfirm}
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
      <ComboModal combo={comboDetail} onClose={() => setComboDetail(null)} onAdd={addCombo} />
      <Toast toast={toast} />
    </>
  );
}
