"use client";

import Link from "next/link";
import { cart, money, useCart } from "@/lib/cart";
import { usePrefs } from "@/components/Providers";

export default function CartPage() {
  const { t } = usePrefs();
  const { lines, count, subtotal } = useCart();

  return (
    <main className="container-x py-10 md:py-14">
      <h1 className="font-display text-3xl tracking-tight sm:text-4xl">{t("cart.title")}</h1>

      {lines.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
          <div className="text-5xl opacity-60">🛍️</div>
          <p className="mt-4 text-muted">{t("cart.empty")}</p>
          <Link href="/#collection" className="btn btn-primary mt-6">{t("cart.continue")}</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <ul className="flex flex-col gap-3">
            {lines.map((l) => {
              const hex = l.product.colors.find((c) => c.name === l.color)?.hex ?? "#888";
              return (
                <li key={l.id + l.color} className="card flex flex-wrap items-center gap-4 p-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-surface-2">
                    <span className="h-7 w-7 rounded-full border border-line" style={{ background: hex }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/select-color?id=${l.id}`} className="font-display text-lg hover:text-accent">{l.product.name}</Link>
                    <div className="text-sm text-muted">{l.color}</div>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-line">
                    <button onClick={() => cart.setQty(l.id, l.color, l.qty - 1)} className="h-9 w-9 text-lg hover:text-accent" aria-label="−">−</button>
                    <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                    <button onClick={() => cart.setQty(l.id, l.color, l.qty + 1)} className="h-9 w-9 text-lg hover:text-accent" aria-label="+">+</button>
                  </div>
                  <div className="w-20 text-end font-mono">{money(l.product.price * l.qty)}</div>
                  <button onClick={() => cart.remove(l.id, l.color)} className="text-sm text-muted underline hover:text-danger">
                    {t("cart.remove")}
                  </button>
                </li>
              );
            })}
          </ul>

          <aside className="card h-fit p-5">
            <div className="text-sm text-muted">{t("cart.items", { n: count })}</div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted">{t("cart.subtotal")}</dt><dd className="font-mono">{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">{t("cart.shipping")}</dt><dd>{t("cart.free")}</dd></div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-semibold"><dt>{t("cart.total")}</dt><dd className="font-mono text-accent">{money(subtotal)}</dd></div>
            </dl>
            <Link href="/checkout" className="btn btn-primary mt-5 w-full">{t("cart.checkout")}</Link>
            <Link href="/#collection" className="mt-3 block text-center text-sm text-muted hover:text-fg">{t("cart.continue")}</Link>
          </aside>
        </div>
      )}
    </main>
  );
}
