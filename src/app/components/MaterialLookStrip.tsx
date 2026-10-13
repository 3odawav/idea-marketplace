import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "react-router";
import { X, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "../i18n/i18n";
import type { Locale } from "../data/types";

// ─── Tile product catalog ────────────────────────────────────────────

type TileProduct = {
  id: string;
  name: Record<Locale, string>;
  material: Record<Locale, string>;
  price: number;
  image: string;
  sizes: string[];
  accent: string;
};

const TILES: TileProduct[] = [
  {
    id: "calacatta-gold",
    name: { en: "Calacatta Gold", ar: "كالاكاتا جولد", fr: "Calacatta Or" },
    material: { en: "Marble Look", ar: "تأثير الرخام", fr: "Aspect Marbre" },
    price: 89,
    image: "https://images.unsplash.com/photo-1706629503586-2731f65587ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
    sizes: ["30×60", "60×60", "60×120"],
    accent: "#d4c4a0",
  },
  {
    id: "carrara-white",
    name: { en: "Carrara White", ar: "كارارا وايت", fr: "Carrare Blanc" },
    material: { en: "Marble Look", ar: "تأثير الرخام", fr: "Aspect Marbre" },
    price: 76,
    image: "https://images.unsplash.com/photo-1765745518673-b562b7304a53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
    sizes: ["60×60", "60×120", "90×90"],
    accent: "#e0d8cc",
  },
  {
    id: "statuario-luxe",
    name: { en: "Statuario Luxe", ar: "ستاتواريو لوكس", fr: "Statuario Luxe" },
    material: { en: "Marble Look", ar: "تأثير الرخام", fr: "Aspect Marbre" },
    price: 112,
    image: "https://images.unsplash.com/photo-1742844552048-410dfdf7b3c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
    sizes: ["60×120", "90×90", "120×120"],
    accent: "#c8baa0",
  },
  {
    id: "arabescato",
    name: { en: "Arabescato", ar: "أرابيسكاتو", fr: "Arabescato" },
    material: { en: "Marble Look", ar: "تأثير الرخام", fr: "Aspect Marbre" },
    price: 98,
    image: "https://images.unsplash.com/photo-1761602866012-ae9f888255dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
    sizes: ["60×60", "60×120"],
    accent: "#b8c4cc",
  },
  {
    id: "bianco-marmo",
    name: { en: "Bianco Marmo", ar: "بيانكو ماربو", fr: "Bianco Marmo" },
    material: { en: "Marble Look", ar: "تأثير الرخام", fr: "Aspect Marbre" },
    price: 84,
    image: "https://images.unsplash.com/photo-1776525433347-13ffc965601a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
    sizes: ["30×60", "60×60", "60×120"],
    accent: "#d8d0c4",
  },
  {
    id: "nordic-oak",
    name: { en: "Nordic Oak", ar: "نورديك أوك", fr: "Chêne Nordique" },
    material: { en: "Wood Look", ar: "تأثير الخشب", fr: "Aspect Bois" },
    price: 64,
    image: "https://images.unsplash.com/photo-1628744876525-f2678d8af47f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
    sizes: ["20×120", "30×120", "15×90"],
    accent: "#c07830",
  },
  {
    id: "walnut-dark",
    name: { en: "Walnut Dark", ar: "وولنت داك", fr: "Noyer Sombre" },
    material: { en: "Wood Look", ar: "تأثير الخشب", fr: "Aspect Bois" },
    price: 72,
    image: "https://images.unsplash.com/photo-1783125127053-db9f268a847b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
    sizes: ["20×120", "30×120"],
    accent: "#8b5a2b",
  },
  {
    id: "smoked-timber",
    name: { en: "Smoked Timber", ar: "سموكد تمبر", fr: "Bois Fumé" },
    material: { en: "Wood Look", ar: "تأثير الخشب", fr: "Aspect Bois" },
    price: 68,
    image: "https://images.unsplash.com/photo-1783125127015-bf513362480b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
    sizes: ["15×90", "20×120", "30×120"],
    accent: "#a0724e",
  },
  {
    id: "ash-whitewash",
    name: { en: "Ash Whitewash", ar: "آش وايت واش", fr: "Frêne Blanchi" },
    material: { en: "Wood Look", ar: "تأثير الخشب", fr: "Aspect Bois" },
    price: 58,
    image: "https://images.unsplash.com/photo-1769736438943-3c57cbd02c22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
    sizes: ["20×120", "30×120"],
    accent: "#c4b89a",
  },
  {
    id: "metro-ceramic",
    name: { en: "Metro Ceramic", ar: "مترو سيراميك", fr: "Métro Céramique" },
    material: { en: "Ceramic", ar: "سيراميك", fr: "Céramique" },
    price: 42,
    image: "https://images.unsplash.com/photo-1676662241666-9c6f073021af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
    sizes: ["10×20", "10×30", "7.5×30"],
    accent: "#e0d0b8",
  },
  {
    id: "colori-vivo",
    name: { en: "Colori Vivo", ar: "كولوري فيفو", fr: "Couleurs Vives" },
    material: { en: "Decorative", ar: "زخرفي", fr: "Décoratif" },
    price: 55,
    image: "https://images.unsplash.com/photo-1762633203398-d4432b5269b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
    sizes: ["10×10", "20×20", "30×30"],
    accent: "#e8824a",
  },
  {
    id: "pietra-grigia",
    name: { en: "Pietra Grigia", ar: "بييترا جريجيا", fr: "Pierre Grise" },
    material: { en: "Stone Look", ar: "تأثير الحجر", fr: "Aspect Pierre" },
    price: 79,
    image: "https://images.unsplash.com/photo-1765556556784-7656ee0a1bd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
    sizes: ["30×60", "60×60", "60×120"],
    accent: "#8090a0",
  },
];

// Re-export as MATERIAL_LOOKS for backward compat with TileShowroom
export const MATERIAL_LOOKS = TILES;

// Triplicate for seamless infinite loop
const LOOP: TileProduct[] = [...TILES, ...TILES, ...TILES];
const TILE_COUNT = TILES.length;

// ─── Single tile card ────────────────────────────────────────────

function TileCard({
  tile,
  isActive,
  hasAnyActive,
  onSelect,
}: {
  tile: TileProduct;
  isActive: boolean;
  hasAnyActive: boolean;
  onSelect: () => void;
}) {
  const { locale } = useI18n();
  const wrapRef  = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLImageElement>(null);
  const glossRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el || isActive) return;
    const r  = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top)  / r.height;
    el.style.transform = `perspective(900px) rotateX(${(ny - 0.5) * -10}deg) rotateY(${(nx - 0.5) * 14}deg) scale(1.03)`;
    if (imgRef.current)
      imgRef.current.style.transform = `scale(1.12) translate(${(0.5 - nx) * 20}px, ${(0.5 - ny) * 14}px)`;
    if (glossRef.current)
      glossRef.current.style.background = `radial-gradient(circle 280px at ${nx * 100}% ${ny * 100}%, rgba(255,255,255,0.18), transparent 60%)`;
  }, [isActive]);

  const onLeave = useCallback(() => {
    if (wrapRef.current && !isActive)
      wrapRef.current.style.transform = "";
    if (imgRef.current)
      imgRef.current.style.transform = "scale(1.06)";
    if (glossRef.current)
      glossRef.current.style.background = "transparent";
    setHovered(false);
  }, [isActive]);

  // Apply active state transform directly to DOM
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (isActive) {
      el.style.transform = "scale(1.05)";
      el.style.transition = "transform 0.42s cubic-bezier(0.22,1,0.36,1), box-shadow 0.42s ease, opacity 0.35s ease";
    } else {
      el.style.transform = "";
      el.style.transition = "transform 0.38s cubic-bezier(0.22,1,0.36,1), box-shadow 0.44s ease, opacity 0.35s ease";
    }
  }, [isActive]);

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={() => setHovered(true)}
      onClick={onSelect}
      style={{
        position: "relative",
        height: "100%",
        borderRadius: "var(--idea-radius-lg)",
        overflow: "hidden",
        willChange: "transform",
        cursor: "pointer",
        opacity: hasAnyActive && !isActive ? 0.5 : 1,
        boxShadow: isActive
          ? `0 0 0 2.5px ${tile.accent}, 0 28px 72px rgba(0,0,0,0.52)`
          : hovered
            ? `0 24px 64px rgba(0,0,0,0.40)`
            : `0 8px 32px rgba(0,0,0,0.28)`,
      }}
    >
      {/* Room photography */}
      <img
        ref={imgRef}
        src={tile.image}
        alt={tile.name[locale as Locale]}
        draggable={false}
        loading="lazy"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center",
          transform: "scale(1.06)",
          transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: "none",
          userSelect: "none",
          filter: "saturate(1.12) contrast(1.04) brightness(1.02)",
        }}
      />

      {/* Dark gradient vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.06) 100%)",
        pointerEvents: "none",
      }} />

      {/* Accent warm wash bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "45%",
        background: `linear-gradient(0deg, ${tile.accent}30 0%, transparent 100%)`,
        pointerEvents: "none",
      }} />

      {/* Cursor-follow gloss */}
      <div ref={glossRef} style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        transition: "background 0.08s linear",
      }} />

      {/* Active selection ring glow */}
      {isActive && (
        <div style={{
          position: "absolute", inset: 0,
          boxShadow: `inset 0 0 0 2px ${tile.accent}`,
          borderRadius: "var(--idea-radius-lg)",
          pointerEvents: "none",
        }} />
      )}

      {/* TOP: material category badge */}
      <div style={{
        position: "absolute", top: "var(--idea-space-3)", left: "var(--idea-space-3)",
        background: "rgba(0,0,0,0.52)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: `1px solid ${tile.accent}55`,
        borderRadius: "var(--idea-radius-full)",
        padding: "5px 13px",
        fontFamily: "var(--idea-font-display)",
        fontSize: "var(--idea-text-xs)",
        letterSpacing: "0.12em",
        color: tile.accent,
        textTransform: "uppercase",
        pointerEvents: "none",
      }}>
        {tile.material[locale as Locale]}
      </div>

      {/* BOTTOM: tile name + price hint + tap cue */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "var(--idea-space-5) var(--idea-space-4) var(--idea-space-4)",
        pointerEvents: "none",
      }}>
        {/* Accent line */}
        <div style={{
          height: 2, width: isActive ? 44 : 22,
          background: tile.accent,
          borderRadius: 1,
          marginBottom: "var(--idea-space-2)",
          transition: "width 0.45s cubic-bezier(0.22,1,0.36,1)",
        }} />

        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", gap: 8,
        }}>
          <div>
            <div style={{
              fontFamily: "var(--idea-font-display)",
              fontSize: "clamp(17px, 2.2vw, 22px)",
              fontWeight: 500,
              color: "rgba(255,255,255,0.96)",
              letterSpacing: "0.02em",
              lineHeight: 1.15,
              marginBottom: 3,
            }}>
              {tile.name[locale as Locale]}
            </div>
            {tile.price > 0 && (
              <div style={{
                fontFamily: "var(--idea-font-body)",
                fontSize: "var(--idea-text-xs)",
                color: "rgba(255,255,255,0.48)",
                letterSpacing: "0.06em",
              }}>
                {locale === "ar" ? `من ${tile.price} جنيه/م²` : `from ${tile.price} EGP/m²`}
              </div>
            )}
          </div>

          <div style={{
            width: 38, height: 38, flexShrink: 0,
            borderRadius: "var(--idea-radius-full)",
            border: `1.5px solid ${tile.accent}aa`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: tile.accent,
          }}>
            {isActive ? <X size={13} /> : <ArrowRight size={13} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Detail panel (shown below strip when a tile is selected) ────────────────

function DetailPanel({
  tile,
  onClose,
  locale,
}: {
  tile: TileProduct | null;
  onClose: () => void;
  locale: string;
}) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const isOpen = tile !== null;

  useEffect(() => {
    if (tile) setSelectedSize(tile.sizes[0]);
  }, [tile?.id]);

  const t = tile;

  const priceLabel   = locale === "ar" ? "السعر / م²" : locale === "fr" ? "Prix / m²" : "Price / m²";
  const sizeLabel    = locale === "ar" ? "اختر المقاس" : locale === "fr" ? "Choisir la taille" : "Choose Size";
  const exploreLabel = locale === "ar" ? "استعرض المجموعة" : locale === "fr" ? "Explorer la collection" : "Explore Collection";

  return (
    <div style={{
      maxHeight: isOpen ? "340px" : "0px",
      overflow: "hidden",
      transition: "max-height 0.55s cubic-bezier(0.22,1,0.36,1)",
    }}>
      {t && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: "var(--idea-space-5)",
            background: "var(--idea-surface)",
            borderTop: `3px solid ${t.accent}`,
            padding: "var(--idea-space-5) var(--idea-space-7)",
            position: "relative",
          }}
          className="idea-ls-panel"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "var(--idea-space-4)", right: "var(--idea-space-4)",
              background: "var(--idea-bg-2)",
              border: "var(--idea-hairline)",
              borderRadius: "var(--idea-radius-full)",
              width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              color: "var(--idea-text-muted)",
              fontFamily: "var(--idea-font-body)",
              fontSize: "var(--idea-text-xs)",
              gap: 4,
            }}
          >
            <X size={13} />
          </button>

          {/* Left: image */}
          <div style={{
            borderRadius: "var(--idea-radius-md)",
            overflow: "hidden",
            height: 220,
            flexShrink: 0,
          }}>
            <img
              src={t.image}
              alt={t.name[locale as Locale]}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
          </div>

          {/* Right: details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--idea-space-4)" }}>
            {/* Name + material */}
            <div>
              <div style={{
                fontFamily: "var(--idea-font-body)",
                fontSize: "var(--idea-text-xs)",
                color: t.accent,
                textTransform: "uppercase",
                letterSpacing: "var(--idea-tracking-wide)",
                marginBottom: 4,
              }}>
                {t.material[locale as Locale]}
              </div>
              <div style={{
                fontFamily: "var(--idea-font-display)",
                fontSize: "clamp(20px, 2.4vw, 28px)",
                color: "var(--idea-text)",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}>
                {t.name[locale as Locale]}
              </div>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--idea-space-4)" }}>
              <div>
                <div style={{
                  fontFamily: "var(--idea-font-body)",
                  fontSize: "var(--idea-text-xs)",
                  color: "var(--idea-text-muted)",
                  letterSpacing: "0.06em",
                  marginBottom: 2,
                }}>
                  {priceLabel}
                </div>
                {t.price > 0 ? (
                  <div style={{
                    fontFamily: "var(--idea-font-display)",
                    fontSize: "var(--idea-text-xl)",
                    color: "var(--idea-gold-bright)",
                    fontWeight: 500,
                  }}>
                    {t.price} <span style={{ fontSize: "var(--idea-text-sm)", color: "var(--idea-text-muted)" }}>EGP</span>
                  </div>
                ) : (
                  <div style={{
                    fontFamily: "var(--idea-font-display)",
                    fontSize: "var(--idea-text-base)",
                    color: "var(--idea-text-muted)",
                  }}>
                    {locale === "ar" ? "السعر عند الطلب" : "Price on request"}
                  </div>
                )}
              </div>
            </div>

            {/* Size selector */}
            <div>
              <div style={{
                fontFamily: "var(--idea-font-body)",
                fontSize: "var(--idea-text-xs)",
                color: "var(--idea-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "var(--idea-space-2)",
              }}>
                {sizeLabel}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--idea-space-2)" }}>
                {t.sizes.map((size) => {
                  const active = size === selectedSize;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        background: active ? t.accent : "var(--idea-bg-2)",
                        border: active ? `1.5px solid ${t.accent}` : "var(--idea-hairline)",
                        borderRadius: "var(--idea-radius-full)",
                        padding: "6px 14px",
                        fontFamily: "var(--idea-font-body)",
                        fontSize: "var(--idea-text-sm)",
                        color: active ? "#fff" : "var(--idea-text)",
                        cursor: "pointer",
                        transition: "all 0.22s ease",
                        fontWeight: active ? 500 : 400,
                      }}
                    >
                      {size} cm
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/surface-styles"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--idea-space-2)",
                background: "var(--idea-gold-bright)",
                color: "var(--idea-on-gold)",
                fontFamily: "var(--idea-font-display)",
                fontSize: "var(--idea-text-sm)",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "10px var(--idea-space-5)",
                borderRadius: "var(--idea-radius-full)",
                width: "fit-content",
                transition: "background 0.22s ease",
              }}
              className="idea-ls-cta"
            >
              {exploreLabel}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main carousel strip ───────────────────────────────────────────

