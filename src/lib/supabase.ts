import { createClient } from "@supabase/supabase-js";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? "";
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ?? "";

export const supabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(
  url || "https://placeholder.local",
  anonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.invalid",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    },
  }
);

export const resolvedBusinessSchema =
  (import.meta.env.VITE_BUSINESS_SCHEMA as string | undefined)?.trim() || "emdino";

// Cliente con schema configurable — usar en todas las queries del negocio
export const emdino = supabase.schema(resolvedBusinessSchema) as ReturnType<typeof supabase.schema>;

export const STORE_SLUG = "emdino";
