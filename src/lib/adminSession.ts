// Helpers para manejar la sesion admin + profile (store_id + role).
// Optimistic init desde localStorage: si hay profile cacheado se muestra el panel
// inmediatamente al refrescar y verificamos contra Supabase en background.
import { useEffect, useState } from "react";
import { supabase, emdino, supabaseConfigured } from "./supabase";

export interface AdminProfile {
  id: string;
  store_id: string;
  email: string | null;
  role: "admin" | "editor";
}

export interface AdminSessionState {
  loading: boolean;
  profile: AdminProfile | null;
  error: string | null;
}

const PROFILE_CACHE_KEY = "emdino_admin_profile_v1";
const PROFILE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function readCachedProfile(): AdminProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; profile: AdminProfile };
    if (!parsed?.profile) return null;
    if (Date.now() - parsed.ts > PROFILE_CACHE_TTL_MS) return null;
    return parsed.profile;
  } catch {
    return null;
  }
}

function writeCachedProfile(profile: AdminProfile | null) {
  try {
    if (profile) localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ ts: Date.now(), profile }));
    else localStorage.removeItem(PROFILE_CACHE_KEY);
  } catch {}
}

async function withTimeout<T>(p: Promise<T>, ms: number, tag: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Timeout (${tag})`)), ms)),
  ]);
}

// Verifica sesion + profile contra Supabase. Devuelve null si no hay sesion valida.
export async function getCurrentProfile(): Promise<AdminProfile | null> {
  if (!supabaseConfigured) return null;
  try {
    // getSession lee de localStorage (rapido) — no requiere round-trip.
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    const { data, error } = await withTimeout(
      emdino.from("profiles").select("id, store_id, email, role").eq("id", session.user.id).single(),
      6000,
      "profiles"
    );
    if (error || !data) return null;
    const profile = data as AdminProfile;
    if (!profile.store_id || (profile.role !== "admin" && profile.role !== "editor")) return null;
    return profile;
  } catch (err) {
    console.warn("[adminSession] getCurrentProfile error:", err);
    return null;
  }
}

export async function signOut() {
  writeCachedProfile(null);
  await supabase.auth.signOut();
}

export function useAdminSession(): AdminSessionState {
  // Init optimista: si tenemos cache, mostramos el panel YA. No hay flash.
  const [state, setState] = useState<AdminSessionState>(() => {
    if (!supabaseConfigured) return { loading: false, profile: null, error: "Supabase no configurado. Completar .env.local" };
    const cached = readCachedProfile();
    if (cached) return { loading: false, profile: cached, error: null };
    return { loading: true, profile: null, error: null };
  });

  useEffect(() => {
    if (!supabaseConfigured) return;
    let alive = true;

    async function verify() {
      try {
        const profile = await getCurrentProfile();
        if (!alive) return;
        if (!profile) {
          writeCachedProfile(null);
          setState({ loading: false, profile: null, error: null });
          return;
        }
        writeCachedProfile(profile);
        setState({ loading: false, profile, error: null });
      } catch (e: any) {
        if (!alive) return;
        // Si tenemos cache previo, mantenerlo (la conexion fallo pero el usuario
        // SIGUE logueado segun localStorage). El siguiente intento revalida.
        const cached = readCachedProfile();
        if (cached) {
          setState({ loading: false, profile: cached, error: null });
        } else {
          setState({ loading: false, profile: null, error: null });
        }
      }
    }

    verify();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        writeCachedProfile(null);
        if (alive) setState({ loading: false, profile: null, error: null });
        return;
      }
      // INITIAL_SESSION / SIGNED_IN / TOKEN_REFRESHED -> revalidar
      verify();
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
