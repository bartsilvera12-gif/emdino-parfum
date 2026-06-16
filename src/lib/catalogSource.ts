// Fuente de datos del catalogo publico.
// Intenta Supabase. Si falla (DB caida, anon key expirada, schema no expuesto),
// cae a los datos hardcodeados de src/data/catalogs.js + combos.js para que la
// web nunca quede vacia.

import { emdino, supabaseConfigured, STORE_SLUG } from "./supabase";
import {
  EMDINO_DATA_FALLBACK,
  EMDINO_COMBOS_FALLBACK,
  EMDINO_SETTINGS_FALLBACK,
} from "../data/catalogs";

export interface CatalogProduct {
  id: string;
  slug: string;
  nombre: string;
  marca: string;
  genero: "masculino" | "femenino";
  categoria: string; // slug
  imagen: string | null;
  precios: Record<string, number>; // "3ml" => 50000
  destacado?: boolean;
}

export interface CatalogCategory {
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
}

export interface CatalogCombo {
  id: string;
  slug: string;
  nombre: string;
  tagline: string;
  presentacion: string;
  precioNormal: number;
  precioPromo: number;
  precios: Record<string, number>; // "3ml" => 150000 (precio promo por tamaño)
  preciosNormal: Record<string, number>; // "3ml" => 160000 (precio tachado por tamaño, si hay)
  destacado: boolean;
  imagen: string | null;
  items: string[]; // slugs de productos
  incluye: string[]; // nombres legibles
}

export interface CatalogSettings {
  whatsapp_number: string;
  whatsapp_display: string;
  instagram_handle: string;
  instagram_url: string;
  free_shipping_from: number;
  show_female_catalog: boolean;
}

export interface CatalogBundle {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  combos: CatalogCombo[];
  settings: CatalogSettings;
  source: "supabase" | "fallback";
  storeId?: string;
}

function parseSettings(rows: { key: string; value: any }[]): CatalogSettings {
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const get = (k: string, d: any) => (map.has(k) ? map.get(k) : d);
  return {
    whatsapp_number: String(get("whatsapp_number", EMDINO_SETTINGS_FALLBACK.whatsapp_number)),
    whatsapp_display: String(get("whatsapp_display", EMDINO_SETTINGS_FALLBACK.whatsapp_display)),
    instagram_handle: String(get("instagram_handle", EMDINO_SETTINGS_FALLBACK.instagram_handle)),
    instagram_url: String(get("instagram_url", EMDINO_SETTINGS_FALLBACK.instagram_url)),
    free_shipping_from: Number(get("free_shipping_from", EMDINO_SETTINGS_FALLBACK.free_shipping_from)) || 0,
    show_female_catalog: Boolean(get("show_female_catalog", EMDINO_SETTINGS_FALLBACK.show_female_catalog)),
  };
}

