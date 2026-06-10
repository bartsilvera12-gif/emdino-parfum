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
  lines.push("Cliente: " + form.nombre);
  lines.push("Teléfono: " + form.telefono);
  if (form.ciudad) lines.push("Ciudad: " + form.ciudad);
  lines.push("Entrega: " + (form.entrega === "envio" ? "Envío" : "Retiro en Encarnación"));
  if (form.direccion) lines.push("Dirección/Referencia: " + form.direccion);
  if (form.observacion) lines.push("Observación: " + form.observacion);
  lines.push("");
  lines.push("Productos:");
  items.forEach((it, i) => {
    const desc =
      it.type === "combo"
        ? it.name
        : it.name + " - " + it.size;
    lines.push(
      (i + 1) + ". " + desc + " x " + it.qty + " - " + formatGs(it.unitPrice * it.qty)
    );
  });
  lines.push("");
  lines.push("Total: " + formatGs(total));
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
