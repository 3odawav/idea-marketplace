import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../data/types";
import artceramic from "../data/artceramic.json";

// ── Real catalogue from artceramic-egypt.com (Strapi API) ──────────────────
interface RawProduct {
  id: string; slug: string; name: string; color: string | null;
  colorCategory: string | null; size: string | null; texture: string | null;
  types: string[]; featured: boolean; image: string | null; tiles: string[];
}

function mapProduct(r: RawProduct): Product {
  const colors = [...new Set([r.color, r.colorCategory].filter(Boolean) as string[])];
  const gallery = [r.image, ...r.tiles].filter(Boolean) as string[];
  const application = r.types.includes("Wall") && r.types.includes("Floor")
    ? "Wall and Floor" : r.types.includes("Wall") ? "Wall" : r.types.includes("Floor") ? "Floor" : undefined;
  return {
    id: r.id, slug: r.slug,
    name: { en: r.name, ar: r.name, fr: r.name },
    collection: "ceramics", brand: "Ceramica Art", model: r.name, code: `AC-${r.id}`,
    origin: "Egyptian", type: "Ceramic",
    finish: r.texture ?? undefined, variant: r.color ?? undefined,
    usage: r.types, application, colors,
    sizes: r.size ? [{ id: "s1", label: r.size }] : [],
    image: r.image ?? gallery[0] ?? "", gallery,
    family: r.slug, approved: true, status: "imported",
  };
}

const REAL_PRODUCTS: Product[] = (artceramic as RawProduct[]).filter((r) => r.image).map(mapProduct);

export interface QuoteItem {
  productId: string;
  quantity: number;
  unit: "sqm" | "pieces";
}

interface StoreCtx {
  products: Product[];
  favorites: string[];
  quote: QuoteItem[];
  compare: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addToQuote: (id: string, unit: "sqm" | "pieces") => void;
  updateQuoteQty: (id: string, qty: number) => void;
  removeFromQuote: (id: string) => void;
  clearQuote: () => void;
  toggleCompare: (id: string) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

function usePersisted<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      /* ignore */
    }
  }, [key, val]);
  return [val, setVal];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  // Products: real imported catalogue from artceramic-egypt.com.
  const [products] = useState<Product[]>(() => REAL_PRODUCTS);
  const [favorites, setFavorites] = usePersisted<string[]>("idea.favorites", []);
  const [quote, setQuote] = usePersisted<QuoteItem[]>("idea.quote", []);
  const [compare, setCompare] = usePersisted<string[]>("idea.compare", []);

  const value = useMemo<StoreCtx>(
    () => ({
      products,
      favorites,
      quote,
      compare,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite: (id) =>
        setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
      toggleCompare: (id) =>
        setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id].slice(-4))),
      addToQuote: (id, unit) =>
        setQuote((q) =>
          q.some((i) => i.productId === id)
            ? q
            : [...q, { productId: id, quantity: unit === "sqm" ? 10 : 1, unit }]
        ),
      updateQuoteQty: (id, qty) =>
        setQuote((q) => q.map((i) => (i.productId === id ? { ...i, quantity: Math.max(1, qty) } : i))),
      removeFromQuote: (id) => setQuote((q) => q.filter((i) => i.productId !== id)),
      clearQuote: () => setQuote([]),
    }),
    [products, favorites, quote, compare, setFavorites, setQuote, setCompare]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
}
