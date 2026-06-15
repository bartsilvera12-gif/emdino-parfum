import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Boxes, Tags, ShoppingBag, AlertTriangle, TrendingDown, User } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { emdino } from "../../lib/supabase";
import { useAdminSession } from "../../lib/adminSession";
import { formatGs } from "../../utils/helpers";

interface Stats {
  totalProducts: number;
  activeProducts: number;
  masculino: number;
  femenino: number;
  categories: number;
  variants: number;
  totalStock: number;
  sinStock: number;
  stockBajo: number;
  pedidosMes: number;
  pedidosNuevos: number;
}

interface RecentOrder {
  id: string;
  customer_name: string | null;
  total: number | null;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { profile } = useAdminSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentOrder[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    let alive = true;
    (async () => {
      try {
        const storeId = profile.store_id;
        const [
          { data: products }, { data: categories }, { data: variants },
          { data: orders }, { data: recentOrders },
        ] = await Promise.all([
          emdino.from("products").select("id, gender, active").eq("store_id", storeId),
          emdino.from("perfume_categories").select("id, active").eq("store_id", storeId),
          emdino.from("product_variants").select("id, stock, stock_minimum, active, label, product_id").eq("store_id", storeId),
          emdino.from("orders").select("id, status, created_at").eq("store_id", storeId).gte(
            "created_at",
            new Date(new Date().setDate(1)).toISOString()
          ),
          emdino.from("orders").select("id, customer_name, total, status, created_at").eq("store_id", storeId).order("created_at", { ascending: false }).limit(8),
        ]);
        if (!alive) return;

        const pl = (products || []) as any[];
        const vl = (variants || []) as any[];
        const ol = (orders || []) as any[];
        const cats = (categories || []) as any[];
        const sinStock = vl.filter((v) => v.active && (v.stock || 0) <= 0).length;
        const stockBajo = vl.filter((v) => v.active && (v.stock || 0) > 0 && (v.stock || 0) <= (v.stock_minimum || 0)).length;
        setStats({
          totalProducts: pl.length,
          activeProducts: pl.filter((p) => p.active).length,
          masculino: pl.filter((p) => p.gender === "masculino" && p.active).length,
          femenino: pl.filter((p) => p.gender === "femenino" && p.active).length,
          categories: cats.filter((c) => c.active).length,
          variants: vl.filter((v) => v.active).length,
          totalStock: vl.reduce((s, v) => s + (v.stock || 0), 0),
          sinStock,
          stockBajo,
          pedidosMes: ol.length,
          pedidosNuevos: ol.filter((o) => o.status === "nuevo").length,
        });
        setRecent(((recentOrders || []) as any[]).map((r) => ({
          id: r.id, customer_name: r.customer_name, total: r.total, status: r.status, created_at: r.created_at,
        })));

        // Productos con stock bajo (top 10)
        const lowVariants = vl
          .filter((v) => v.active && (v.stock || 0) > 0 && (v.stock || 0) <= (v.stock_minimum || 0))
          .slice(0, 10);
        if (lowVariants.length > 0) {
          const productIds = [...new Set(lowVariants.map((v) => v.product_id))];
          const { data: prods } = await emdino
            .from("products")
            .select("id, name, brand")
            .in("id", productIds);
          const byId = new Map(((prods as any[]) || []).map((p) => [p.id, p]));
          setLowStock(lowVariants.map((v) => ({
            ...v,
            product: byId.get(v.product_id),
          })));
        }
      } catch (e: any) {
        if (alive) setError(e.message || "Error cargando dashboard");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [profile]);

  return (
    <AdminLayout eyebrow="Resumen operativo" title="Dashboard">
      {error && <div className="admin-alert error">{error}</div>}

      <section className="admin-kpi-grid">
        <KPI icon={Package} label="Perfumes activos" value={stats?.activeProducts ?? "…"} sub={`${stats?.masculino ?? 0} masc · ${stats?.femenino ?? 0} fem`} />
        <KPI icon={Tags} label="Categorías" value={stats?.categories ?? "…"} sub="Activas" />
        <KPI icon={Boxes} label="Presentaciones" value={stats?.variants ?? "…"} sub="Variantes activas" />
        <KPI icon={ShoppingBag} label="Pedidos del mes" value={stats?.pedidosMes ?? "…"} sub={`${stats?.pedidosNuevos ?? 0} nuevos`} link="/admin/pedidos" />
      </section>

      <section className="admin-kpi-grid small">
        <KPI small icon={TrendingDown} label="Stock total" value={stats?.totalStock?.toLocaleString("es-PY") ?? "…"} sub="Unidades en variantes" />
        <KPI small icon={AlertTriangle} label="Sin stock" value={stats?.sinStock ?? "…"} sub="Variantes en 0" emphasize={(stats?.sinStock ?? 0) > 0} />
        <KPI small icon={AlertTriangle} label="Stock bajo" value={stats?.stockBajo ?? "…"} sub="Por debajo del mínimo" emphasize={(stats?.stockBajo ?? 0) > 0} />
      </section>

      <section className="admin-two-cols">
        <div className="admin-card">
          <div className="admin-card-head">
            <h3>Últimos pedidos</h3>
            <Link to="/admin/pedidos" className="admin-link">Ver todos →</Link>
          </div>
          {loading ? (
            <p className="admin-muted">Cargando…</p>
          ) : recent.length === 0 ? (
            <p className="admin-muted">Sin pedidos todavía.</p>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Cliente</th><th>Estado</th><th className="num">Total</th><th>Fecha</th></tr></thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id}>
                    <td><Link to={`/admin/pedidos`} className="admin-link">{o.customer_name || "—"}</Link></td>
                    <td><span className={"admin-pill st-" + o.status}>{o.status}</span></td>
                    <td className="num">{formatGs(o.total || 0)}</td>
                    <td className="admin-muted">{new Date(o.created_at).toLocaleDateString("es-PY")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-head">
            <h3>Alertas de reposición</h3>
            <Link to="/admin/productos" className="admin-link">Ver inventario →</Link>
          </div>
          {loading ? (
            <p className="admin-muted">Cargando…</p>
          ) : lowStock.length === 0 ? (
            <p className="admin-muted">Sin alertas. Todo el stock está por encima del mínimo.</p>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Producto</th><th>Pres.</th><th className="num">Stock</th><th className="num">Mín.</th></tr></thead>
              <tbody>
                {lowStock.map((v) => (
                  <tr key={v.id}>
                    <td>{v.product ? `${v.product.brand} ${v.product.name}` : "—"}</td>
                    <td className="admin-muted">{v.label}</td>
                    <td className="num warn">{v.stock}</td>
                    <td className="num admin-muted">{v.stock_minimum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}

function KPI({ icon: Icon, label, value, sub, small, emphasize, link }: {
  icon: any; label: string; value: any; sub: string; small?: boolean; emphasize?: boolean; link?: string;
}) {
  const inner = (
    <div className={"admin-kpi" + (small ? " small" : "") + (emphasize ? " emphasize" : "")}>
      <div className="admin-kpi-head">
        <Icon size={small ? 15 : 17} className="admin-kpi-icon" />
        <span className="admin-kpi-label">{label}</span>
      </div>
      <p className="admin-kpi-value">{value}</p>
      <p className="admin-kpi-sub">{sub}</p>
    </div>
  );
  return link ? <Link to={link} className="admin-kpi-link">{inner}</Link> : inner;
}
