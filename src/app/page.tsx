"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { glassesList, glasses } from "@/lib/glasses";
import { cart, money } from "@/lib/cart";
import { usePrefs } from "@/components/Providers";

const ModelViewer = dynamic(() => import("@/components/ModelViewer"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-surface-2" />,
});

export default function HomePage() {
  const { t } = usePrefs();

  return (
    <main className="pb-24 md:pb-0">
      {/* ---------------- hero ---------------- */}
      <section className="container-x grid items-center gap-10 pb-10 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-20 lg:pt-20">
        <div className="fade-up">
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-accent" />
            {t("hero.kicker")}
          </p>
          <h1 className="font-display h-display mt-5">{t("hero.title")}</h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">{t("hero.sub")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/try-on" className="btn btn-primary sm:min-w-44">{t("hero.cta2")}</Link>
            <Link href="/#collection" className="btn btn-ghost sm:min-w-44">{t("hero.cta1")}</Link>
          </div>
          <ul className="mt-9 flex flex-col gap-2.5 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:gap-8">
            {["hero.stat1", "hero.stat2", "hero.stat3"].map((k) => (
              <li key={k} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t(k as "hero.stat1")}
              </li>
            ))}
          </ul>
        </div>

        {/* soft stage with a large circle behind the frame */}
        <div
          className="fade-up relative aspect-[5/4] w-full overflow-hidden rounded-[2rem] bg-surface-2"
          style={{ animationDelay: "0.12s" }}
        >
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 32%, transparent), transparent)" }}
          />
          <div className="absolute inset-0">
            <ModelViewer product={glasses.bold} />
          </div>
          <span className="pointer-events-none absolute end-4 top-4 rounded-lg bg-bg/80 px-3 py-1.5 text-xs font-medium backdrop-blur">
            {glasses.bold.name} · {money(glasses.bold.price)}
          </span>
        </div>
      </section>

      {/* ---------------- collection ---------------- */}
      <section id="collection" className="container-x scroll-mt-20 border-t border-line py-14 md:py-24">
        <div className="mb-10 flex flex-col gap-3 md:mb-14 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-4xl sm:text-6xl">{t("shop.title")}</h2>
          <p className="max-w-sm text-muted">{t("shop.sub")}</p>
        </div>

        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {glassesList.map((g, i) => (
            <article key={g.id} className="group">
              <Link
                href={`/select-color?id=${g.id}`}
                aria-label={g.name}
                className="relative block aspect-[5/4] overflow-hidden rounded-[1.75rem] bg-surface-2"
              >
                <ModelViewer product={g} />
              </Link>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs tracking-[0.2em] text-muted">0{i + 1}</span>
                  <h3 className="font-display mt-1 text-3xl leading-tight">{g.name}</h3>
                </div>
                <span className="mt-5 font-mono text-lg">{money(g.price)}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{g.tagline}</p>

              <div className="mt-4 flex items-center gap-2">
                {g.colors.map((c) => (
                  <span key={c.name} title={c.name} className="h-5 w-5 rounded-full border border-line" style={{ background: c.hex }} />
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <button onClick={() => cart.add(g.id, g.colors[0].name)} className="btn btn-primary !px-3">
                  {t("shop.add")}
                </button>
                <Link href={`/try-on?id=${g.id}`} className="btn btn-ghost !px-3">
                  {t("shop.try")}
                </Link>
              </div>
              <Link href={`/select-color?id=${g.id}`} className="mt-4 inline-block text-sm font-medium text-accent">
                {t("shop.view")} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- how it works ---------------- */}
      <section id="how" className="container-x scroll-mt-20 border-t border-line py-14 md:py-24">
        <h2 className="font-display mb-10 text-4xl sm:text-6xl md:mb-14">{t("how.title")}</h2>
        <div className="grid md:grid-cols-3 md:gap-10">
          {([1, 2, 3] as const).map((n) => (
            <div key={n} className="flex gap-5 border-t border-line py-6 md:block md:py-8">
              <div className="font-display w-14 shrink-0 text-5xl leading-none text-accent md:w-auto md:text-7xl">0{n}</div>
              <div>
                <h3 className="text-lg font-semibold md:mt-6">{t(`how.${n}.t` as "how.1.t")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(`how.${n}.d` as "how.1.d")}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- call to action ---------------- */}
      <section className="container-x pb-16 md:pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-surface-2 px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 left-1/2 aspect-square w-[70%] -translate-x-1/2 rounded-full"
            style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 28%, transparent), transparent)" }}
          />
          <h2 className="font-display relative mx-auto max-w-2xl text-4xl sm:text-6xl">{t("cta.title")}</h2>
          <p className="relative mx-auto mt-4 max-w-md text-muted">{t("cta.sub")}</p>
          <Link href="/try-on" className="btn btn-accent relative mt-8 sm:min-w-52">{t("hero.cta2")}</Link>
        </div>
      </section>

      {/* ---------------- sticky "try on" bar, phones only ---------------- */}
      <div className="fixed inset-x-4 bottom-4 z-40 md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <Link href="/try-on" className="btn btn-primary w-full shadow-xl">
          {t("hero.cta2")}
        </Link>
      </div>
    </main>
  );
}