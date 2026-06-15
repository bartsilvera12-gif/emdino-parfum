import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { emdino } from "../../lib/supabase";
import { useAdminSession } from "../../lib/adminSession";

interface Category {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  sort_order: number;
  products_count?: number;
}

const empty = (): Partial<Category> => ({ name: "", slug: "", description: "", active: true, sort_order: 0 });
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminCategories() {
  const { profile } = useAdminSession();
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!profile) return;
    setLoading(true);
    const { data, error } = await emdino
      .from("perfume_categories")
      .select("id, store_id, name, slug, description, active, sort_order")
      .eq("store_id", profile.store_id)
      .order("sort_order", { ascending: true });
    if (error) { setError(error.message); setLoading(false); return; }
    const rows = (data as Category[]) || [];
    // Conteo de productos por categoria
    const counts: Record<string, number> = {};
    for (const row of rows) {
      const { count } = await emdino
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("category_id", row.id);
      counts[row.id] = count || 0;
    }
    setItems(rows.map((r) => ({ ...r, products_count: counts[r.id] || 0 })));
    setLoading(false);
  };

  useEffect(() => { load(); }, [profile]);

  const onSave = async () => {
    if (!profile || !editing) return;
    if (!editing.name?.trim()) { setError("El nombre es obligatorio"); return; }
    if (!editing.slug?.trim()) { setError("El slug es obligatorio"); return; }
    setSaving(true); setError(null);
    const payload: any = {
      store_id: profile.store_id,
      name: editing.name.trim(),
      slug: editing.slug.trim(),
      description: editing.description || null,
      active: editing.active !== false,
      sort_order: Number(editing.sort_order) || 0,
    };
    if (editing.id) payload.id = editing.id;
    const { error } = await emdino.from("perfume_categories").upsert(payload);
    setSaving(false);
    if (error) { setError(error.message); return; }
    setEditing(null);
    load();
  };

  const onDelete = async (c: Category) => {
    if ((c.products_count || 0) > 0) {
      alert("No se puede eliminar esta categoría porque tiene perfumes asociados.");
      return;
    }
    if (!confirm(`¿Eliminar la categoría "${c.name}"?`)) return;
    const { error } = await emdino.from("perfume_categories").delete().eq("id", c.id);
    if (error) { setError(error.message); return; }
    load();
  };

  return (
    <AdminLayout eyebrow="Catálogo" title="Categorías">
      {error && <div className="admin-alert error">{error}</div>}

      <div className="admin-toolbar">
        <button className="admin-btn primary" onClick={() => setEditing(empty())}>
          <Plus size={16} /> Nueva categoría
        </button>
      </div>

      {loading ? (
        <p className="admin-muted">Cargando…</p>
      ) : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Slug</th>
                <th className="num">Orden</th>
                <th className="num">Perfumes</th>
                <th>Activa</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td className="admin-muted">{c.slug}</td>
                  <td className="num">{c.sort_order}</td>
                  <td className="num">{c.products_count}</td>
                  <td>{c.active ? <span className="admin-pill ok">Sí</span> : <span className="admin-pill">No</span>}</td>
                  <td className="actions">
                    <button className="admin-icon-btn" onClick={() => setEditing(c)} aria-label="Editar"><Edit size={15} /></button>
                    <button className="admin-icon-btn danger" onClick={() => onDelete(c)} aria-label="Eliminar"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} className="admin-muted">Sin categorías. Creá la primera.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="admin-drawer-root open" onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <aside className="admin-drawer">
            <div className="admin-drawer-head">
              <h3>{editing.id ? "Editar categoría" : "Nueva categoría"}</h3>
              <button className="admin-icon-btn" onClick={() => setEditing(null)}><X size={18} /></button>
            </div>
            <div className="admin-drawer-body">
              <label className="admin-field">
                <span>Nombre *</span>
                <input
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })}
                />
              </label>
              <label className="admin-field">
                <span>Slug *</span>
                <input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} />
              </label>
              <label className="admin-field">
                <span>Descripción</span>
                <textarea rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </label>
              <label className="admin-field">
                <span>Orden</span>
                <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
              </label>
              <label className="admin-checkfield">
                <input type="checkbox" checked={editing.active !== false} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
                <span>Activa</span>
              </label>
            </div>
            <div className="admin-drawer-foot">
              <button className="admin-btn" onClick={() => setEditing(null)}>Cancelar</button>
              <button className="admin-btn primary" onClick={onSave} disabled={saving}>
                <Save size={16} /> {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </AdminLayout>
  );
}
