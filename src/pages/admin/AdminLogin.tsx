import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, supabaseConfigured } from "../../lib/supabase";
import { getCurrentProfile } from "../../lib/adminSession";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabaseConfigured) return;
    getCurrentProfile().then((p) => {
      if (p) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!supabaseConfigured) {
      setError("Supabase no está configurado. Crear .env.local con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.");
      return;
    }
    setSubmitting(true);
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signErr) {
      setSubmitting(false);
      setError(signErr.message);
      return;
    }
    const profile = await getCurrentProfile();
    setSubmitting(false);
    if (!profile) {
      setError("Sesión iniciada pero no encontramos un perfil de admin asignado. Pedí al administrador que cree tu profile en emdino.profiles.");
      await supabase.auth.signOut();
      return;
    }
    if (profile.role !== "admin" && profile.role !== "editor") {
      setError("Tu usuario no tiene rol admin/editor.");
      await supabase.auth.signOut();
      return;
    }
    navigate("/admin", { replace: true });
  };

  return (
    <div className="admin-login-screen">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-brand-mark big">E</span>
          <h1 className="admin-login-title">Emdino Perfumería</h1>
          <p className="admin-login-sub">Panel de administración</p>
        </div>
        <form onSubmit={onSubmit} className="admin-login-form">
          <label className="admin-field">
            <span>Email</span>
            <input
              type="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </label>
          <label className="admin-field">
            <span>Contraseña</span>
            <input
              type="password" autoComplete="current-password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          {error && <p className="admin-login-error">{error}</p>}
          <button type="submit" className="admin-btn primary full" disabled={submitting}>
            {submitting ? "Entrando…" : "Iniciar sesión"}
          </button>
          <a href="/" className="admin-login-back">← Volver a la tienda</a>
        </form>
      </div>
    </div>
  );
}
