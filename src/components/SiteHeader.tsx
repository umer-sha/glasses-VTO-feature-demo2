"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePrefs } from "@/components/Providers";
import { LANGS, type Lang } from "@/lib/i18n";
import { useCart } from "@/lib/cart";

export default function SiteHeader() {
  const { t, theme, toggleTheme, lang, setLang } = usePrefs();
  const { count } = useCart();
  const [bump, setBump] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted || count === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBump(true);
    const id = setTimeout(() => setBump(false), 450);
    return () => clearTimeout(id);
  }, [count, mounted]);

  const links = [
    { href: "/#collection", label: t("nav.shop") },
    { href: "/try-on", label: t("nav.tryon") },
    { href: "/#how", label: t("nav.how") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex items-baseline gap-2" aria-label="Innovibe">
          <span className="font-display text-2xl tracking-tight">Innovibe</span>
          <span className="hidden text-[11px] uppercase tracking-[0.2em] text-muted lg:inline">{t("brand.tag")}</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-muted transition hover:text-fg">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <label className="relative flex items-center gap-2">
            <span className="hidden text-xs text-muted sm:inline">{t("nav.lang")}</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="h-10 cursor-pointer appearance-none rounded-full border border-line bg-surface px-4 text-sm text-fg outline-none transition hover:border-muted focus:border-accent"
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={toggleTheme}
            aria-label={t("nav.theme")}
            title={t("nav.theme")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-fg transition hover:border-muted"
          >
            {theme === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>

          <Link
            href="/cart"
            aria-label={t("nav.cart")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-fg transition hover:border-muted"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 7h12l-1 12H7L6 7z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {mounted && count > 0 && (
              <span
                className={`absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-fg ${bump ? "pop" : ""}`}
              >
                {count}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenu((m) => !m)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface md:hidden"
            aria-label="Menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {menu && (
        <nav className="border-t border-line bg-bg md:hidden">
          <div className="container-x flex flex-col py-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenu(false)} className="py-3 text-sm text-muted hover:text-fg">
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
