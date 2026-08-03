import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "../i18n/i18n";
import { Button, Container } from "./ui";
// User-imported luxury Black & Gold interior photography — used as hero visuals.
import imgTriptych from "../../imports/Luxurious_modern_interior_triptych_design.png";
import imgLivingRoom from "../../imports/Modern_luxury_living_room_ambiance.png";
import imgMarbleGold from "../../imports/Luxurious_modern_interiors_with_marble_and_gold.png";

interface Slide {
  id: string;
  headline: { en: string; ar: string; fr: string };
  text: { en: string; ar: string; fr: string };
  image: string;
  buttons: { label: { en: string; ar: string; fr: string }; to: string; variant: "gold" | "outline" }[];
}

const SLIDES: Slide[] = [
  {
    id: "premium-bathroom", image: imgTriptych,
    headline: { en: "Define Your Space With Perfection", ar: "اصنع مساحتك بإتقان", fr: "Définissez votre espace avec perfection" },
    text: { en: "Discover premium ceramics, porcelain and complete bathroom solutions created for exceptional interiors.", ar: "اكتشف السيراميك والبورسلين وحلول الحمامات المتكاملة المصممة للديكورات الاستثنائية.", fr: "Découvrez céramiques, porcelaines et solutions complètes de salle de bain pour des intérieurs exceptionnels." },
    buttons: [
      { label: { en: "Explore Collections", ar: "استكشف المجموعات", fr: "Explorer les collections" }, to: "/collections", variant: "gold" },
      { label: { en: "Visualize Your Room", ar: "تصور غرفتك", fr: "Visualisez votre pièce" }, to: "/ai-room-visualizer", variant: "outline" },
    ],
  },
  {
    id: "ai-visualizer", image: imgLivingRoom,
    headline: { en: "See It Inside Your Space Before You Buy", ar: "شاهدها في مساحتك قبل الشراء", fr: "Visualisez-le chez vous avant d'acheter" },
    text: { en: "Upload your bathroom, kitchen or living room, select a real IDEA product and experience the finished result before installation.", ar: "ارفع صورة حمامك أو مطبخك أو غرفتك، اختر منتج IDEA حقيقي، وشاهد النتيجة النهائية قبل التركيب.", fr: "Téléchargez votre salle de bain, cuisine ou salon, choisissez un produit IDEA et découvrez le résultat final avant l'installation." },
    buttons: [
      { label: { en: "Start AI Visualization", ar: "ابدأ المحاكاة", fr: "Démarrer la visualisation" }, to: "/room-designer/new", variant: "gold" },
      { label: { en: "Browse Porcelain", ar: "تصفح البورسلين", fr: "Voir la porcelaine" }, to: "/collections/porcelain", variant: "outline" },
    ],
  },
  {
    id: "supplier-offers", image: imgMarbleGold,
    headline: { en: "One Request. Multiple Qualified Offers.", ar: "طلب واحد. عروض متعددة مؤهلة.", fr: "Une demande. Plusieurs offres qualifiées." },
    text: { en: "Select the product and required quantity, then receive private offers from verified matching suppliers.", ar: "اختر المنتج والكمية المطلوبة، ثم احصل على عروض خاصة من موردين معتمدين.", fr: "Sélectionnez le produit et la quantité, puis recevez des offres privées de fournisseurs vérifiés." },
    buttons: [
      { label: { en: "Request Best Price", ar: "اطلب أفضل سعر", fr: "Demander le meilleur prix" }, to: "/request-quote/new", variant: "gold" },
      { label: { en: "How It Works", ar: "كيف يعمل", fr: "Comment ça marche" }, to: "/how-it-works", variant: "outline" },
    ],
  },
  {
    id: "complete-collections", image: imgLivingRoom,
    headline: { en: "Every Surface. Every Detail. One Destination.", ar: "كل سطح. كل تفصيلة. وجهة واحدة.", fr: "Chaque surface. Chaque détail. Une destination." },
    text: { en: "Explore ceramic, porcelain, faucets, bathroom sets, units, bathtubs, shower systems and accessories in one curated marketplace.", ar: "استكشف السيراميك والبورسلين والخلاطات وأطقم الحمام والوحدات والأحواض وأنظمة الدش والإكسسوارات في سوق واحد منسق.", fr: "Explorez céramique, porcelaine, robinetterie, ensembles, meubles, baignoires, douches et accessoires dans une seule marketplace." },
    buttons: [
      { label: { en: "Browse All Products", ar: "تصفح كل المنتجات", fr: "Voir tous les produits" }, to: "/products", variant: "gold" },
      { label: { en: "Bathroom Collections", ar: "مجموعات الحمام", fr: "Collections salle de bain" }, to: "/collections/sanitary-ware", variant: "outline" },
    ],
  },
];

