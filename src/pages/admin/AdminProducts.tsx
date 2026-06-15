import React, { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Save, X, Search, Star, Eye, EyeOff, Layers } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { emdino } from "../../lib/supabase";
import { useAdminSession } from "../../lib/adminSession";
import { formatGs } from "../../utils/helpers";

interface Variant {
  id?: string;
  product_id?: string;
  label: string;
  volume_ml: number;
  sku: string;
  price: number;
  stock: number;
  stock_minimum: number;
  active: boolean;
  sort_order: number;
  _delete?: boolean;
  _new?: boolean;
}

interface Product {
  id: string;
  store_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  brand: string;
  gender: "masculino" | "femenino";
  short_description: string | null;
  long_description: string | null;
  main_image_url: string | null;
  featured: boolean;
  active: boolean;
  sort_order: number;
  variants?: Variant[];
}

interface Category { id: string; name: string; slug: string; }

const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const emptyProduct = (): Partial<Product> => ({
  name: "", slug: "", brand: "", gender: "masculino", category_id: null,
  short_description: "", long_description: "", main_image_url: "",
  featured: false, active: true, sort_order: 0,
});
const defaultVariants = (slug: string): Variant[] => [
  { label: "3ml", volume_ml: 3, sku: skuFor(slug, 3), price: 0, stock: 0, stock_minimum: 0, active: true, sort_order: 1, _new: true },
  { label: "5ml", volume_ml: 5, sku: skuFor(slug, 5), price: 0, stock: 0, stock_minimum: 0, active: true, sort_order: 2, _new: true },
  { label: "10ml", volume_ml: 10, sku: skuFor(slug, 10), price: 0, stock: 0, stock_minimum: 0, active: true, sort_order: 3, _new: true },
  { label: "30ml", volume_ml: 30, sku: skuFor(slug, 30), price: 0, stock: 0, stock_minimum: 0, active: true, sort_order: 4, _new: true },
];
function skuFor(slug: string, ml: number) {
  return `EMDINO-${slug.toUpperCase().replace(/-/g, "_")}-${ml}ML`;
}

