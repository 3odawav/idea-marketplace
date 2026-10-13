import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search, Heart, FileText, Globe, Menu, X, Sun, Moon, User } from "lucide-react";
import { useI18n } from "../i18n/i18n";
import { useTheme } from "../theme/theme";
import { useStore } from "../store/store";
import { useBackend } from "../backend/db";
import type { Locale } from "../data/types";
import { Container } from "./ui";
import { IdeaLogo } from "./IdeaLogo";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
  { code: "fr", label: "FR" },
];

function IconLink({ to, label, count, children }: { to: string; label: string; count?: number; children: React.ReactNode }) {
  return (
    <Link to={to} aria-label={label} style={{ position: "relative", color: "var(--idea-text)", display: "inline-flex" }}>
      {children}
      {count ? (
        <span style={{
          position: "absolute", top: -8, insetInlineEnd: -8, background: "var(--idea-gold)", color: "var(--idea-on-gold)",
          fontSize: 10, minWidth: 16, height: 16, borderRadius: 999, display: "grid", placeItems: "center", padding: "0 3px", fontWeight: 600,
        }}>{count}</span>
      ) : null}
    </Link>
  );
}

export function Header() {
  const { t, locale, setLocale } = useI18n();
  const { mode, toggle } = useTheme();
  const { favorites, quote } = useStore();
  const { session } = useBackend();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    nav(`/products?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  const links = [
    { to: "/collections", label: t("nav.collections") },
    { to: "/products", label: t("nav.products") },
    { to: "/surface-styles", label: t("nav.surfaceStyles") },
    { to: "/room-designer", label: t("nav.roomDesigner") },
    { to: "/subscriptions", label: t("nav.subscriptions") },
    { to: "/how-it-works", label: t("nav.how") },
  ];
