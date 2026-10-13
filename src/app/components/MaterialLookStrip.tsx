import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useI18n } from "../i18n/i18n";
import type { Locale } from "../data/types";

// ─── Catalog data ────────────────────────────────────────────────────────────

export const MATERIAL_LOOKS = [
  {
    id: "marble",
    label: { en: "Marble Look", ar: "تأثير الرخام", fr: "Aspect Marbre" } as Record<Locale, string>,
    sub: { en: "Natural veining & luxury surfaces", ar: "عروق طبيعية وأسطح فاخرة", fr: "Veines naturelles et surfaces de luxe" } as Record<Locale, string>,
    image: "https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    tileImage: "https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    featured: ["Calacatta Oro", "Carrara White"],
  },
  {
    id: "wood",
    label: { en: "Wood Look", ar: "تأثير الخشب", fr: "Aspect Bois" } as Record<Locale, string>,
    sub: { en: "Warm grain & natural timber finishes", ar: "حبوب دافئة ولمسات خشبية", fr: "Grain chaud et finitions bois" } as Record<Locale, string>,
    image: "https://images.unsplash.com/photo-1603323978104-4c1c0d1bfc72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    tileImage: "https://images.unsplash.com/photo-1603323978104-4c1c0d1bfc72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    featured: ["Oak Natural", "Walnut Dark"],
  },
  {
    id: "stone",
    label: { en: "Stone Look", ar: "تأثير الحجر", fr: "Aspect Pierre" } as Record<Locale, string>,
    sub: { en: "Granite, slate & raw earth tones", ar: "جرانيت وأردواز وألوان ترابية", fr: "Granit, ardoise et tons terres" } as Record<Locale, string>,
    image: "https://images.unsplash.com/photo-1566305977571-5666677c6e98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    tileImage: "https://images.unsplash.com/photo-1566305977571-5666677c6e98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    featured: ["Grigio Cemento", "Antracite"],
  },
  {
    id: "pattern",
    label: { en: "Pattern Look", ar: "تأثير النقشة", fr: "Aspect Motif" } as Record<Locale, string>,
    sub: { en: "Mosaic, geometric & decorative art", ar: "فسيفساء وهندسي وزخرفي", fr: "Mosaïque, géométrique et décoratif" } as Record<Locale, string>,
    image: "https://images.unsplash.com/photo-1584354273341-3eb96574e5be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    tileImage: "https://images.unsplash.com/photo-1584354273341-3eb96574e5be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    featured: ["Geometric Art", "Arabesque"],
  },
  {
    id: "colour",
    label: { en: "Colour Look", ar: "تأثير الألوان", fr: "Aspect Couleur" } as Record<Locale, string>,
    sub: { en: "Bold hues & expressive palettes", ar: "ألوان جريئة ولوحات معبّرة", fr: "Teintes vives et palettes expressives" } as Record<Locale, string>,
    image: "https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    tileImage: "https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    featured: ["Teal Gloss", "Terracotta"],
  },
];

const LOOK_PALETTE: Record<string, {
  accent: string;
  glow: string;
  overlayTop: string;
  overlayBot: string;
  n: string;
}> = {
  marble:  {
    accent: "#e2d4b4",
    glow: "rgba(226,212,180,0.40)",
    overlayTop: "linear-gradient(148deg, rgba(230,218,190,0.22) 0%, rgba(200,185,155,0.10) 45%, transparent 70%)",
    overlayBot: "linear-gradient(0deg, rgba(226,212,180,0.28) 0%, transparent 100%)",
    n: "01",
  },
  wood: {
    accent: "#c07830",
    glow: "rgba(192,120,48,0.48)",
    overlayTop: "linear-gradient(148deg, rgba(140,80,20,0.30) 0%, rgba(100,55,10,0.14) 45%, transparent 70%)",
    overlayBot: "linear-gradient(0deg, rgba(192,120,48,0.30) 0%, transparent 100%)",
    n: "02",
  },
  stone: {
    accent: "#6a94ae",
    glow: "rgba(106,148,174,0.42)",
    overlayTop: "linear-gradient(148deg, rgba(60,90,115,0.28) 0%, rgba(40,65,85,0.12) 45%, transparent 70%)",
    overlayBot: "linear-gradient(0deg, rgba(106,148,174,0.28) 0%, transparent 100%)",
    n: "03",
  },
  pattern: {
    accent: "#a8527c",
    glow: "rgba(168,82,124,0.44)",
    overlayTop: "linear-gradient(148deg, rgba(120,40,80,0.32) 0%, rgba(80,25,55,0.14) 45%, transparent 70%)",
    overlayBot: "linear-gradient(0deg, rgba(168,82,124,0.30) 0%, transparent 100%)",
    n: "04",
  },
  colour: {
    accent: "#2aaa88",
    glow: "rgba(42,170,136,0.42)",
    overlayTop: "linear-gradient(148deg, rgba(20,110,85,0.30) 0%, rgba(10,75,58,0.12) 45%, transparent 70%)",
    overlayBot: "linear-gradient(0deg, rgba(42,170,136,0.28) 0%, transparent 100%)",
    n: "05",
  },
};

