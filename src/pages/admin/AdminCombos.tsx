import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Save, X, ArrowUp, ArrowDown } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { emdino } from "../../lib/supabase";
import { useAdminSession } from "../../lib/adminSession";
import { formatGs } from "../../utils/helpers";

interface ComboItem { product_id: string; sort_order: number; _new?: boolean; }
interface ComboVariant { label: string; price: number; compare_at_price: number | null; }
interface Combo {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  tagline: string | null;
  presentation: string | null;
  normal_price: number;
  promo_price: number;
  featured: boolean;
  active: boolean;
  sort_order: number;
  image_url: string | null;
  items?: ComboItem[];
  variants?: ComboVariant[];
}
interface ProductMini { id: string; name: string; brand: string; main_image_url?: string | null; }

const VARIANT_LABELS = ["3ml", "5ml", "10ml"];
const emptyVariants = (): ComboVariant[] => VARIANT_LABELS.map((l) => ({ label: l, price: 0, compare_at_price: null }));
// Devuelve siempre las 3 presentaciones, completando las que falten
const normalizeVariants = (vs: ComboVariant[]): ComboVariant[] =>
  VARIANT_LABELS.map((l) => vs.find((v) => v.label === l) || { label: l, price: 0, compare_at_price: null });

const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const emptyCombo = (): Partial<Combo> => ({ name: "", slug: "", tagline: "", presentation: "", normal_price: 0, promo_price: 0, featured: false, active: true, sort_order: 0, image_url: "" });

