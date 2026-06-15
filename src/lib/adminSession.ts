// Helpers para manejar la sesion admin + profile (store_id + role)
import { useEffect, useState } from "react";
import { supabase, emdino, supabaseConfigured } from "./supabase";

export interface AdminProfile {
  id: string;
  store_id: string;
  email: string | null;
  role: "admin" | "editor";
}

export async function getCurrentProfile(): Promise<AdminProfile | null> {
  if (!supabaseConfigured) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await emdino
    .from("profiles")
    .select("id, store_id, email, role")
    .eq("id", user.id)
    .single();
  if (error || !data) return null;
  return data as AdminProfile;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export interface AdminSessionState {
  loading: boolean;
  profile: AdminProfile | null;
  error: string | null;
}

export function useAdminSession(): AdminSessionState {
  const [state, setState] = useState<AdminSessionState>({ loading: true, profile: null, error: null });

  useEffect(() => {
    let alive = true;
    async function check() {
      if (!supabaseConfigured) {
        if (alive) setState({ loading: false, profile: null, error: "Supabase no configurado. Completar .env.local" });
        return;
      }
      try {
        const profile = await getCurrentProfile();
        if (!alive) return;
        if (!profile) {
          setState({ loading: false, profile: null, error: null });
          return;
        }
        if (!profile.store_id || (profile.role !== "admin" && profile.role !== "editor")) {
          setState({ loading: false, profile: null, error: "Tu usuario no tiene perfil de admin asignado." });
          return;
        }
        setState({ loading: false, profile, error: null });
      } catch (e: any) {
        if (alive) setState({ loading: false, profile: null, error: e.message || "Error verificando sesion" });
      }
    }
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  return state;
}
