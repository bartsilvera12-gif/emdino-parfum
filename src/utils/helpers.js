// ============================================================
// EMDINO PERFUMERÍA — utilidades (WhatsApp + moneda)
// ============================================================

const WHATSAPP_NUMBER = "595972562362"; // visible: 0972 562 362
const WHATSAPP_DISPLAY = "0972 562 362";
const INSTAGRAM_HANDLE = "@emdinoo__";
const INSTAGRAM_URL = "https://instagram.com/emdinoo__";
const FREE_SHIPPING_FROM = 300000; // Gs.

// "Gs. 1.250.000"
function formatGs(n) {
  if (n == null || isNaN(n)) return "—";
  return "Gs. " + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function waLink(text) {
  return (
    "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text)
  );
}

// Mensaje para consultar un producto individual
function waProductMessage(nombre, ml) {
  return (
    "Hola, quiero consultar por el decant de " +
    nombre +
    " en presentación de " +
    ml +
    "."
  );
}

// Mensaje para consultar un combo
function waComboMessage(nombreCombo) {
  return "Hola, quiero consultar por el combo " + nombreCombo + ".";
}

// Mensaje de pedido completo (checkout)
function waOrderMessage(form, items, total) {
  const lines = [];
  lines.push("Hola, quiero realizar este pedido en Emdino Perfumería:");
  lines.push("");
  lines.push("DATOS DEL CLIENTE");
  lines.push("Nombre: " + (form.nombre || "—"));
  lines.push("Teléfono: " + (form.telefono || "—"));
  lines.push("Cédula/RUC: " + (form.documento || "—"));
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

window.EMDINO_UTILS = {
  WHATSAPP_NUMBER,
  WHATSAPP_DISPLAY,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  FREE_SHIPPING_FROM,
  formatGs,
  waLink,
  waProductMessage,
  waComboMessage,
  waOrderMessage,
};
