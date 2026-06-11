// EMDINO — Carrito (drawer lateral) + Checkout por WhatsApp
const { useState: useStateCart } = React;

const U = window.EMDINO_UTILS;

function cartItemImage(it) {
  if (it.type === "combo") {
    const combo = (window.EMDINO_COMBOS || []).find((c) => c.id === it.id);
    if (combo && combo.items && combo.items[0]) return "assets/perfumes-cut/" + combo.items[0] + ".png";
    return null;
  }
  const p = window.EMDINO_DATA && window.EMDINO_DATA.PRODUCTS_BY_ID[it.id];
  return p ? p.imagen : null;
}

function CartThumb({ it }) {
  const src = cartItemImage(it);
  const initials = (it.name || "").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className={"cart-item-thumb" + (it.type === "combo" ? " is-combo" : "")} aria-hidden="true">
      {src
        ? <img src={src} alt="" loading="lazy" />
        : <span className="cart-thumb-mono">{initials}</span>}
    </div>
  );
}

function QtyControl({ qty, onChange }) {
  return (
    <div className="qty" role="group" aria-label="Cantidad">
      <button onClick={() => onChange(qty - 1)} aria-label="Restar">−</button>
      <span>{qty}</span>
      <button onClick={() => onChange(qty + 1)} aria-label="Sumar">+</button>
    </div>
  );
}

