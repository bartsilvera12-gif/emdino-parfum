import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { emdino } from "../../lib/supabase";
import { useAdminSession } from "../../lib/adminSession";

interface SettingsForm {
  whatsapp_number: string;
  whatsapp_display: string;
  instagram_handle: string;
  instagram_url: string;
  free_shipping_from: number;
  show_female_catalog: boolean;
}

const EMPTY: SettingsForm = {
  whatsapp_number: "595972562362",
  whatsapp_display: "0972 562 362",
  instagram_handle: "@emdinoo__",
  instagram_url: "https://instagram.com/emdinoo__",
  free_shipping_from: 300000,
  show_female_catalog: false,
};

export default function AdminSettings() {
  const { profile } = useAdminSession();
  const [form, setForm] = useState<SettingsForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const { data } = await emdino.from("settings").select("key, value").eq("store_id", profile.store_id);
      const m: Record<string, any> = {};
      ((data as any[]) || []).forEach((r) => { m[r.key] = r.value; });
      setForm({
        whatsapp_number: String(m.whatsapp_number ?? EMPTY.whatsapp_number),
        whatsapp_display: String(m.whatsapp_display ?? EMPTY.whatsapp_display),
        instagram_handle: String(m.instagram_handle ?? EMPTY.instagram_handle),
        instagram_url: String(m.instagram_url ?? EMPTY.instagram_url),
        free_shipping_from: Number(m.free_shipping_from ?? EMPTY.free_shipping_from),
        show_female_catalog: Boolean(m.show_female_catalog ?? false),
      });
      setLoading(false);
    })();
  }, [profile]);

  const save = async () => {
    if (!profile) return;
    setSaving(true); setError(null); setOk(false);
    const entries: { key: string; value: any }[] = [
      { key: "whatsapp_number", value: form.whatsapp_number },
      { key: "whatsapp_display", value: form.whatsapp_display },
      { key: "instagram_handle", value: form.instagram_handle },
      { key: "instagram_url", value: form.instagram_url },
      { key: "free_shipping_from", value: form.free_shipping_from },
      { key: "show_female_catalog", value: form.show_female_catalog },
    ];
    for (const e of entries) {
      const { error } = await emdino.from("settings").upsert(
        { store_id: profile.store_id, key: e.key, value: e.value },
        { onConflict: "store_id,key" }
      );
      if (error) { setError(error.message); setSaving(false); return; }
    }
    setSaving(false); setOk(true);
  };

  if (loading) return <AdminLayout title="Configuración"><p className="admin-muted">Cargando…</p></AdminLayout>;

  return (
    <AdminLayout eyebrow="Operaciones" title="Configuración">
      {error && <div className="admin-alert error">{error}</div>}
      {ok && <div className="admin-alert ok">Configuración guardada.</div>}

      <div className="admin-card">
        <div className="admin-grid-2">
          <label className="admin-field"><span>WhatsApp (número completo)</span>
            <input value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} placeholder="595972562362" />
          </label>
          <label className="admin-field"><span>WhatsApp visible</span>
            <input value={form.whatsapp_display} onChange={(e) => setForm({ ...form, whatsapp_display: e.target.value })} placeholder="0972 562 362" />
          </label>
          <label className="admin-field"><span>Instagram (handle)</span>
            <input value={form.instagram_handle} onChange={(e) => setForm({ ...form, instagram_handle: e.target.value })} placeholder="@emdinoo__" />
          </label>
          <label className="admin-field"><span>Instagram URL</span>
            <input value={form.instagram_url} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} placeholder="https://instagram.com/…" />
          </label>
          <label className="admin-field"><span>Envío gratis desde (Gs.)</span>
            <input type="number" value={form.free_shipping_from} onChange={(e) => setForm({ ...form, free_shipping_from: Number(e.target.value) })} />
          </label>
          <label className="admin-checkfield big">
            <input type="checkbox" checked={form.show_female_catalog} onChange={(e) => setForm({ ...form, show_female_catalog: e.target.checked })} />
            <span>Mostrar catálogo femenino en la web pública</span>
          </label>
        </div>
        <div className="admin-card-foot">
          <button className="admin-btn primary" onClick={save} disabled={saving}>
            <Save size={16} /> {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
