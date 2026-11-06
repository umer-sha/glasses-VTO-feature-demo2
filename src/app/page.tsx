"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { glassesList, glasses } from "@/lib/glasses";
import { cart, money } from "@/lib/cart";
import { usePrefs } from "@/components/Providers";

const ModelViewer = dynamic(() => import("@/components/ModelViewer"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-2xl bg-surface-2" />,
});

export default function HomePage() {
  const { t } = usePrefs();

  return (
    <main>
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 start-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--accent), transparent)" }}
        />
        <div className="container-x relative grid items-center gap-10 py-14 md:py-24 lg:grid-cols-2">
          <div className="fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t("hero.kicker")}
            </span>
            <h1 className="font-display mt-5 text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">{t("hero.title")}</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{t("hero.sub")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/try-on" className="btn btn-primary">{t("hero.cta2")}</Link>
              <Link href="/#collection" className="btn btn-ghost">{t("hero.cta1")}</Link>
            </div>
            <ul className="mt-10 grid max-w-xl grid-cols-1 gap-3 text-sm text-muted sm:grid-cols-3">
              {["hero.stat1", "hero.stat2", "hero.stat3"].map((k) => (
                <li key={k} className="flex items-center gap-2">
                  <span className="text-accent">✦</span>
                  {t(k as "hero.stat1")}
                </li>
              ))}
            </ul>
          </div>

          <div className="fade-up relative mx-auto aspect-[4/3] w-full max-w-xl rounded-[2rem] border border-line bg-surface p-2 shadow-2xl" style={{ animationDelay: "0.1s" }}>
            <div className="h-full w-full overflow-hidden rounded-[1.6rem] bg-surface-2">
              <ModelViewer product={glasses.bold} />
            </div>
            <span className="absolute bottom-5 start-5 rounded-full bg-bg/80 px-3 py-1 text-[11px] text-muted backdrop-blur">{t("shop.drag")}</span>
          </div>
        </div>
      </section>

      {/* ---------------- collection ---------------- */}
      <section id="collection" className="container-x scroll-mt-20 py-16">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">{t("shop.title")}</h2>
          <p className="mt-3 text-muted">{t("shop.sub")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {glassesList.map((g) => (
            <article key={g.id} className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:border-muted">
              <Link href={`/select-color?id=${g.id}`} className="block aspect-[4/3] bg-surface-2" aria-label={g.name}>
                <ModelViewer product={g} />
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl">{g.name}</h3>
                  <span className="font-mono text-lg text-accent">{money(g.price)}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{g.tagline}</p>
                <div className="mt-4 flex gap-1.5">
                  {g.colors.map((c) => (
                    <span key={c.name} title={c.name} className="h-4 w-4 rounded-full border border-line" style={{ background: c.hex }} />
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button onClick={() => cart.add(g.id, g.colors[0].name)} className="btn btn-primary !px-3">
                    {t("shop.add")}
                  </button>
                  <Link href={`/try-on?id=${g.id}`} className="btn btn-ghost !px-3">
                    {t("shop.try")}
                  </Link>
                </div>
                <Link href={`/select-color?id=${g.id}`} className="mt-3 text-center text-sm text-muted transition hover:text-fg">
                  {t("shop.view")} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- how it works ---------------- */}
      <section id="how" className="container-x scroll-mt-20 py-16">
        <h2 className="font-display mb-10 text-3xl tracking-tight sm:text-4xl">{t("how.title")}</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {([1, 2, 3] as const).map((n) => (
            <div key={n} className="card p-6">
              <div className="font-display text-5xl text-accent/80">0{n}</div>
              <h3 className="mt-4 text-lg font-semibold">{t(`how.${n}.t` as "how.1.t")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t(`how.${n}.d` as "how.1.d")}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- call to action ---------------- */}
      <section className="container-x py-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{ background: "radial-gradient(60% 80% at 50% 120%, var(--accent), transparent)" }}
          />
          <h2 className="font-display relative text-3xl tracking-tight sm:text-4xl">{t("cta.title")}</h2>
          <p className="relative mt-3 text-muted">{t("cta.sub")}</p>
          <Link href="/try-on" className="btn btn-primary relative mt-7">{t("hero.cta2")}</Link>
        </div>
      </section>
    </main>
  );
}
