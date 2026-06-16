// ============================================================
// EMDINO PERFUMERÍA — utilidades (WhatsApp + moneda)
// Exporta tanto ES modules como window.EMDINO_UTILS para compat
// con los componentes existentes que leen window globals.
// ============================================================

export const WHATSAPP_NUMBER_DEFAULT = "595972562362";
export const WHATSAPP_DISPLAY_DEFAULT = "0972 562 362";
export const INSTAGRAM_HANDLE_DEFAULT = "@emdinoo__";
export const INSTAGRAM_URL_DEFAULT = "https://instagram.com/emdinoo__";
export const FREE_SHIPPING_FROM_DEFAULT = 300000;

export function formatGs(n) {
  if (n == null || isNaN(n)) return "—";
  return "Gs. " + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function waLink(text, numberOverride) {
  const number =
    (typeof window !== "undefined" && window.EMDINO_UTILS && window.EMDINO_UTILS.WHATSAPP_NUMBER) ||
    numberOverride ||
    WHATSAPP_NUMBER_DEFAULT;
  return "https://wa.me/" + number + "?text=" + encodeURIComponent(text);
}

export function waProductMessage(nombre, ml) {
  return (
    "Hola, quiero consultar por el decant de " + nombre + " en presentación de " + ml + "."
  );
}

export function waComboMessage(nombreCombo, ml) {
  return ml
    ? "Hola, quiero consultar por el combo " + nombreCombo + " en presentación de " + ml + "."
    : "Hola, quiero consultar por el combo " + nombreCombo + ".";
}

export function waOrderMessage(form, items, total) {
  const lines = [];
  lines.push("Hola, quiero realizar este pedido en Emdino Perfumería:");
  lines.push("");
  lines.push("DATOS DEL CLIENTE");
  lines.push("Nombre: " + (form.nombre || "—"));
  lines.push("Teléfono: " + (form.telefono || "—"));
  lines.push("Cédula: " + (form.documento || "—"));
  lines.push("Entrega: " + (form.entrega === "envio" ? "Envío" : "Retiro en Encarnación"));
  if (form.entrega === "envio") {
    lines.push("Ciudad: " + (form.ciudad || "—"));
    lines.push("Dirección/Referencia: " + (form.direccion || "—"));
  }
  if (form.observacion && form.observacion.trim()) {
    lines.push("Observación: " + form.observacion.trim());
  }
  lines.push("");
  lines.push("PEDIDO");
  lines.push("");
  items.forEach((it, i) => {
    const idx = i + 1;
    const subtotal = it.unitPrice * it.qty;
    if (it.type === "combo") {
      lines.push(idx + ". " + it.name);
      if (it.detail) lines.push("   Detalle: " + it.detail);
      lines.push("   Cantidad: " + it.qty);
      lines.push("   Precio unitario: " + formatGs(it.unitPrice));
      lines.push("   Subtotal: " + formatGs(subtotal));
    } else {
      lines.push(idx + ". " + it.name);
      lines.push("   Presentación: " + it.size);
      lines.push("   Cantidad: " + it.qty);
      lines.push("   Precio unitario: " + formatGs(it.unitPrice));
      lines.push("   Subtotal: " + formatGs(subtotal));
    }
    lines.push("");
  });
  lines.push("TOTAL: " + formatGs(total));
  lines.push("");
  lines.push("Quedo atento/a para confirmar disponibilidad.");
  return lines.join("\n");
}

// Setea defaults en window. PublicApp lo sobreescribe con los settings cargados desde Supabase.
export function installUtilsOnWindow(overrides = {}) {
  if (typeof window === "undefined") return;
  window.EMDINO_UTILS = {
    WHATSAPP_NUMBER: overrides.whatsapp_number || WHATSAPP_NUMBER_DEFAULT,
    WHATSAPP_DISPLAY: overrides.whatsapp_display || WHATSAPP_DISPLAY_DEFAULT,
    INSTAGRAM_HANDLE: overrides.instagram_handle || INSTAGRAM_HANDLE_DEFAULT,
    INSTAGRAM_URL: overrides.instagram_url || INSTAGRAM_URL_DEFAULT,
    FREE_SHIPPING_FROM: overrides.free_shipping_from || FREE_SHIPPING_FROM_DEFAULT,
    formatGs,
    waLink,
    waProductMessage,
    waComboMessage,
    waOrderMessage,
  };
}

// Instalar defaults al importar para que cualquier componente que lea window.EMDINO_UTILS
// antes del primer render obtenga al menos los defaults.
installUtilsOnWindow();
