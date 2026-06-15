import React, { useEffect, useState } from "react";
import { Eye, Copy, MessageCircle, Trash2, X } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { emdino } from "../../lib/supabase";
import { useAdminSession } from "../../lib/adminSession";
import { formatGs, waLink } from "../../utils/helpers";

interface Order {
  id: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_document: string | null;
  city: string | null;
  address: string | null;
  delivery_method: string | null;
  notes: string | null;
  status: string;
  total: number;
  whatsapp_message: string | null;
  created_at: string;
}
interface OrderItem {
  id: string;
  item_type: string;
  name: string | null;
  variant_label: string | null;
  qty: number;
  unit_price: number;
  subtotal: number;
}

const STATUSES = ["nuevo", "contactado", "confirmado", "preparado", "entregado", "cancelado"];

export default function AdminOrders() {
  const { profile } = useAdminSession();
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<Order | null>(null);
  const [openItems, setOpenItems] = useState<OrderItem[]>([]);

  const load = async () => {
    if (!profile) return;
    setLoading(true);
    let q = emdino.from("orders").select("*").eq("store_id", profile.store_id).order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setItems((data as Order[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [profile, filter]);

  const openDetail = async (o: Order) => {
    setOpen(o);
    const { data } = await emdino.from("order_items").select("*").eq("order_id", o.id).order("created_at");
    setOpenItems((data as OrderItem[]) || []);
  };

  const changeStatus = async (o: Order, status: string) => {
    await emdino.from("orders").update({ status }).eq("id", o.id);
    if (open && open.id === o.id) setOpen({ ...o, status });
    load();
  };

  const deleteOrder = async (o: Order) => {
    if (!confirm(`¿Eliminar el pedido de ${o.customer_name || "—"}? Esta acción no se puede deshacer.`)) return;
    await emdino.from("orders").delete().eq("id", o.id);
    setOpen(null);
    load();
  };

  const copyMessage = (o: Order) => {
    if (!o.whatsapp_message) return;
    navigator.clipboard.writeText(o.whatsapp_message);
    alert("Mensaje copiado");
  };

  return (
    <AdminLayout eyebrow="Operaciones" title="Pedidos">
      <div className="admin-toolbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="admin-select">
          <option value="all">Todos</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <p className="admin-muted">Cargando…</p> : (
        <div className="admin-card">
          <table className="admin-table">
            <thead><tr><th>Cliente</th><th>Tel</th><th>Entrega</th><th>Estado</th><th className="num">Total</th><th>Fecha</th><th></th></tr></thead>
            <tbody>
              {items.map((o) => (
                <tr key={o.id}>
                  <td><strong>{o.customer_name || "—"}</strong><div className="admin-muted xsmall">{o.customer_document || ""}</div></td>
                  <td className="admin-muted">{o.customer_phone || "—"}</td>
                  <td className="admin-muted">{o.delivery_method === "envio" ? `Envío · ${o.city || ""}` : "Retiro"}</td>
                  <td>
                    <select value={o.status} onChange={(e) => changeStatus(o, e.target.value)} className={"admin-select small st-" + o.status}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="num">{formatGs(o.total)}</td>
                  <td className="admin-muted">{new Date(o.created_at).toLocaleDateString("es-PY")}</td>
                  <td className="actions">
                    <button className="admin-icon-btn" onClick={() => openDetail(o)} aria-label="Ver"><Eye size={15} /></button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={7} className="admin-muted">Sin pedidos.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="admin-drawer-root open" onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
          <aside className="admin-drawer">
            <div className="admin-drawer-head">
              <h3>Pedido</h3>
              <button className="admin-icon-btn" onClick={() => setOpen(null)}><X size={18} /></button>
            </div>
            <div className="admin-drawer-body">
              <div className="admin-card-inner">
                <p><strong>{open.customer_name}</strong></p>
                <p className="admin-muted">{open.customer_phone}</p>
                {open.customer_document && <p className="admin-muted">Cédula: {open.customer_document}</p>}
                <p className="admin-muted">Entrega: {open.delivery_method === "envio" ? "Envío" : "Retiro en Encarnación"}</p>
                {open.city && <p className="admin-muted">Ciudad: {open.city}</p>}
                {open.address && <p className="admin-muted">Dirección: {open.address}</p>}
                {open.notes && <p className="admin-muted">Obs: {open.notes}</p>}
              </div>

              <h4>Items</h4>
              <table className="admin-table small">
                <thead><tr><th>Producto</th><th>Pres.</th><th className="num">Qty</th><th className="num">Unit</th><th className="num">Subtotal</th></tr></thead>
                <tbody>
                  {openItems.map((it) => (
                    <tr key={it.id}>
                      <td>{it.name}</td>
                      <td className="admin-muted">{it.variant_label || (it.item_type === "combo" ? "Combo" : "—")}</td>
                      <td className="num">{it.qty}</td>
                      <td className="num">{formatGs(it.unit_price)}</td>
                      <td className="num">{formatGs(it.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr><td colSpan={4} className="num"><strong>Total</strong></td><td className="num"><strong>{formatGs(open.total)}</strong></td></tr></tfoot>
              </table>

              {open.whatsapp_message && (
                <div className="admin-block">
                  <div className="admin-block-head"><h4>Mensaje de WhatsApp</h4></div>
                  <pre className="admin-pre">{open.whatsapp_message}</pre>
                </div>
              )}
            </div>
            <div className="admin-drawer-foot wrap">
              <button className="admin-btn" onClick={() => copyMessage(open)}><Copy size={15} /> Copiar mensaje</button>
              {open.customer_phone && (
                <a className="admin-btn primary" target="_blank" rel="noopener" href={waLink(open.whatsapp_message || "Hola!", open.customer_phone.replace(/\D/g, ""))}>
                  <MessageCircle size={15} /> Abrir WhatsApp
                </a>
              )}
              <button className="admin-btn danger" onClick={() => deleteOrder(open)}><Trash2 size={15} /> Eliminar</button>
            </div>
          </aside>
        </div>
      )}
    </AdminLayout>
  );
}