const GRAIN_URL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

function LookCard({ look, idx }: { look: typeof MATERIAL_LOOKS[0]; idx: number }) {
  const { locale } = useI18n();
  const pal = LOOK_PALETTE[look.id] ?? LOOK_PALETTE.marble;

  const wrapRef   = useRef<HTMLDivElement>(null);
  const imgRef    = useRef<HTMLImageElement>(null);
  const glossRef  = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top)  / r.height;
    const rx = (ny - 0.5) * -11;
    const ry = (nx - 0.5) *  16;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(14px)`;
    const img = imgRef.current;
    if (img) img.style.transform = `scale(1.14) translate(${(0.5 - nx) * 22}px, ${(0.5 - ny) * 15}px)`;
    const g = glossRef.current;
    if (g) g.style.background = `radial-gradient(circle 320px at ${nx * 100}% ${ny * 100}%, rgba(255,255,255,0.18), transparent 62%)`;
  }, []);

  const onLeave = useCallback(() => {
    const el = wrapRef.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    const img = imgRef.current;
    if (img) img.style.transform = "scale(1.07) translate(0,0)";
    const g = glossRef.current;
    if (g) g.style.background = "transparent";
    setHovered(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 52, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-55px" }}
      transition={{ duration: 0.76, ease: [0.22, 1, 0.36, 1], delay: idx * 0.08 }}
      style={{ flex: "0 0 34vw", minWidth: 252, maxWidth: 480, height: "100%", scrollSnapAlign: "start" }}
    >
      <div
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onMouseEnter={() => setHovered(true)}
        style={{
          position: "relative",
          height: "100%",
          borderRadius: "var(--idea-radius-lg)",
          overflow: "hidden",
          transformStyle: "preserve-3d",
          willChange: "transform",
          transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.42s ease",
          boxShadow: hovered
            ? `0 40px 90px rgba(0,0,0,0.62), 0 0 65px ${pal.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`
            : `0 10px 44px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.06)`,
          cursor: "pointer",
        }}
      >
        <Link to={`/tile-showroom/${look.id}`} style={{ display: "block", height: "100%", textDecoration: "none", color: "inherit" }}>
          <img
            ref={imgRef}
            src={look.image}
            alt={look.label[locale as Locale]}
            loading="lazy"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center",
              transform: "scale(1.07) translate(0,0)",
              transition: "transform 0.44s cubic-bezier(0.22,1,0.36,1)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: pal.overlayTop, mixBlendMode: "overlay", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.06) 100%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: pal.overlayBot, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN_URL, backgroundSize: "220px 220px", backgroundRepeat: "repeat", opacity: 0.045, mixBlendMode: "overlay", pointerEvents: "none" }} />
          <div ref={glossRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", transition: "background 0.06s linear" }} />
          <div className={`idea-ls-sweep idea-ls-sweep--${look.id}`} style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "36%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 55%, transparent)", transform: "skewX(-13deg)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "18px 20px 0", pointerEvents: "none" }}>
            <div style={{ fontFamily: "var(--idea-font-display)", fontSize: 78, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.025em", color: hovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)", transition: "color 0.4s ease", userSelect: "none" }}>{pal.n}</div>
            <div style={{ background: "rgba(0,0,0,0.52)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: `1px solid ${pal.accent}55`, borderRadius: "var(--idea-radius-full)", padding: "6px 14px", fontFamily: "var(--idea-font-display)", fontSize: "var(--idea-text-xs)", letterSpacing: "0.13em", color: pal.accent, textTransform: "uppercase", marginTop: 6, flexShrink: 0 }}>{look.label[locale as Locale]}</div>
          </div>
          <div style={{ position: "absolute", top: 98, left: 20, display: "flex", flexDirection: "column", gap: 2, pointerEvents: "none" }}>
            {look.featured.map(name => (<span key={name} style={{ fontFamily: "var(--idea-font-display)", fontSize: "var(--idea-text-xs)", letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>{name}</span>))}
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 20px 24px", pointerEvents: "none" }}>
            <div style={{ height: 2, borderRadius: 1, background: pal.accent, marginBottom: "var(--idea-space-3)", width: hovered ? 54 : 28, transition: "width 0.45s cubic-bezier(0.22,1,0.36,1)" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--idea-space-3)", marginBottom: "var(--idea-space-2)" }}>
              <div style={{ fontFamily: "var(--idea-font-display)", fontSize: "var(--idea-text-xl)", fontWeight: 500, color: "white", letterSpacing: "0.04em", lineHeight: 1.1 }}>{look.label[locale as Locale]}</div>
              <div style={{ width: 42, height: 42, borderRadius: "var(--idea-radius-full)", border: `1.5px solid ${pal.accent}`, display: "flex", alignItems: "center", justifyContent: "center", color: pal.accent, flexShrink: 0, transform: hovered ? "translateX(6px)" : "translateX(0)", transition: "transform 0.38s cubic-bezier(0.22,1,0.36,1)" }}><ArrowRight size={15} /></div>
            </div>
            <p style={{ margin: 0, fontFamily: "var(--idea-font-body)", fontSize: "var(--idea-text-sm)", color: "rgba(255,255,255,0.48)", lineHeight: 1.65, letterSpacing: "0.01em" }}>{look.sub[locale as Locale]}</p>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

export function MaterialLookStrip() {
  const { locale } = useI18n();
  const stripRef  = useRef<HTMLDivElement>(null);
  const dragging  = useRef(false);
  const lastX     = useRef(0);
  const velRef    = useRef(0);
  const rafRef    = useRef<number>();
  const [cursor, setCursor]   = useState<"grab" | "grabbing">("grab");
  const [lean, setLean]       = useState(0);

  const startDrag = useCallback((clientX: number) => {
    dragging.current = true;
    lastX.current = clientX;
    velRef.current = 0;
    setCursor("grabbing");
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const moveDrag = useCallback((clientX: number) => {
    if (!dragging.current || !stripRef.current) return;
    const dx = lastX.current - clientX;
    velRef.current = dx * 0.65 + velRef.current * 0.35;
    stripRef.current.scrollLeft += dx;
    lastX.current = clientX;
    setLean(Math.max(-2.5, Math.min(2.5, velRef.current * -0.14)));
  }, []);

  const endDrag = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    setCursor("grab");
    const step = () => {
      velRef.current *= 0.925;
      if (stripRef.current) stripRef.current.scrollLeft += velRef.current;
      setLean(v => v * 0.88);
      if (Math.abs(velRef.current) > 0.4) { rafRef.current = requestAnimationFrame(step); } else { setLean(0); }
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const [activeDot, setActiveDot] = useState(0);
  const onScroll = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    const cards = el.querySelectorAll("[data-ls-card]");
    let closest = 0, minDist = Infinity;
    cards.forEach((card, i) => {
      const c = (card as HTMLElement).offsetLeft + (card as HTMLElement).offsetWidth / 2;
      const d = Math.abs(c - center);
      if (d < minDist) { minDist = d; closest = i; }
    });
    setActiveDot(closest);
  }, []);

  const eyebrow = locale === "ar" ? "اكتشف الأسطح" : locale === "fr" ? "Explorer les surfaces" : "Shop by Surface";
  const heading  = locale === "ar" ? "اختر أسلوب سطحك" : locale === "fr" ? "Trouvez votre style de surface" : "Find Your Surface Style";

  return (
    <section style={{ background: "var(--idea-bg-2)", paddingBottom: "var(--idea-space-7)", overflowX: "hidden" }}>
      <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "var(--idea-space-8) var(--idea-space-7) var(--idea-space-5)", flexWrap: "wrap", gap: "var(--idea-space-4)" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--idea-space-2)", marginBottom: "var(--idea-space-2)" }}>
            <div style={{ width: 24, height: 2, background: "var(--idea-gold-bright)", borderRadius: 1 }} />
            <span style={{ fontFamily: "var(--idea-font-display)", fontSize: "var(--idea-text-xs)", letterSpacing: "var(--idea-tracking-wide)", color: "var(--idea-gold-bright)", textTransform: "uppercase" }}>{eyebrow}</span>
          </div>
          <h2 style={{ fontFamily: "var(--idea-font-display)", fontSize: "clamp(22px, 3vw, 32px)", color: "var(--idea-text)", margin: 0, fontWeight: 500, letterSpacing: "0.03em", lineHeight: 1.15 }}>{heading}</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--idea-space-2)", fontFamily: "var(--idea-font-body)", fontSize: "var(--idea-text-xs)", color: "var(--idea-text-faint)", letterSpacing: "0.06em", userSelect: "none" }}>
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M1 7h16M1 7l5-5M1 7l5 5M17 7l-5-5M17 7l-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {locale === "ar" ? "اسحب للتصفح" : locale === "fr" ? "Glisser pour parcourir" : "Drag to explore"}
        </div>
      </motion.div>
      <div style={{ perspective: "1600px", perspectiveOrigin: "50% 50%", paddingInline: "var(--idea-space-7)" }}>
        <div ref={stripRef} onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX); }} onMouseMove={(e) => moveDrag(e.clientX)} onMouseUp={endDrag} onMouseLeave={endDrag} onTouchStart={(e) => startDrag(e.touches[0].clientX)} onTouchMove={(e) => moveDrag(e.touches[0].clientX)} onTouchEnd={endDrag} onScroll={onScroll} className="idea-ls-strip" style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", gap: "var(--idea-space-3)", paddingBottom: "var(--idea-space-4)", height: "clamp(380px, 60vh, 670px)", scrollbarWidth: "none", cursor: cursor, userSelect: "none", WebkitUserSelect: "none", transform: `rotateY(${lean}deg)`, transformStyle: "preserve-3d", transition: dragging.current ? "none" : "transform 0.9s cubic-bezier(0.22,1,0.36,1)", willChange: "transform, scroll-position" }}>
          {MATERIAL_LOOKS.map((look, idx) => (<div key={look.id} data-ls-card style={{ flex: "0 0 34vw", minWidth: 252, maxWidth: 480, height: "100%" }}><LookCard look={look} idx={idx} /></div>))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "var(--idea-space-2)", paddingTop: "var(--idea-space-4)" }}>
        {MATERIAL_LOOKS.map((look, i) => { const pal = LOOK_PALETTE[look.id]; const active = i === activeDot; return (<button key={look.id} aria-label={`Scroll to ${look.label.en}`} className="idea-ls-dot" onClick={() => { const strip = stripRef.current; if (!strip) return; const cards = strip.querySelectorAll("[data-ls-card]"); (cards[i] as HTMLElement)?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" }); }} style={{ width: active ? 24 : 8, height: 8, borderRadius: "var(--idea-radius-full)", border: "none", background: active ? pal.accent : `${pal.accent}55`, cursor: "pointer", padding: 0, transition: "width 0.38s cubic-bezier(0.22,1,0.36,1), background 0.3s ease" }} />); })}
      </div>
      <style>{`
        .idea-ls-strip::-webkit-scrollbar { display: none; }
        @keyframes idea-ls-pass {
          0%, 55%, 100% { left: -42%; opacity: 0; }
          10%, 45%       { opacity: 1; }
          53%            { left: 112%; opacity: 0; }
        }
        .idea-ls-sweep               { animation: idea-ls-pass 11s ease-in-out infinite; }
        .idea-ls-sweep--marble       { animation-delay: 0s; }
        .idea-ls-sweep--wood         { animation-delay: 2.2s; }
        .idea-ls-sweep--stone        { animation-delay: 4.4s; }
        .idea-ls-sweep--pattern      { animation-delay: 6.6s; }
        .idea-ls-sweep--colour       { animation-delay: 8.8s; }
        @media (max-width: 1100px) { .idea-ls-strip [data-ls-card] { flex: 0 0 50vw !important; } }
        @media (max-width: 720px)  { .idea-ls-strip [data-ls-card] { flex: 0 0 80vw !important; } }
        @media (max-width: 480px)  { .idea-ls-strip [data-ls-card] { flex: 0 0 92vw !important; } }
      `}</style>
    </section>
  );
}
