"use client";

import { Suspense, use, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { getGlasses, glasses, glassesList } from "@/lib/glasses";
import { cart, money } from "@/lib/cart";
import { usePrefs } from "@/components/Providers";

const ModelViewer = dynamic(() => import("@/components/ModelViewer"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-surface-2" />,
});

function ProductContent({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = use(searchParams);
  const { t } = usePrefs();
  const router = useRouter();
  const product = getGlasses(id);
  const known = !!(id && glasses[id]);
  const [pick, setPick] = useState(0);
  const color = product.colors[Math.min(pick, product.colors.length - 1)];

  if (id && !known) {
    return (
      <main className="container-x py-24 text-center">
        <p className="text-muted">{t("product.notfound")}</p>
        <Link href="/#collection" className="btn btn-primary mt-6">{t("product.back")}</Link>
      </main>
    );
  }

  return (
    <main className="container-x py-8 md:py-12">
      <Link href="/#collection" className="text-sm text-muted transition hover:text-fg">← {t("product.back")}</Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr]">
        <div className="card aspect-[4/3] overflow-hidden bg-surface-2 lg:aspect-auto lg:min-h-[520px]">
          <ModelViewer key={product.id} product={product} color={color} />
        </div>

        <div className="flex flex-col">
          <h1 className="font-display text-4xl tracking-tight">{product.name}</h1>
          <p className="mt-2 text-muted">{product.tagline}</p>
          <div className="mt-5 font-mono text-3xl text-accent">{money(product.price)}</div>

          <div className="mt-8">
            <div className="mb-3 text-sm text-muted">
              {t("product.colors")}: <span className="font-semibold text-fg">{color.name}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setPick(i)}
                  title={c.name}
                  aria-label={c.name}
                  aria-pressed={i === pick}
                  className={`h-11 w-11 rounded-full border-2 transition ${i === pick ? "scale-110 border-accent ring-4 ring-accent/20" : "border-line hover:border-muted"}`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button onClick={() => cart.add(product.id, color.name)} className="btn btn-primary">{t("shop.add")}</button>
            <button
              onClick={() => {
                cart.add(product.id, color.name);
                router.push("/checkout");
              }}
              className="btn btn-ghost"
            >
              {t("product.buy")}
            </button>
          </div>
          <Link
            href={`/try-on?id=${product.id}&color=${encodeURIComponent(color.name)}`}
            className="btn btn-ghost mt-3 w-full"
          >
            📷 {t("shop.try")}
          </Link>
          <p className="mt-5 text-sm text-muted">{t("product.ship")}</p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display mb-5 text-2xl">{t("product.others")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {glassesList
            .filter((g) => g.id !== product.id)
            .map((g) => (
              <Link key={g.id} href={`/select-color?id=${g.id}`} className="card flex items-center justify-between p-5 transition hover:border-muted">
                <div>
                  <div className="font-display text-lg">{g.name}</div>
                  <div className="text-sm text-muted">{g.tagline}</div>
                </div>
                <span className="font-mono text-accent">{money(g.price)}</span>
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}

export default function ProductPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  return (
    <Suspense fallback={<div className="container-x py-24 text-center text-muted">…</div>}>
      <ProductContent searchParams={searchParams} />
    </Suspense>
  );
}