async function withTimeout<T>(p: Promise<T>, ms: number, tag: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Timeout (${tag}) tras ${ms}ms`)), ms)),
  ]);
}

export async function loadCatalogFromSupabase(): Promise<CatalogBundle | null> {
  if (!supabaseConfigured) return null;
  try {
    // 1) store
    const { data: store, error: storeErr } = await withTimeout(
      emdino.from("stores").select("id").eq("slug", STORE_SLUG).single(),
      6000,
      "stores"
    );
    if (storeErr || !store) return null;
    const storeId = (store as any).id as string;

    // 2-3-4-5) Paralelizar settings + categorias + productos + combos
    const [settingsRes, catRes, prodRes, comboRes] = await Promise.all([
      withTimeout(
        emdino.from("settings").select("key,value").eq("store_id", storeId),
        6000, "settings"
      ),
      withTimeout(
        emdino.from("perfume_categories")
          .select("slug,name,description,sort_order,active")
          .eq("store_id", storeId).eq("active", true)
          .order("sort_order", { ascending: true }),
        6000, "categories"
      ),
      withTimeout(
        emdino.from("products")
          .select(`
            id, slug, name, brand, gender, main_image_url, featured, active, sort_order, category_id,
            category:perfume_categories ( slug ),
            product_variants ( label, price, active )
          `)
          .eq("store_id", storeId).eq("active", true)
          .order("sort_order", { ascending: true }),
        8000, "products"
      ),
      withTimeout(
        emdino.from("combos")
          .select(`
            slug, name, tagline, presentation, normal_price, promo_price, featured, active, sort_order, image_url,
            combo_items ( sort_order, product:products ( slug, brand, name ) ),
            combo_variants ( label, price, compare_at_price, active, sort_order )
          `)
          .eq("store_id", storeId).eq("active", true)
          .order("sort_order", { ascending: true }),
        6000, "combos"
      ),
    ]);

    const settings = parseSettings(
      (((settingsRes as any).data as any[]) || []).map((r: any) => ({ key: r.key, value: r.value }))
    );

    const categories: CatalogCategory[] = (((catRes as any).data as any[]) || []).map((r: any) => ({
      slug: r.slug,
      name: r.name,
      description: r.description,
      sort_order: r.sort_order,
    }));

    const { data: productRows, error: prodErr } = prodRes as any;
    if (prodErr) return null;

    const products: CatalogProduct[] = ((productRows as any[]) || []).map((p) => {
      const precios: Record<string, number> = {};
      const variants = (p.product_variants || []).filter((v: any) => v.active);
      variants.forEach((v: any) => {
        precios[v.label] = Number(v.price) || 0;
      });
      const categoryArr = p.category;
      const categorySlug = Array.isArray(categoryArr) ? categoryArr[0]?.slug : categoryArr?.slug;
      return {
        id: p.slug, // usamos slug como id estable para el frontend (sigue funcionando con codigo existente)
        slug: p.slug,
        nombre: p.name,
        marca: p.brand,
        genero: p.gender,
        categoria: categorySlug || "disenador",
        imagen: p.main_image_url || null,
        precios,
        destacado: !!p.featured,
      };
    });

    const { data: comboRows, error: comboErr } = comboRes as any;
    if (comboErr) return null;

    const combos: CatalogCombo[] = ((comboRows as any[]) || []).map((c) => {
      const items = (c.combo_items || [])
        .slice()
        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      const precios: Record<string, number> = {};
      const preciosNormal: Record<string, number> = {};
      const variants = (c.combo_variants || [])
        .filter((v: any) => v.active)
        .slice()
        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      variants.forEach((v: any) => {
        precios[v.label] = Number(v.price) || 0;
        if (v.compare_at_price != null) preciosNormal[v.label] = Number(v.compare_at_price) || 0;
      });
      return {
        id: c.slug,
        slug: c.slug,
        nombre: c.name,
        tagline: c.tagline || "",
        presentacion: c.presentation || "",
        precioNormal: Number(c.normal_price) || 0,
        precioPromo: Number(c.promo_price) || 0,
        precios,
        preciosNormal,
        destacado: !!c.featured,
        imagen: c.image_url || null,
        items: items.map((i: any) => i.product?.slug).filter(Boolean),
        incluye: items.map((i: any) => `${i.product?.brand ?? ""} ${i.product?.name ?? ""}`.trim()).filter(Boolean),
      };
    });

    return { products, categories, combos, settings, source: "supabase", storeId };
  } catch (err) {
    console.warn("[catalogSource] Supabase load failed, using fallback:", err);
    return null;
  }
}

export function loadFallbackCatalog(): CatalogBundle {
  return {
    products: EMDINO_DATA_FALLBACK.MASCULINO_ALL.map((p: any) => ({ ...p, slug: p.id })),
    categories: [
      { slug: "disenador", name: "Diseñador", description: EMDINO_DATA_FALLBACK.CATEGORY_DESC.disenador, sort_order: 1 },
      { slug: "arabe", name: "Árabe", description: EMDINO_DATA_FALLBACK.CATEGORY_DESC.arabe, sort_order: 2 },
      { slug: "nicho", name: "Nicho", description: EMDINO_DATA_FALLBACK.CATEGORY_DESC.nicho, sort_order: 3 },
    ],
    combos: EMDINO_COMBOS_FALLBACK.map((c: any) => ({
      id: c.id,
      slug: c.id,
      nombre: c.nombre,
      tagline: c.tagline,
      presentacion: c.presentacion,
      precioNormal: c.precioNormal,
      precioPromo: c.precioPromo,
      precios: c.precios || {},
      preciosNormal: c.preciosNormal || {},
      destacado: !!c.destacado,
      imagen: c.imagen || null,
      items: c.items,
      incluye: c.incluye,
    })),
    settings: { ...EMDINO_SETTINGS_FALLBACK },
    source: "fallback",
  };
}

// ---- Cache en localStorage (60s — corto para que cambios del admin se reflejen rapido) ----
const CACHE_KEY = "emdino_catalog_cache_v1";
const CACHE_TTL_MS = 60 * 1000;

interface CachedBundle { ts: number; bundle: CatalogBundle; }

function readCache(): CatalogBundle | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedBundle;
    if (!parsed || !parsed.bundle) return null;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return { ...parsed.bundle, source: "supabase" as const };
  } catch { return null; }
}

function writeCache(bundle: CatalogBundle) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), bundle }));
  } catch {}
}

export async function loadCatalog(): Promise<CatalogBundle> {
  // 1) Si hay cache fresca, devolverla inmediatamente (no espera red)
  const cached = readCache();
  if (cached) {
    // Refresh en background sin bloquear
    loadCatalogFromSupabase().then((fresh) => {
      if (fresh && fresh.products.length > 0) writeCache(fresh);
    }).catch(() => {});
    return cached;
  }
  // 2) Sin cache: ir a Supabase
  const remote = await loadCatalogFromSupabase();
  if (remote && remote.products.length > 0) {
    writeCache(remote);
    return remote;
  }
  // 3) Supabase fallo o no devolvio data: fallback local
  return loadFallbackCatalog();
}