export default function AdminProducts() {
  const { profile } = useAdminSession();
  const [items, setItems] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [editingVariants, setEditingVariants] = useState<Variant[]>([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!profile) return;
    setLoading(true); setError(null);
    const [{ data: prodRows, error: pErr }, { data: catRows, error: cErr }] = await Promise.all([
      emdino.from("products").select(`
        id, store_id, category_id, name, slug, brand, gender,
        short_description, long_description, main_image_url,
        featured, active, sort_order,
        product_variants ( id, product_id, label, volume_ml, sku, price, stock, stock_minimum, active, sort_order )
      `).eq("store_id", profile.store_id).order("sort_order", { ascending: true }),
      emdino.from("perfume_categories").select("id, name, slug").eq("store_id", profile.store_id).order("sort_order"),
    ]);
    if (pErr) { setError(pErr.message); setLoading(false); return; }
    if (cErr) { setError(cErr.message); }
    setItems(((prodRows as any[]) || []).map((p) => ({ ...p, variants: p.product_variants || [] })));
    setCats((catRows as Category[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [profile]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((p) => {
      if (genderFilter !== "all" && p.gender !== genderFilter) return false;
      if (catFilter !== "all" && p.category_id !== catFilter) return false;
      if (q) {
        const hay = (p.name + " " + p.brand + " " + p.slug).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, search, genderFilter, catFilter]);

  const openNew = () => {
    setEditing(emptyProduct());
    setEditingVariants(defaultVariants(""));
  };
  const openEdit = (p: Product) => {
    setEditing({ ...p });
    setEditingVariants((p.variants || []).slice().sort((a, b) => a.sort_order - b.sort_order));
  };

  const onSave = async () => {
    if (!profile || !editing) return;
    if (!editing.name?.trim()) { setError("Nombre requerido"); return; }
    if (!editing.slug?.trim()) { setError("Slug requerido"); return; }
    if (!editing.brand?.trim()) { setError("Marca requerida"); return; }
    if (!editing.category_id) { setError("Categoría requerida"); return; }

    setSaving(true); setError(null);
    const payload: any = {
      store_id: profile.store_id,
      category_id: editing.category_id,
      name: editing.name.trim(),
      slug: editing.slug.trim(),
      brand: editing.brand.trim(),
      gender: editing.gender,
      short_description: editing.short_description || null,
      long_description: editing.long_description || null,
      main_image_url: editing.main_image_url || null,
      featured: !!editing.featured,
      active: editing.active !== false,
      sort_order: Number(editing.sort_order) || 0,
    };
    if (editing.id) payload.id = editing.id;
    const { data: upserted, error: upErr } = await emdino
      .from("products")
      .upsert(payload, { onConflict: "store_id,slug" })
      .select("id")
      .single();
    if (upErr) { setError(upErr.message); setSaving(false); return; }
    const productId = (upserted as any).id as string;

    // Variantes
    for (const v of editingVariants) {
      if (v._delete && v.id) {
        await emdino.from("product_variants").delete().eq("id", v.id);
        continue;
      }
      if (v._delete) continue;
      const vp: any = {
        store_id: profile.store_id,
        product_id: productId,
        label: v.label,
        volume_ml: Number(v.volume_ml) || 0,
        sku: v.sku || skuFor(editing.slug!, Number(v.volume_ml) || 0),
        price: Number(v.price) || 0,
        stock: Number(v.stock) || 0,
        stock_minimum: Number(v.stock_minimum) || 0,
        active: v.active !== false,
        sort_order: Number(v.sort_order) || 0,
      };
      if (v.id) vp.id = v.id;
      const { error: vErr } = await emdino.from("product_variants").upsert(vp);
      if (vErr) console.warn("variant upsert err:", vErr);
    }

    setSaving(false);
    setEditing(null); setEditingVariants([]);
    load();
  };

  const onDelete = async (p: Product) => {
    if (!confirm(`¿Eliminar el perfume "${p.brand} ${p.name}"? Tambien se borran sus variantes.`)) return;
    const { error } = await emdino.from("products").delete().eq("id", p.id);
    if (error) { setError(error.message); return; }
    load();
  };

  const toggleActive = async (p: Product) => {
    await emdino.from("products").update({ active: !p.active }).eq("id", p.id);
    load();
  };
  const toggleFeatured = async (p: Product) => {
    await emdino.from("products").update({ featured: !p.featured }).eq("id", p.id);
    load();
  };

  return (
    <AdminLayout eyebrow="Catálogo" title="Perfumes">
      {error && <div className="admin-alert error">{error}</div>}

      <div className="admin-toolbar wrap">
        <div className="admin-search">
          <Search size={15} />
          <input placeholder="Buscar por nombre, marca o slug…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="admin-select">
          <option value="all">Todos los géneros</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
        </select>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="admin-select">
          <option value="all">Todas las categorías</option>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="admin-btn primary" onClick={openNew}><Plus size={16} /> Nuevo perfume</button>
      </div>

      {loading ? <p className="admin-muted">Cargando…</p> : (
        <div className="admin-card">
          <p className="admin-muted small">{filtered.length} {filtered.length === 1 ? "perfume" : "perfumes"}</p>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Perfume</th><th>Categoría</th><th>Género</th><th className="num">Variantes</th>
                <th>Destacado</th><th>Activo</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const cat = cats.find((c) => c.id === p.category_id);
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-product-cell">
                        <div className="admin-product-thumb" aria-hidden="true">
                          {p.main_image_url ? (
                            <img
                              src={p.main_image_url}
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
                          <span className="admin-product-thumb-ph" style={{ display: p.main_image_url ? "none" : "flex" }}>
                            {p.brand.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <strong>{p.brand}</strong> {p.name}
                          <div className="admin-muted xsmall">{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="admin-muted">{cat?.name || "—"}</td>
                    <td className="admin-muted">{p.gender}</td>
                    <td className="num">{p.variants?.length || 0}</td>
                    <td><button className="admin-icon-btn" onClick={() => toggleFeatured(p)} aria-label="Destacado"><Star size={14} fill={p.featured ? "#b8944f" : "none"} stroke={p.featured ? "#b8944f" : "currentColor"} /></button></td>
                    <td><button className="admin-icon-btn" onClick={() => toggleActive(p)} aria-label="Activo">{p.active ? <Eye size={15} /> : <EyeOff size={15} />}</button></td>
                    <td className="actions">
                      <button className="admin-icon-btn" onClick={() => openEdit(p)} aria-label="Editar"><Edit size={15} /></button>
                      <button className="admin-icon-btn danger" onClick={() => onDelete(p)} aria-label="Eliminar"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={7} className="admin-muted">Sin resultados.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="admin-drawer-root open" onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <aside className="admin-drawer wide">
            <div className="admin-drawer-head">
              <h3>{editing.id ? "Editar perfume" : "Nuevo perfume"}</h3>
              <button className="admin-icon-btn" onClick={() => setEditing(null)}><X size={18} /></button>
            </div>
            <div className="admin-drawer-body">
              <div className="admin-grid-2">
                <label className="admin-field"><span>Nombre *</span>
                  <input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : slugify(`${editing.brand || ""} ${e.target.value}`) })} />
                </label>
                <label className="admin-field"><span>Marca *</span>
                  <input value={editing.brand || ""} onChange={(e) => setEditing({ ...editing, brand: e.target.value, slug: editing.id ? editing.slug : slugify(`${e.target.value} ${editing.name || ""}`) })} />
                </label>
                <label className="admin-field"><span>Slug *</span>
                  <input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} />
                </label>
                <label className="admin-field"><span>Género *</span>
                  <select value={editing.gender || "masculino"} onChange={(e) => setEditing({ ...editing, gender: e.target.value as any })}>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                  </select>
                </label>
                <label className="admin-field"><span>Categoría *</span>
                  <select value={editing.category_id || ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value })}>
                    <option value="">Elegí…</option>
                    {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
                <label className="admin-field"><span>Orden</span>
                  <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
                </label>
              </div>

              <label className="admin-field">
                <span>URL de imagen principal</span>
                <input value={editing.main_image_url || ""} placeholder="/assets/perfumes/slug.jpg o https://…" onChange={(e) => setEditing({ ...editing, main_image_url: e.target.value })} />
                {editing.main_image_url && <small className="admin-muted">Vista previa: <img src={editing.main_image_url} alt="" style={{ height: 60, marginTop: 8, background: "#f3eadb", padding: 6, borderRadius: 4 }} onError={(ev) => { (ev.target as HTMLImageElement).style.display = "none"; }} /></small>}
              </label>

              <label className="admin-field">
                <span>Descripción corta</span>
                <input value={editing.short_description || ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} />
              </label>
              <label className="admin-field">
                <span>Descripción larga</span>
                <textarea rows={3} value={editing.long_description || ""} onChange={(e) => setEditing({ ...editing, long_description: e.target.value })} />
              </label>

              <div className="admin-checkrow">
                <label className="admin-checkfield">
                  <input type="checkbox" checked={editing.active !== false} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
                  <span>Activo</span>
                </label>
                <label className="admin-checkfield">
                  <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                  <span>Destacado</span>
                </label>
              </div>

              {/* Variantes inline */}
              <div className="admin-block">
                <div className="admin-block-head">
                  <h4><Layers size={15} /> Presentaciones</h4>
                  <button className="admin-btn" type="button" onClick={() => setEditingVariants((v) => [...v, { label: "", volume_ml: 0, sku: "", price: 0, stock: 0, stock_minimum: 0, active: true, sort_order: v.length + 1, _new: true }])}>
                    <Plus size={14} /> Agregar
                  </button>
                </div>
                <div className="admin-variants">
                  {editingVariants.filter((v) => !v._delete).map((v, idx) => {
                    const idxReal = editingVariants.indexOf(v);
                    return (
                      <div key={idxReal} className="admin-variant-row">
                        <input placeholder="Label" value={v.label} onChange={(e) => updateRow(idxReal, "label", e.target.value)} />
                        <input type="number" placeholder="ml" value={v.volume_ml} onChange={(e) => updateRow(idxReal, "volume_ml", Number(e.target.value))} />
                        <input placeholder="SKU" value={v.sku} onChange={(e) => updateRow(idxReal, "sku", e.target.value)} />
                        <input type="number" placeholder="Precio" value={v.price} onChange={(e) => updateRow(idxReal, "price", Number(e.target.value))} />
                        <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => updateRow(idxReal, "stock", Number(e.target.value))} />
                        <input type="number" placeholder="Mín." value={v.stock_minimum} onChange={(e) => updateRow(idxReal, "stock_minimum", Number(e.target.value))} />
                        <label className="admin-checkfield small">
                          <input type="checkbox" checked={v.active !== false} onChange={(e) => updateRow(idxReal, "active", e.target.checked)} /><span>Activa</span>
                        </label>
                        <button type="button" className="admin-icon-btn danger" onClick={() => updateRow(idxReal, "_delete", true)} aria-label="Quitar"><Trash2 size={14} /></button>
                      </div>
                    );
                  })}
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

  function updateRow(index: number, key: string, value: any) {
    setEditingVariants((prev) => prev.map((row, i) => i === index ? { ...row, [key]: value } : row));
  }
}
