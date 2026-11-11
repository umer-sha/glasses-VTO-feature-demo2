"use client";

import { Suspense, use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { glasses, glassesList } from "@/lib/glasses";
import { cart, money, useCart } from "@/lib/cart";
import { recommend, toneKey } from "@/lib/stylist";
import { usePrefs } from "@/components/Providers";
import AIStylistOverlay from "@/components/AIStylistOverlay";
import { LANGS, type Key, type Lang } from "@/lib/i18n";

const TryOnView = dynamic(() => import("@/components/TryOnView"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 flex items-center justify-center text-sm text-white/70">Loading camera…</div>,
});

function Studio({ searchParams }: { searchParams: Promise<{ id?: string; color?: string }> }) {
  const params = use(searchParams);
  const { t, lang, setLang } = usePrefs();
  const router = useRouter();
  const { count } = useCart();

  const [frameKey, setFrameKey] = useState<string>(params.id && glasses[params.id] ? params.id : "bold");
  const [colorName, setColorName] = useState<string>(params.color ?? "");
  const [faceMetrics, setFaceMetrics] = useState<{ shape: string; skinTone: string } | null>(null);
  const [showPick, setShowPick] = useState(true);
  const [started, setStarted] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const product = glasses[frameKey];
  const active = product.colors.find((c) => c.name.toLowerCase() === colorName.toLowerCase()) ?? product.colors[0];
  const rec = faceMetrics ? recommend(faceMetrics.shape, faceMetrics.skinTone) : null;

  // the studio is a pop-up: the page behind it must not scroll
  useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = old; };
  }, []);

  function pickFrame(key: string) {
    if (!glasses[key]) return;
    setFrameKey(key);
    setColorName(glasses[key].colors[0].name);
  }

  return (
    // h-dvh = the part of the screen you can actually see (excludes the browser bars)
    <div className="fixed inset-x-0 top-0 z-[70] h-dvh bg-black/70 lg:p-6 lg:backdrop-blur-sm">
      <div className="mx-auto grid h-full w-full max-w-6xl grid-rows-[3.5rem_minmax(0,1fr)_auto] overflow-hidden bg-bg text-fg lg:grid-cols-[minmax(0,1fr)_380px] lg:grid-rows-[3.5rem_minmax(0,1fr)] lg:rounded-[2rem]">
        {/* ---------- top bar: close, title, AI voice language, cart ---------- */}
        <div className="flex items-center justify-between gap-2 border-b border-line px-2 lg:col-start-1">
          <Link href="/" aria-label="Close" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl hover:bg-surface-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </Link>
          <div className="font-display hidden truncate text-xl sm:block">{t("tryon.title")}</div>
          <div className="flex min-w-0 items-center gap-1">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              aria-label="AI voice language"
              className="h-10 max-w-[9rem] cursor-pointer appearance-none truncate rounded-xl border border-line bg-transparent px-3 text-sm text-fg outline-none focus:border-accent"
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <Link href="/cart" aria-label={t("nav.cart")} className="flex h-11 min-w-11 items-center justify-center gap-1 rounded-xl px-2 text-sm hover:bg-surface-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 7h12l-1 12H7L6 7z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              <span>{count}</span>
            </Link>
          </div>
        </div>

        {/* ---------- camera: its own row, never shared with the drawer ---------- */}
        <div className="relative min-h-0 bg-black lg:col-start-1">
          <TryOnView
            product={product}
            color={active.original ? null : active.hex}
            productKey={frameKey}
            currentColorName={active.name}
            onSelectFrame={pickFrame}
            onSelectColor={setColorName}
            onFaceScanned={setFaceMetrics}
            onStarted={() => {
              setStarted(true);
              setAiOpen(true);
            }}
          />

          {rec && showPick && faceMetrics && (
            <div className="absolute inset-x-3 bottom-3 z-40 rounded-2xl bg-bg/95 p-3 shadow-xl backdrop-blur sm:inset-x-auto sm:end-3 sm:w-80">
              <div className="flex items-start justify-between gap-3">
                <div className="eyebrow">✦ {t("tryon.match")}</div>
                <button onClick={() => setShowPick(false)} className="text-muted hover:text-fg" aria-label="Close">✕</button>
              </div>
              <div className="mt-1 text-xs text-muted">
                {t(`shape.${faceMetrics.shape}` as Key)} · {t(`tone.${toneKey(faceMetrics.skinTone)}` as Key)}
              </div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <div>
                  <div className="font-display text-lg leading-tight">{glasses[rec.id].name}</div>
                  <div className="text-sm text-muted">{rec.colorName}</div>
                </div>
                <button
                  onClick={() => {
                    setFrameKey(rec.id);
                    setColorName(rec.colorName);
                    setShowPick(false);
                  }}
                  className="btn btn-primary !min-h-10 !px-4"
                >
                  {t("tryon.apply")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ---------- drawer: capped height, scrolls inside, clears the phone's bottom bar ---------- */}
        <aside
          className="flex max-h-[46dvh] flex-col gap-4 overflow-y-auto overscroll-contain border-t border-line bg-bg p-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-h-none lg:border-l lg:border-t-0"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          {/* the AI stylist stays mounted so it keeps listening, it is just hidden until opened */}
          <div className={aiOpen ? "block" : "hidden"}>
            <AIStylistOverlay
              currentProduct={product}
              currentKey={frameKey}
              currentColor={active.name}
              onSelectFrame={pickFrame}
              onSelectColor={setColorName}
              faceMetrics={faceMetrics}
              started={started}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="eyebrow !text-muted">{t("tryon.frames")}</span>
              <button onClick={() => setAiOpen((o) => !o)} className="text-sm font-medium text-accent">
                ✦ {aiOpen ? "Hide AI stylist" : "Ask AI stylist"}
              </button>
            </div>
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
              {glassesList.map((g) => (
                <button
                  key={g.id}
                  onClick={() => pickFrame(g.id)}
                  className={`min-w-[10.5rem] shrink-0 rounded-2xl border px-4 py-3 text-start transition lg:min-w-0 ${
                    g.id === frameKey ? "border-accent bg-accent/10" : "border-line hover:border-muted"
                  }`}
                >
                  <span className="block text-sm font-semibold">{g.name}</span>
                  <span className="mt-0.5 block font-mono text-xs text-accent">{money(g.price)}</span>
                  <span className="mt-1 hidden text-xs text-muted lg:block">{g.tagline}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColorName(c.name)}
                  title={c.name}
                  aria-label={c.name}
                  className={`h-9 w-9 rounded-full border-2 transition ${
                    active.name === c.name ? "scale-110 border-accent ring-4 ring-accent/20" : "border-line"
                  }`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
            <span className="text-xs text-muted">{active.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button onClick={() => cart.add(frameKey, active.name)} className="btn btn-primary">
              {t("shop.add")} · {money(product.price)}
            </button>
            <button
              onClick={() => {
                cart.add(frameKey, active.name);
                router.push("/checkout");
              }}
              className="btn btn-ghost"
            >
              {t("product.buy")}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function TryOnPage({ searchParams }: { searchParams: Promise<{ id?: string; color?: string }> }) {
  return (
    <Suspense fallback={<div className="fixed inset-0 z-[70] flex items-center justify-center bg-bg text-muted">…</div>}>
      <Studio searchParams={searchParams} />
    </Suspense>
  );
}