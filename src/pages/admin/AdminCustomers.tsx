import React, { useEffect, useMemo, useState } from "react";
import { Search, MessageCircle } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { emdino } from "../../lib/supabase";
import { useAdminSession } from "../../lib/adminSession";
import { formatGs, waLink } from "../../utils/helpers";

interface Customer {
  name: string;
  phone: string;
  city: string | null;
  lastOrderAt: string;
  orderCount: number;
  totalGs: number;
}

export default function AdminCustomers() {
  const { profile } = useAdminSession();
  const [items, setItems] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!profile) return;
    (async () => {
      setLoading(true);
      const { data } = await emdino
        .from("orders")
        .select("customer_name, customer_phone, city, total, created_at")
        .eq("store_id", profile.store_id)
        .order("created_at", { ascending: false });
      const grouped = new Map<string, Customer>();
      ((data as any[]) || []).forEach((o) => {
        const key = (o.customer_phone || o.customer_name || "").trim().toLowerCase();
        if (!key) return;
        const existing = grouped.get(key);
        if (existing) {
          existing.orderCount += 1;
          existing.totalGs += Number(o.total) || 0;
          if (new Date(o.created_at) > new Date(existing.lastOrderAt)) existing.lastOrderAt = o.created_at;
        } else {
          grouped.set(key, {
            name: o.customer_name || "—",
            phone: o.customer_phone || "—",
            city: o.city || null,
            lastOrderAt: o.created_at,
            orderCount: 1,
            totalGs: Number(o.total) || 0,
          });
        }
      });
      setItems(Array.from(grouped.values()).sort((a, b) => b.totalGs - a.totalGs));
      setLoading(false);
    })();
  }, [profile]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) => (c.name + " " + c.phone + " " + (c.city || "")).toLowerCase().includes(q));
  }, [items, search]);

  return (
    <AdminLayout eyebrow="CRM" title="Clientes">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={15} />
          <input placeholder="Buscar por nombre, teléfono o ciudad…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      {loading ? <p className="admin-muted">Cargando…</p> : (
        <div className="admin-card">
          <p className="admin-muted small">{filtered.length} {filtered.length === 1 ? "cliente" : "clientes"}</p>
          <table className="admin-table">
            <thead><tr><th>Cliente</th><th>Tel</th><th>Ciudad</th><th>Último pedido</th><th className="num">Pedidos</th><th className="num">Total acumulado</th><th></th></tr></thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i}>
                  <td><strong>{c.name}</strong></td>
                  <td className="admin-muted">{c.phone}</td>
                  <td className="admin-muted">{c.city || "—"}</td>
                  <td className="admin-muted">{new Date(c.lastOrderAt).toLocaleDateString("es-PY")}</td>
                  <td className="num">{c.orderCount}</td>
                  <td className="num">{formatGs(c.totalGs)}</td>
                  <td className="actions">
                    {c.phone && c.phone !== "—" && (
                      <a className="admin-icon-btn" target="_blank" rel="noopener" href={waLink("Hola " + c.name + ", te escribimos de Emdino Perfumería.", c.phone.replace(/\D/g, ""))} aria-label="WhatsApp">
                        <MessageCircle size={15} />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="admin-muted">Sin clientes todavía.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
