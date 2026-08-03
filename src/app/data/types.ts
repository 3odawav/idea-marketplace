// ── IDEA domain model ─────────────────────────────────────────────────────
// Every product field maps to a source-of-truth value that (in production)
// originates from an approved PDF catalogue import. Public prices are NEVER
// stored here — only private internal tiers on the admin/staging side.

export type Locale = "en" | "ar" | "fr";

export type CollectionSlug =
  | "ceramics"
  | "porcelain"
  | "sanitary-ware"
  | "faucets"
  | "bathroom-sets"
  | "bathroom-units"
  | "bathtubs"
  | "shower-units"
  | "bathroom-accessories";

export interface LocalizedText {
  en: string;
  ar: string;
  fr: string;
}

export interface ProductSize {
  id: string;
  label: string; // exact source value, e.g. "60 × 120 cm"
  widthMm?: number;
  heightMm?: number;
  thicknessMm?: number;
  sourceUnit?: "cm" | "mm";
  sourcePage?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: LocalizedText;
  collection: CollectionSlug;
  brand: string;
  model: string;
  code: string;
  origin: string; // country of origin
  texture?: string; // Marble / Wood / Stone …
  finish?: string; // Matte / Glossy / Semi-Matte …
  type?: string; // Ceramic / Porcelain / Laser Cut …
  variant?: string; // Light / Dark / Décor / Skirting …
  usage?: string[]; // Kitchen / Bathroom / Facade …
  application?: string; // Wall / Floor / Wall and Floor
  colors?: string[];
  sizes: ProductSize[];
  image: string;
  gallery?: string[];
  family?: string; // collection/family key linking variants
  sourcePdf?: string;
  sourcePage?: number;
  approved: boolean; // only approved products render publicly
  status: "sample" | "imported" | "staged";
}

export interface CollectionMeta {
  slug: CollectionSlug;
  title: LocalizedText;
  blurb: LocalizedText;
  image: string;
  group: "ceramics" | "porcelain" | "sanitary";
}