export function MaterialLookStrip() {
  const { locale } = useI18n();

  const stripRef       = useRef<HTMLDivElement>(null);
  const singleWidthRef = useRef(0);
  const dragging       = useRef(false);
  const lastX          = useRef(0);
  const velRef         = useRef(0);
  const didMove        = useRef(false);
  const rafRef         = useRef<number>();
  const autoRafRef     = useRef<number>();

  const [cursor,     setCursor]     = useState<"grab" | "grabbing">("grab");
  const [activeTile, setActiveTile] = useState<TileProduct | null>(null);
  const activeTileRef = useRef<TileProduct | null>(null);

  const setActive = useCallback((tile: TileProduct | null) => {
    activeTileRef.current = tile;
    setActiveTile(tile);
  }, []);

  // ── Measure single copy width after mount ───────────────────────
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const measure = () => {
      const cards = strip.querySelectorAll("[data-ls-card]");
      if (cards.length >= TILE_COUNT * 2) {
        const c0 = (cards[0] as HTMLElement).offsetLeft;
        const cN = (cards[TILE_COUNT] as HTMLElement).offsetLeft;
        singleWidthRef.current = cN - c0;
        strip.scrollLeft = singleWidthRef.current;
      }
    };

    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, []);

  // ── Seamless wrap helper ───────────────────────────────────────
  const wrapScroll = useCallback(() => {
    const strip = stripRef.current;
    const sw = singleWidthRef.current;
    if (!strip || sw <= 0) return;
    const sl = strip.scrollLeft;
    if (sl >= 2 * sw) { strip.scrollLeft = sl - sw; }
    else if (sl < sw * 0.02) { strip.scrollLeft = sl + sw; }
  }, []);

  // ── Auto-scroll rAF loop ────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      if (!dragging.current && !activeTileRef.current) {
        const strip = stripRef.current;
        if (strip) {
          strip.scrollLeft += 0.55;
          wrapScroll();
        }
      }
      autoRafRef.current = requestAnimationFrame(tick);
    };
    autoRafRef.current = requestAnimationFrame(tick);
    return () => { if (autoRafRef.current) cancelAnimationFrame(autoRafRef.current); };
  }, [wrapScroll]);

  // ── Drag logic ────────────────────────────────────────────
  const startDrag = useCallback((clientX: number) => {
    dragging.current = true;
    didMove.current  = false;
    lastX.current    = clientX;
    velRef.current   = 0;
    setCursor("grabbing");
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (stripRef.current) stripRef.current.style.transition = "none";
  }, []);

  const moveDrag = useCallback((clientX: number) => {
    if (!dragging.current || !stripRef.current) return;
    const dx = lastX.current - clientX;
    if (Math.abs(dx) > 2) didMove.current = true;
    velRef.current = dx * 0.6 + velRef.current * 0.4;
    stripRef.current.scrollLeft += dx;
    lastX.current = clientX;
  }, []);

  const endDrag = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    setCursor("grab");

    if (stripRef.current && didMove.current) {
      stripRef.current.dataset.dragged = "1";
      setTimeout(() => { if (stripRef.current) delete stripRef.current.dataset.dragged; }, 220);
    }

    const step = () => {
      velRef.current *= 0.90;
      if (stripRef.current) stripRef.current.scrollLeft += velRef.current;
      wrapScroll();
      if (Math.abs(velRef.current) > 0.3) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [wrapScroll]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  // Mouse handlers
  const onMouseDown  = (e: React.MouseEvent) => { e.preventDefault(); startDrag(e.clientX); };
  const onMouseMove  = (e: React.MouseEvent) => moveDrag(e.clientX);
  const onMouseUp    = () => endDrag();
  const onMouseLeave = () => { if (dragging.current) endDrag(); };

  // iOS non-passive touch handlers
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const onTS = (e: TouchEvent) => { startDrag(e.touches[0].clientX); };
    const onTM = (e: TouchEvent) => {
      e.preventDefault();
      moveDrag(e.touches[0].clientX);
    };
    const onTE = () => endDrag();
    el.addEventListener("touchstart",  onTS, { passive: true  });
    el.addEventListener("touchmove",   onTM, { passive: false });
    el.addEventListener("touchend",    onTE);
    el.addEventListener("touchcancel", onTE);
    return () => {
      el.removeEventListener("touchstart",  onTS);
      el.removeEventListener("touchmove",   onTM);
      el.removeEventListener("touchend",    onTE);
      el.removeEventListener("touchcancel", onTE);
    };
  }, [startDrag, moveDrag, endDrag]);

  // ── Card selection — center selected card ───────────────────────
  const handleCardSelect = useCallback((tile: TileProduct, cardEl: HTMLElement | null) => {
    if (activeTileRef.current?.id === tile.id) {
      setActive(null);
      return;
    }
    setActive(tile);
    if (cardEl && stripRef.current) {
      const strip = stripRef.current;
      const cardCenter = cardEl.offsetLeft + cardEl.offsetWidth / 2;
      const targetScroll = cardCenter - strip.clientWidth / 2;
      strip.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  }, [setActive]);

  const eyebrow = locale === "ar" ? "اكتشف الخامات" : locale === "fr" ? "Explorer les matériaux" : "Shop by Material";
  const heading = locale === "ar" ? "اختر السيراميك المثالي" : locale === "fr" ? "Trouvez votre carrelage idéal" : "Find Your Perfect Tile";

  return (
    <section style={{ background: "var(--idea-bg-2)", paddingBottom: "var(--idea-space-7)", overflowX: "hidden" }}>

      {/* ── Section header ───────────────────────────────────────────── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        padding: "var(--idea-space-8) var(--idea-space-7) var(--idea-space-5)",
        flexWrap: "wrap", gap: "var(--idea-space-4)",
      }}>
        <div>
          <div style={{
            display: "flex", alignItems: "center",
            gap: "var(--idea-space-2)", marginBottom: "var(--idea-space-2)",
          }}>
            <div style={{ width: 24, height: 2, background: "var(--idea-gold-bright)", borderRadius: 1 }} />
            <span style={{
              fontFamily: "var(--idea-font-display)",
              fontSize: "var(--idea-text-xs)",
              letterSpacing: "var(--idea-tracking-wide)",
              color: "var(--idea-gold-bright)",
              textTransform: "uppercase",
            }}>{eyebrow}</span>
          </div>
          <h2 style={{
            fontFamily: "var(--idea-font-display)",
            fontSize: "clamp(22px, 3vw, 32px)",
            color: "var(--idea-text)",
            margin: 0, fontWeight: 500,
            letterSpacing: "0.03em", lineHeight: 1.15,
          }}>{heading}</h2>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: "var(--idea-space-2)",
          fontFamily: "var(--idea-font-body)",
          fontSize: "var(--idea-text-xs)",
          color: "var(--idea-text-faint)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          userSelect: "none",
        }}>
          <ChevronLeft size={13} />
          {locale === "ar" ? "اسحب لاستكشاف" : locale === "fr" ? "Glisser pour explorer" : "Drag to explore"}
          <ChevronRight size={13} />
        </div>
      </div>

      {/* ── Carousel strip ───────────────────────────────────────────── */}
      <div
        ref={stripRef}
        className="idea-ls-strip"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "var(--idea-space-3)",
          padding: "var(--idea-space-2) var(--idea-space-7) var(--idea-space-4)",
          height: "clamp(360px, 55vh, 600px)",
          scrollbarWidth: "none",
          cursor,
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {LOOP.map((tile, i) => {
          const cardRef = { current: null as HTMLDivElement | null };
          return (
            <div
              key={`${tile.id}-${i}`}
              data-ls-card
              ref={cardRef}
              style={{
                flex: "0 0 clamp(240px, 28vw, 380px)",
                height: "100%",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <TileCard
                tile={tile}
                isActive={activeTile?.id === tile.id}
                hasAnyActive={activeTile !== null}
                onSelect={() => {
                  const parentEl = (document.querySelectorAll("[data-ls-card]")[i] as HTMLElement) ?? null;
                  handleCardSelect(tile, parentEl);
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ── Detail panel ─────────────────────────────────────────────── */}
      <DetailPanel tile={activeTile} onClose={() => setActive(null)} locale={locale} />

      {/* ── Scoped CSS ────────────────────────────────────────────────── */}
      <style>{`
        .idea-ls-strip::-webkit-scrollbar { display: none; }
        .idea-ls-strip { touch-action: none; }

        .idea-ls-cta:hover {
          background: var(--idea-gold-deep) !important;
        }

        .idea-ls-panel {
          animation: idea-ls-panel-in 0.42s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes idea-ls-panel-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .idea-ls-panel {
            grid-template-columns: 1fr !important;
          }
          .idea-ls-panel > :first-child {
            height: 160px !important;
          }
        }

        @media (max-width: 760px) {
          .idea-ls-strip {
            padding-inline: var(--idea-space-4) !important;
          }
        }

        @media (max-width: 480px) {
          .idea-ls-strip {
            padding-inline: var(--idea-space-3) !important;
          }
          .idea-ls-strip [data-ls-card] {
            flex: 0 0 82vw !important;
          }
        }
      `}</style>
    </section>
  );
}