function CartDrawer({ open, items, onClose, onQty, onRemove, onCheckout }) {
  const total = items.reduce((s, it) => s + it.unitPrice * it.qty, 0);
  const missing = U.FREE_SHIPPING_FROM - total;

  return (
    <div className={"drawer-root" + (open ? " open" : "")} aria-hidden={!open}>
      <div className="overlay" onClick={onClose}></div>
      <aside className="drawer" data-screen-label="Carrito" role="dialog" aria-label="Carrito">
        <div className="drawer-head">
          <h3 className="display">Tu carrito</h3>
          <button className="x-btn" onClick={onClose} aria-label="Cerrar carrito">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <p className="display empty-title">Está vacío</p>
            <p>Agregá decants o combos para armar tu pedido.</p>
            <button className="btn outline-dark sm" onClick={onClose}>Seguir comprando</button>
          </div>
        ) : (
          <React.Fragment>
            <div className="drawer-items thin-scroll">
              {items.map((it) => (
                <div className="cart-item" key={it.key}>
                  <CartThumb it={it} />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{it.name}</p>
                    <p className="cart-item-detail">
                      {it.type === "combo" ? it.detail : "Presentación " + it.size}
                    </p>
                    <p className="cart-item-unit">{U.formatGs(it.unitPrice)} c/u</p>
                  </div>
                  <div className="cart-item-side">
                    <QtyControl qty={it.qty} onChange={(q) => onQty(it.key, q)} />
                    <p className="cart-item-sub">{U.formatGs(it.unitPrice * it.qty)}</p>
                    <button className="rm-btn" onClick={() => onRemove(it.key)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-foot">
              {missing > 0 ? (
                <p className="ship-hint">
                  Te faltan <strong>{U.formatGs(missing)}</strong> para envío gratis
                </p>
              ) : (
                <p className="ship-hint ok">✓ Tu pedido tiene envío gratis</p>
              )}
              <div className="total-row">
                <span>Total</span>
                <span className="total-num">{U.formatGs(total)}</span>
              </div>
              <button className="btn yellow full" onClick={onCheckout}>
                Finalizar pedido por WhatsApp
              </button>
              <button className="btn outline-dark full" onClick={onClose}>
                Seguir comprando
              </button>
            </div>
          </React.Fragment>
        )}
      </aside>
    </div>
  );
}

// ---------- Checkout ----------
const EMPTY_FORM = {
  nombre: "",
  telefono: "",
  documento: "",
  ciudad: "",
  direccion: "",
  entrega: "retiro",
  observacion: "",
};

function CheckoutModal({ open, items, onClose }) {
  const [form, setForm] = useStateCart(EMPTY_FORM);
  const [errors, setErrors] = useStateCart({});
  const total = items.reduce((s, it) => s + it.unitPrice * it.qty, 0);

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: null });
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Ingresá tu nombre y apellido";
    if (!form.telefono.trim()) e.telefono = "Ingresá tu teléfono";
    if (!form.documento.trim()) e.documento = "Ingresá tu cédula o RUC para la factura";
    if (form.entrega === "envio") {
      if (!form.ciudad.trim()) e.ciudad = "Para envíos necesitamos tu ciudad";
      if (!form.direccion.trim()) e.direccion = "Indicá dirección o referencia";
    }
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0 || items.length === 0) return;
    const msg = U.waOrderMessage(form, items, total);
    window.open(U.waLink(msg), "_blank", "noopener");
  };

  if (!open) return null;

  return (
    <div className="modal-root open" data-screen-label="Checkout">
      <div className="overlay" onClick={onClose}></div>
      <div className="modal" role="dialog" aria-label="Finalizar pedido">
        <div className="drawer-head">
          <div>
            <p className="eyebrow">Último paso</p>
            <h3 className="display">Finalizar pedido</h3>
          </div>
          <button className="x-btn" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <form className="checkout-form" onSubmit={submit} noValidate={true}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="f-nombre">Nombre y apellido *</label>
              <input id="f-nombre" className={errors.nombre ? "invalid" : ""} value={form.nombre} onChange={set("nombre")} placeholder="Ej: María González" />
              {errors.nombre && <span className="err">{errors.nombre}</span>}
            </div>
            <div className="field">
              <label htmlFor="f-tel">Teléfono *</label>
              <input id="f-tel" className={errors.telefono ? "invalid" : ""} value={form.telefono} onChange={set("telefono")} placeholder="Ej: 0972 000 000" inputMode="tel" />
              {errors.telefono && <span className="err">{errors.telefono}</span>}
            </div>
          </div>

          <div className="field">
            <label htmlFor="f-doc">Cédula o RUC *</label>
            <input id="f-doc" className={errors.documento ? "invalid" : ""} value={form.documento} onChange={set("documento")} placeholder="Ej: 1.234.567 o 80012345-6" inputMode="text" />
            {errors.documento && <span className="err">{errors.documento}</span>}
          </div>

          <div className="field">
            <label>Método de entrega *</label>
            <div className="seg" role="radiogroup" aria-label="Método de entrega">
              <button type="button" role="radio" aria-checked={form.entrega === "retiro"} className={"seg-opt" + (form.entrega === "retiro" ? " active" : "")} onClick={() => setForm({ ...form, entrega: "retiro" })}>
                Retiro en Encarnación
              </button>
              <button type="button" role="radio" aria-checked={form.entrega === "envio"} className={"seg-opt" + (form.entrega === "envio" ? " active" : "")} onClick={() => setForm({ ...form, entrega: "envio" })}>
                Envío
              </button>
            </div>
          </div>

          {form.entrega === "envio" && (
            <div className="form-grid">
              <div className="field">
                <label htmlFor="f-ciudad">Ciudad *</label>
                <input id="f-ciudad" className={errors.ciudad ? "invalid" : ""} value={form.ciudad} onChange={set("ciudad")} placeholder="Ej: Asunción" />
                {errors.ciudad && <span className="err">{errors.ciudad}</span>}
              </div>
              <div className="field">
                <label htmlFor="f-dir">Dirección o referencia *</label>
                <input id="f-dir" className={errors.direccion ? "invalid" : ""} value={form.direccion} onChange={set("direccion")} placeholder="Calle, número o referencia" />
                {errors.direccion && <span className="err">{errors.direccion}</span>}
              </div>
            </div>
          )}

          <div className="field">
            <label htmlFor="f-obs">Observación (opcional)</label>
            <textarea id="f-obs" rows="2" value={form.observacion} onChange={set("observacion")} placeholder="Algo que debamos saber"></textarea>
          </div>

          <div className="checkout-summary">
            <p className="eyebrow">Resumen</p>
            {items.map((it) => (
              <div className="sum-row" key={it.key}>
                <span>{it.name}{it.type === "product" ? " · " + it.size : ""} × {it.qty}</span>
                <span>{U.formatGs(it.unitPrice * it.qty)}</span>
              </div>
            ))}
            <div className="sum-row total">
              <span>Total</span>
              <span>{U.formatGs(total)}</span>
            </div>
          </div>

          <button type="submit" className="btn yellow full">
            Enviar pedido por WhatsApp
          </button>
          <p className="checkout-note">
            Se abre WhatsApp con tu pedido armado. Nada se paga online: confirmamos
            disponibilidad y coordinamos con vos.
          </p>
        </form>
      </div>
    </div>
  );
}

Object.assign(window, { CartDrawer, CheckoutModal });
