import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import type { CollectionSlug, Product } from "../data/types";
import { useI18n } from "../i18n/i18n";
import { useStore } from "../store/store";
import { COLLECTIONS } from "../data/catalog";
import { ProductCard } from "../components/ProductCard";
import { Chip, Container, Section } from "../components/ui";

function uniq<T>(arr: (T | undefined)[]): T[] {
  return [...new Set(arr.filter(Boolean) as T[])];
}

export function Products({ fixedCollection }: { fixedCollection?: CollectionSlug }) {
  const { t, locale } = useI18n();
  const { products } = useStore();
  const [params] = useSearchParams();
  const q = (params.get("q") ?? "").trim().toLowerCase();

  const scope = useMemo(
    () => (fixedCollection ? products.filter((p) => p.collection === fixedCollection) : products),
    [products, fixedCollection]
  );

  // Seed filters from the hero search panel (?color=&size=&usage=&finish=).
  const [finish, setFinish] = useState<string | null>(params.get("finish"));
  const [size, setSize] = useState<string | null>(params.get("size"));
  const [usage, setUsage] = useState<string | null>(params.get("usage"));
  const [color, setColor] = useState<string | null>(params.get("color"));

  // Only build filter groups from values that actually exist (no empty filters).
  const facets = useMemo(() => ({
    finish: uniq(scope.map((p) => p.finish)),
    size: uniq(scope.flatMap((p) => p.sizes.map((s) => s.label))),
    usage: uniq(scope.flatMap((p) => p.usage ?? [])),
    color: uniq(scope.flatMap((p) => p.colors ?? [])),
  }), [scope]);

  const matches = (p: Product) => {
    if (finish && p.finish !== finish) return false;
    if (size && !p.sizes.some((s) => s.label === size)) return false;
    if (usage && !(p.usage ?? []).includes(usage)) return false;
    if (color && !(p.colors ?? []).includes(color)) return false;
    if (q) {
      const hay = [p.name[locale], p.name.en, p.brand, p.model, p.code, p.collection, p.origin, ...(p.colors ?? []), ...p.sizes.map((s) => s.label)]
        .join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  };

  const results = scope.filter(matches);
  const clear = () => { setFinish(null); setSize(null); setUsage(null); setColor(null); };

  const meta = fixedCollection ? COLLECTIONS.find((c) => c.slug === fixedCollection) : null;

  const group = (label: string, values: string[], val: string | null, set: (v: string | null) => void) =>
    values.length > 1 && (
      <div style={{ marginBottom: "var(--idea-space-4)" }}>
        <div className="idea-eyebrow" style={{ color: "var(--idea-text-muted)", marginBottom: 10 }}>{label}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {values.map((v) => <Chip key={v} active={val === v} onClick={() => set(val === v ? null : v)}>{v}</Chip>)}
        </div>
      </div>
    );

  return (
    <Section style={{ paddingTop: "var(--idea-space-7)" }}>
      <Container>
        {/* Page heading */}
        <div style={{ marginBottom: "var(--idea-space-6)" }}>
          <div className="idea-eyebrow">{meta ? COLLECTIONS.find((c) => c.slug === fixedCollection)?.group : "Gallery"}</div>
          <h1 className="idea-display" style={{ fontSize: "var(--idea-text-2xl)", color: "var(--idea-text)", margin: "var(--idea-space-2) 0 0" }}>
            {meta ? meta.title[locale] : t("nav.products")}
          </h1>
          {q && <p style={{ color: "var(--idea-text-muted)", marginTop: 8 }}>“{q}”</p>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "var(--idea-space-6)", alignItems: "start" }} className="idea-gallery-grid">
          {/* Filters */}
          <aside style={{ background: "var(--idea-surface)", border: "var(--idea-hairline)", borderRadius: "var(--idea-radius-lg)", padding: "var(--idea-space-5)", position: "sticky", top: 90 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--idea-space-4)" }}>
              <span className="idea-display" style={{ fontSize: "var(--idea-text-lg)", color: "var(--idea-text)" }}>{t("filters.title")}</span>
              <button onClick={clear} style={{ background: "none", border: "none", color: "var(--idea-gold)", cursor: "pointer", fontSize: "var(--idea-text-xs)" }}>{t("filters.clear")}</button>
            </div>
            {group(t("filters.finish"), facets.finish, finish, setFinish)}
            {group(t("filters.size"), facets.size, size, setSize)}
            {group(t("label.usage"), facets.usage, usage, setUsage)}
            {group("Color", facets.color, color, setColor)}
          </aside>

          {/* Results */}
          <div>
            <div style={{ color: "var(--idea-text-muted)", marginBottom: "var(--idea-space-4)", fontSize: "var(--idea-text-sm)" }}>
              {results.length} {t("label.results")}
            </div>
            {results.length === 0 ? (
              <div style={{ padding: "var(--idea-space-8)", textAlign: "center", border: "1px dashed var(--idea-border)", borderRadius: "var(--idea-radius-lg)", color: "var(--idea-text-muted)", lineHeight: 1.7 }}>
                {t("empty.products")}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--idea-space-5)" }}>
                {results.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </Container>
      <style>{`@media (max-width: 860px){ .idea-gallery-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </Section>
  );
}
