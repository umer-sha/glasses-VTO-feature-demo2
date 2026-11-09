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
  // lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  const links = [
    { href: "/#collection", label: t("nav.shop") },
    { href: "/try-on", label: t("nav.tryon") },
    { href: "/#how", label: t("nav.how") },
  ];

  const langSelect = (cls: string) => (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as Lang)}
      aria-label={t("nav.lang")}
      className={`cursor-pointer appearance-none rounded-full border border-line bg-surface px-4 text-sm text-fg outline-none transition hover:border-muted focus:border-accent ${cls}`}
    >
      {LANGS.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );

  const iconBtn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-fg transition hover:border-muted";

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-xl">
      <div className="container-x flex h-14 items-center justify-between gap-2 sm:h-16">
        <Link href="/" className="flex items-baseline gap-2" aria-label="Innovibe" onClick={() => setMenu(false)}>
          <span className="font-display text-2xl">Innovibe</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-muted transition hover:text-fg">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {langSelect("hidden h-11 sm:block")}

          <button onClick={toggleTheme} aria-label={t("nav.theme")} title={t("nav.theme")} className={iconBtn}>
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

          <Link href="/cart" aria-label={t("nav.cart")} className={`relative ${iconBtn}`} onClick={() => setMenu(false)}>
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

          <button onClick={() => setMenu((m) => !m)} className={`${iconBtn} md:hidden`} aria-label="Menu" aria-expanded={menu}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menu && (
        <nav className="fixed inset-x-0 bottom-0 top-14 z-40 overflow-y-auto bg-bg md:hidden">
          <div className="container-x flex flex-col py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenu(false)}
                className="font-display border-b border-line py-5 text-3xl"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-6 flex items-center justify-between gap-4 sm:hidden">
              <span className="text-sm text-muted">{t("nav.lang")}</span>
              {langSelect("h-11 flex-1")}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}