const INTERVAL = 6000;

export function HeroCarousel() {
  const { locale } = useI18n();
  const nav = useNavigate();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const go = useCallback((n: number) => setIndex((i) => (n + SLIDES.length) % SLIDES.length), []);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(id);
  }, [paused, reduced]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  return (
    <section
      aria-roledescription="carousel" aria-label="IDEA highlights" tabIndex={0} onKeyDown={onKey}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
        touchX.current = null;
      }}
      style={{ position: "relative", height: "min(88vh, 780px)", overflow: "hidden", outline: "none", background: "var(--idea-bg)" }}
    >
      {SLIDES.map((s, i) => (
        <div key={s.id} aria-hidden={i !== index} role="group" aria-roledescription="slide"
          style={{
            position: "absolute", inset: 0, transition: reduced ? "none" : "opacity 1s ease",
            opacity: i === index ? 1 : 0, pointerEvents: i === index ? "auto" : "none",
          }}>
          <img src={s.image} alt="" loading={i === 0 ? "eager" : "lazy"}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: i === index && !reduced ? "scale(1.06)" : "scale(1)", transition: "transform 7s ease" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(6,6,8,.9) 0%, rgba(6,6,8,.55) 45%, rgba(6,6,8,.15) 100%)" }} />
          <Container style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ maxWidth: 640 }}>
              <div className="idea-eyebrow" style={{ marginBottom: "var(--idea-space-4)", color: "#f2d47a" }}>IDEA · Luxury Surfaces</div>
              <h1 className="idea-hero-title" style={{ fontSize: "var(--idea-text-hero)", margin: 0, color: "#f6f1e6" }}>{s.headline[locale]}</h1>
              <p style={{ color: "rgba(246,241,230,.78)", fontSize: "var(--idea-text-lg)", lineHeight: 1.6, margin: "var(--idea-space-5) 0 var(--idea-space-6)" }}>{s.text[locale]}</p>
              <div style={{ display: "flex", gap: "var(--idea-space-4)", flexWrap: "wrap" }}>
                {s.buttons.map((b) => (
                  <Button key={b.to} variant={b.variant} size="lg" onClick={() => nav(b.to)}>{b.label[locale]}</Button>
                ))}
              </div>
            </div>
          </Container>
        </div>
      ))}

      {/* Controls */}
      <button aria-label="Previous slide" onClick={prev} style={arrowStyle("start")}><ChevronLeft size={22} /></button>
      <button aria-label="Next slide" onClick={next} style={arrowStyle("end")}><ChevronRight size={22} /></button>

      {/* Pagination */}
      <div style={{ position: "absolute", bottom: 116, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 10 }}>
        {SLIDES.map((s, i) => (
          <button key={s.id} aria-label={`Go to slide ${i + 1}`} aria-current={i === index} onClick={() => go(i)}
            style={{ width: i === index ? 34 : 12, height: 4, borderRadius: 999, border: "none", cursor: "pointer", transition: "all .3s", background: i === index ? "var(--idea-gold)" : "rgba(255,255,255,.35)" }} />
        ))}
      </div>
    </section>
  );
}

function arrowStyle(side: "start" | "end"): React.CSSProperties {
  return {
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    insetInlineStart: side === "start" ? 20 : undefined, insetInlineEnd: side === "end" ? 20 : undefined,
    width: 48, height: 48, borderRadius: 999, display: "grid", placeItems: "center", cursor: "pointer",
    background: "rgba(20,19,23,.6)", border: "1px solid var(--idea-border)", color: "var(--idea-gold-bright)", backdropFilter: "blur(6px)",
  };
}