export default function AdminCombos() {
  const { profile } = useAdminSession();
  const [items, setItems] = useState<Combo[]>([]);
  const [products, setProducts] = useState<ProductMini[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<Combo> | null>(null);
  const [editingItems, setEditingItems] = useState<ComboItem[]>([]);
  const [editingVariants, setEditingVariants] = useState<ComboVariant[]>([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!profile) return;
    setLoading(true);
    const [{ data: cs }, { data: ps }] = await Promise.all([
      emdino.from("combos").select(`*, combo_items ( product_id, sort_order ), combo_variants ( label, price, compare_at_price, sort_order )`).eq("store_id", profile.store_id).order("sort_order"),
      emdino.from("products").select("id, name, brand, main_image_url").eq("store_id", profile.store_id).order("brand"),
    ]);
    setItems(((cs as any[]) || []).map((c) => ({ ...c, items: c.combo_items || [], variants: c.combo_variants || [] })));
    setProducts((ps as ProductMini[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [profile]);

  const openNew = () => { setEditing(emptyCombo()); setEditingItems([]); setEditingVariants(emptyVariants()); };
  const openEdit = (c: Combo) => {
    setEditing({ ...c });
    setEditingItems((c.items || []).slice().sort((a, b) => a.sort_order - b.sort_order));
    setEditingVariants(normalizeVariants((c.variants || []).map((v) => ({ label: v.label, price: Number(v.price) || 0, compare_at_price: v.compare_at_price != null ? Number(v.compare_at_price) : null }))));
  };

  const setVariant = (label: string, field: "price" | "compare_at_price", value: string) => {
    const num = value === "" ? (field === "compare_at_price" ? null : 0) : Number(value);
    setEditingVariants((prev) => prev.map((v) => v.label === label ? { ...v, [field]: num } : v));
  };

  const onSave = async () => {
    if (!profile || !editing) return;
    if (!editing.name?.trim()) { setError("Nombre requerido"); return; }
    if (!editing.slug?.trim()) { setError("Slug requerido"); return; }
    setSaving(true); setError(null);
    // precio de referencia (badge/orden) = 5ml; fallback al primer tamaño con precio
    const ref = editingVariants.find((v) => v.label === "5ml" && v.price > 0)
      || editingVariants.find((v) => v.price > 0)
      || { price: Number(editing.promo_price) || 0, compare_at_price: null };
    const payload: any = {
      store_id: profile.store_id,
      name: editing.name.trim(),
      slug: editing.slug.trim(),
      tagline: editing.tagline || null,
      presentation: editing.presentation || null,
      promo_price: ref.price || 0,
      normal_price: ref.compare_at_price || ref.price || 0,
      featured: !!editing.featured,
      active: editing.active !== false,
      sort_order: Number(editing.sort_order) || 0,
      image_url: editing.image_url || null,
    };
    if (editing.id) payload.id = editing.id;
    const { data: up, error } = await emdino.from("combos").upsert(payload, { onConflict: "store_id,slug" }).select("id").single();
    if (error) { setError(error.message); setSaving(false); return; }
    const comboId = (up as any).id as string;
    // Reemplazar items
    await emdino.from("combo_items").delete().eq("combo_id", comboId);
    if (editingItems.length > 0) {
      const inserts = editingItems.map((it, i) => ({
        store_id: profile.store_id,
        combo_id: comboId,
        product_id: it.product_id,
        sort_order: i + 1,
      }));
      const { error: itErr } = await emdino.from("combo_items").insert(inserts);
      if (itErr) console.warn("combo_items err:", itErr);
    }
    // Reemplazar variantes (precios por tamaño) — solo las que tienen precio > 0
    await emdino.from("combo_variants").delete().eq("combo_id", comboId);
    const varInserts = editingVariants
      .filter((v) => v.price > 0)
      .map((v, i) => ({
        store_id: profile.store_id,
        combo_id: comboId,
        label: v.label,
        price: v.price,
        compare_at_price: v.compare_at_price && v.compare_at_price > 0 ? v.compare_at_price : null,
        sort_order: (i + 1) * 10,
        active: true,
      }));
    if (varInserts.length > 0) {
      const { error: vErr } = await emdino.from("combo_variants").insert(varInserts);
      if (vErr) console.warn("combo_variants err:", vErr);
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const onDelete = async (c: Combo) => {
    if (!confirm(`¿Eliminar el combo "${c.name}"?`)) return;
    await emdino.from("combos").delete().eq("id", c.id);
    load();
  };

  const move = (idx: number, dir: -1 | 1) => {
    setEditingItems((prev) => {
      const next = [...prev];
      const t = next[idx + dir];
      if (!t) return prev;
      next[idx + dir] = next[idx];
      next[idx] = t;
      return next;
    });
  };

  return (
    <AdminLayout eyebrow="Promos" title="Combos">
      {error && <div className="admin-alert error">{error}</div>}
      <div className="admin-toolbar">
        <button className="admin-btn primary" onClick={openNew}><Plus size={16} /> Nuevo combo</button>
      </div>
      {loading ? <p className="admin-muted">Cargando…</p> : (
        <div className="admin-card">
          <table className="admin-table">
            <thead><tr><th>Combo</th><th className="num">Items</th><th className="num">Precios 3/5/10ml</th><th>Destacado</th><th>Activo</th><th></th></tr></thead>
            <tbody>
              {items.map((c) => {
                const firstItem = (c.items || []).slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0];
                const firstProduct = firstItem ? products.find((p) => p.id === firstItem.product_id) : null;
                const thumbUrl = c.image_url || firstProduct?.main_image_url || null;
                const initials = c.name.slice(0, 2).toUpperCase();
                return (
                <tr key={c.id}>
                  <td>
                    <div className="admin-product-cell">
                      <div className="admin-product-thumb" aria-hidden="true">
                        {thumbUrl ? (
                          <img
                            src={thumbUrl}
                            alt=""
                            loading="lazy"
                            onError={(e) => {
                              const img = e.currentTarget;
                              img.style.display = "none";
                              const ph = img.nextElementSibling as HTMLElement | null;
                              if (ph) ph.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <span className="admin-product-thumb-ph" style={{ display: thumbUrl ? "none" : "flex" }}>{initials}</span>
                      </div>
                      <div>
                        <strong>{c.name}</strong>
                        <div className="admin-muted xsmall">{c.tagline}</div>
                      </div>
                    </div>
                  </td>
                  <td className="num">{c.items?.length || 0}</td>
                  <td className="num">
                    {(() => {
                      const vs = c.variants || [];
                      const byLabel = (l: string) => vs.find((v) => v.label === l);
                      const cells = VARIANT_LABELS.map((l) => byLabel(l)).filter(Boolean) as ComboVariant[];
                      if (!cells.length) return formatGs(c.promo_price);
                      return VARIANT_LABELS.map((l) => { const v = byLabel(l); return v ? formatGs(v.price) : "—"; }).join(" / ");
                    })()}
                  </td>
                  <td>{c.featured ? "★" : "—"}</td>
                  <td>{c.active ? <span className="admin-pill ok">Sí</span> : <span className="admin-pill">No</span>}</td>
                  <td className="actions">
                    <button className="admin-icon-btn" onClick={() => openEdit(c)}><Edit size={15} /></button>
                    <button className="admin-icon-btn danger" onClick={() => onDelete(c)}><Trash2 size={15} /></button>
                  </td>
                </tr>
                );
              })}
              {items.length === 0 && <tr><td colSpan={6} className="admin-muted">Sin combos.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="admin-drawer-root open" onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <aside className="admin-drawer wide">
            <div className="admin-drawer-head">
              <h3>{editing.id ? "Editar combo" : "Nuevo combo"}</h3>
              <button className="admin-icon-btn" onClick={() => setEditing(null)}><X size={18} /></button>
            </div>
            <div className="admin-drawer-body">
              <div className="admin-grid-2">
                <label className="admin-field"><span>Nombre *</span>
                  <input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : slugify(`combo-${e.target.value}`) })} />
                </label>
                <label className="admin-field"><span>Slug *</span>
                  <input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} />
                </label>
                <label className="admin-field"><span>Tagline</span>
                  <input value={editing.tagline || ""} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} />
                </label>
                <label className="admin-field"><span>Presentación</span>
                  <input value={editing.presentation || ""} placeholder="3 fragancias · elegí tu tamaño" onChange={(e) => setEditing({ ...editing, presentation: e.target.value })} />
                </label>
                <label className="admin-field"><span>Orden</span>
                  <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
                </label>
              </div>

              <div className="admin-block">
                <div className="admin-block-head">
                  <h4>Precios por tamaño</h4>
                </div>
                <div className="admin-variant-header" aria-hidden="true">
                  <span className="vh-label">Tamaño</span>
                  <span className="vh-col">Precio</span>
                  <span className="vh-col">Precio tachado <small>(opcional)</small></span>
                </div>
                <div className="admin-variants">
                  {editingVariants.map((v) => (
                    <div key={v.label} className="admin-variant-row tight">
                      <span className="vh-label" style={{ flex: "0 0 64px", fontWeight: 600 }}>{v.label}</span>
                      <input type="number" placeholder="0" value={v.price || ""} onChange={(e) => setVariant(v.label, "price", e.target.value)} />
                      <input type="number" placeholder="—" value={v.compare_at_price ?? ""} onChange={(e) => setVariant(v.label, "compare_at_price", e.target.value)} />
                    </div>
                  ))}
                </div>
                <p className="admin-muted small">Dejá un tamaño en 0 para ocultarlo. El “precio tachado” muestra el descuento; dejalo vacío si no hay promo.</p>
              </div>
              <label className="admin-field">
                <span>URL de imagen (opcional)</span>
                <input value={editing.image_url || ""} placeholder="https://…" onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} />
              </label>
              <div className="admin-checkrow">
                <label className="admin-checkfield"><input type="checkbox" checked={editing.active !== false} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /><span>Activo</span></label>
                <label className="admin-checkfield"><input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /><span>Destacado</span></label>
              </div>

              <div className="admin-block">
                <div className="admin-block-head">
                  <h4>Perfumes incluidos</h4>
                  <select className="admin-select" onChange={(e) => {
                    if (!e.target.value) return;
                    setEditingItems((prev) => [...prev, { product_id: e.target.value, sort_order: prev.length + 1, _new: true }]);
                    e.target.value = "";
                  }}>
                    <option value="">+ Agregar perfume…</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.brand} {p.name}</option>)}
                  </select>
                </div>
                <div className="admin-variants">
                  {editingItems.map((it, idx) => {
                    const p = products.find((pp) => pp.id === it.product_id);
                    return (
                      <div key={idx} className="admin-variant-row tight">
                        <span style={{ flex: 1 }}>{p ? `${p.brand} ${p.name}` : it.product_id}</span>
                        <button type="button" className="admin-icon-btn" onClick={() => move(idx, -1)} aria-label="Subir"><ArrowUp size={14} /></button>
                        <button type="button" className="admin-icon-btn" onClick={() => move(idx, 1)} aria-label="Bajar"><ArrowDown size={14} /></button>
                        <button type="button" className="admin-icon-btn danger" onClick={() => setEditingItems((prev) => prev.filter((_, i) => i !== idx))}><Trash2 size={14} /></button>
                      </div>
                    );
                  })}
                  {editingItems.length === 0 && <p className="admin-muted small">Aún no agregaste perfumes al combo.</p>}
                </div>
              </div>
            </div>
            <div className="admin-drawer-foot">
              <button className="admin-btn" onClick={() => setEditing(null)}>Cancelar</button>
              <button className="admin-btn primary" onClick={onSave} disabled={saving}><Save size={16} /> {saving ? "Guardando…" : "Guardar"}</button>
            </div>
          </aside>
        </div>
      )}
    </AdminLayout>
  );
}
