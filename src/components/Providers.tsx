"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LANGS, translate, type Key, type Lang } from "@/lib/i18n";

type Theme = "dark" | "light";
interface Ctx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: Key, vars?: Record<string, string | number>) => string;
  speechLang: string;
}

const PrefCtx = createContext<Ctx | null>(null);

function readStore(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStore(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  // light is the default. The inline script in layout.tsx has already set the right attributes before paint.
  const [theme, setThemeState] = useState<Theme>("light");
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(readStore("lumiere2-theme") === "dark" ? "dark" : "light");
    const saved = readStore("lumiere2-lang") as Lang | null;
    if (saved && LANGS.some((l) => l.code === saved)) setLangState(saved);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    writeStore("lumiere2-theme", t);
    document.documentElement.dataset.theme = t;
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    writeStore("lumiere2-lang", l);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
      lang,
      setLang,
      // the website always stays in English; `lang` is only the AI stylist's voice language
      t: (key, vars) => translate("en", key, vars),
      speechLang: LANGS.find((l) => l.code === lang)?.speech ?? "en-US",
    }),
    [theme, lang, setTheme, setLang]
  );

  return <PrefCtx.Provider value={value}>{children}</PrefCtx.Provider>;
}

export function usePrefs() {
  const c = useContext(PrefCtx);
  if (!c) throw new Error("usePrefs must be used inside <Providers>");
  return c;
}
