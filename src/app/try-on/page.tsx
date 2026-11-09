"use client";

import { Suspense, use, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { glasses, glassesList } from "@/lib/glasses";
import { cart, money, useCart } from "@/lib/cart";
import { recommend, toneKey } from "@/lib/stylist";
import { usePrefs } from "@/components/Providers";
import AIStylistOverlay from "@/components/AIStylistOverlay";
import type { Key } from "@/lib/i18n";

const TryOnView = dynamic(() => import("@/components/TryOnView"), {
  ssr: false,
  // shown while the camera code downloads, so this area is never an empty gap
  loading: () => (
    <div className="mx-auto flex aspect-[4/3] w-full max-w-3xl items-center justify-center rounded-2xl bg-surface-2 text-sm text-muted">
      Loading camera…
    </div>
  ),
});

function TryOnContent({ searchParams }: { searchParams: Promise<{ id?: string; color?: string }> }) {
  const params = use(searchParams);
  const { t } = usePrefs();
  const router = useRouter();
  const { count } = useCart();

  const [frameKey, setFrameKey] = useState<string>(params.id && glasses[params.id] ? params.id : "bold");
  const [colorName, setColorName] = useState<string>(params.color ?? "");
  const [faceMetrics, setFaceMetrics] = useState<{ shape: string; skinTone: string } | null>(null);
  const [showPick, setShowPick] = useState(true);
  const [started, setStarted] = useState(false);

  const product = glasses[frameKey];
  const active = product.colors.find((c) => c.name.toLowerCase() === colorName.toLowerCase()) ?? product.colors[0];
  const rec = faceMetrics ? recommend(faceMetrics.shape, faceMetrics.skinTone) : null;

  function pickFrame(key: string) {
    if (!glasses[key]) return;
    setFrameKey(key);
    setColorName(glasses[key].colors[0].name);
  }

  return (
    <main className="container-x py-6 md:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-3xl sm:text-4xl">{t("tryon.title")}</h1>
        <Link href="/cart" className="text-sm text-muted transition hover:text-fg">
          {t("nav.cart")} ({count})
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* ---------- camera ---------- */}
        <div className="min-w-0">
          <TryOnView
            product={product}
            color={active.original ? null : active.hex}
            productKey={frameKey}
            currentColorName={active.name}
            onSelectFrame={pickFrame}
            onSelectColor={setColorName}
            onFaceScanned={setFaceMetrics}
            onStarted={() => setStarted(true)}
          />
          <div className="mt-4">
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
          <p className="mt-3 text-center text-xs text-muted">{t("tryon.hint")}</p>
        </div>

        {/* ---------- side panel ---------- */}
        <aside className="flex flex-col gap-4">
          {rec && showPick && faceMetrics && (
            <div className="card border-accent/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">✦ {t("tryon.match")}</div>
                <button onClick={() => setShowPick(false)} className="text-muted hover:text-fg" aria-label="Close">✕</button>
              </div>
              <div className="mt-1 text-xs text-muted">
                {t(`shape.${faceMetrics.shape}` as Key)} · {t(`tone.${toneKey(faceMetrics.skinTone)}` as Key)}
              </div>
              <div className="mt-2 font-display text-lg">{glasses[rec.id].name}</div>
              <div className="text-sm text-muted">{rec.colorName}</div>
              <button
                onClick={() => {
                  setFrameKey(rec.id);
                  setColorName(rec.colorName);
                }}
                className="btn btn-primary mt-3 w-full !py-2.5"
              >
                {t("tryon.apply")}
              </button>
            </div>
          )}

          <div className="card p-4">
            <div className="mb-3 text-xs uppercase tracking-[0.18em] text-muted">{t("tryon.frames")}</div>
            <div className="flex flex-col gap-2">
              {glassesList.map((g) => (
                <button
                  key={g.id}
                  onClick={() => pickFrame(g.id)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-start transition ${
                    g.id === frameKey ? "border-accent bg-accent/10" : "border-line hover:border-muted"
                  }`}
                >
                  <span>
                    <span className="block text-sm font-semibold">{g.name}</span>
                    <span className="block text-xs text-muted">{g.tagline}</span>
                  </span>
                  <span className="font-mono text-sm text-accent">{money(g.price)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="mb-3 text-xs uppercase tracking-[0.18em] text-muted">
              {t("tryon.finish")}: <span className="text-fg">{active.name}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColorName(c.name)}
                  title={c.name}
                  aria-label={c.name}
                  className={`h-10 w-10 rounded-full border-2 transition ${
                    active.name === c.name ? "scale-110 border-accent ring-4 ring-accent/20" : "border-line hover:border-muted"
                  }`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="font-display text-lg">{product.name}</span>
              <span className="font-mono text-xl text-accent">{money(product.price)}</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <button onClick={() => cart.add(frameKey, active.name)} className="btn btn-primary">{t("shop.add")}</button>
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
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function TryOnPage({ searchParams }: { searchParams: Promise<{ id?: string; color?: string }> }) {
  return (
    <Suspense fallback={<div className="container-x py-24 text-center text-muted">…</div>}>
      <TryOnContent searchParams={searchParams} />
    </Suspense>
  );
}