"use client";

import Link from "next/link";
import { useState } from "react";
import { cart, money, useCart } from "@/lib/cart";
import { usePrefs } from "@/components/Providers";

export default function CheckoutPage() {
  const { t } = usePrefs();
  const { lines, subtotal, count } = useCart();
  const [pay, setPay] = useState<"cod" | "card">("cod");
  const [done, setDone] = useState<{ no: string; name: string; email: string } | null>(null);

  function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setDone({
      no: "INN-" + Date.now().toString(36).toUpperCase(),
      name: String(f.get("name") || ""),
      email: String(f.get("email") || ""),
    });
    cart.clear();
  }

  if (done) {
    return (
      <main className="container-x py-16">
        <div className="card mx-auto max-w-lg p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ok/15 text-2xl text-ok">✓</div>
          <h1 className="font-display mt-5 text-3xl">{t("co.ok.title")}</h1>
          <p className="mt-3 text-muted">{t("co.ok.msg", { name: done.name, email: done.email })}</p>
          <p className="mt-4 text-sm text-muted">
            {t("co.ok.no")}: <span className="font-mono text-fg">{done.no}</span>
          </p>
          <Link href="/" className="btn btn-primary mt-7">{t("co.home")}</Link>
        </div>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="container-x py-24 text-center">
        <p className="text-muted">{t("co.empty")}</p>
        <Link href="/#collection" className="btn btn-primary mt-6">{t("cart.continue")}</Link>
      </main>
    );
  }

  const field = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block text-sm">
      <span className="mb-1.5 block text-muted">{label}</span>
      <input name={name} className="input" required {...props} />
    </label>
  );

  return (
    <main className="container-x py-10 md:py-14">
      <h1 className="font-display text-3xl tracking-tight sm:text-4xl">{t("co.title")}</h1>

      <form onSubmit={placeOrder} className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          <section className="card p-5">
            <h2 className="mb-4 font-semibold">{t("co.contact")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {field("name", t("co.name"), { autoComplete: "name" })}
              {field("email", t("co.email"), { type: "email", autoComplete: "email" })}
              <div className="sm:col-span-2">{field("phone", t("co.phone"), { type: "tel", autoComplete: "tel" })}</div>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="mb-4 font-semibold">{t("co.ship")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">{field("address", t("co.address"), { autoComplete: "street-address" })}</div>
              {field("city", t("co.city"), { autoComplete: "address-level2" })}
              {field("zip", t("co.zip"), { autoComplete: "postal-code" })}
              <div className="sm:col-span-2">{field("country", t("co.country"), { autoComplete: "country-name" })}</div>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="mb-4 font-semibold">{t("co.pay")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["cod", "card"] as const).map((k) => (
                <label
                  key={k}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${pay === k ? "border-accent bg-accent/10" : "border-line hover:border-muted"}`}
                >
                  <input type="radio" name="pay" checked={pay === k} onChange={() => setPay(k)} className="accent-[var(--accent)]" />
                  {t(k === "cod" ? "co.cod" : "co.card")}
                </label>
              ))}
            </div>
            <p className="mt-4 rounded-xl bg-surface-2 px-4 py-3 text-xs text-muted">{t("co.demo")}</p>
          </section>
        </div>

        <aside className="card h-fit p-5 lg:sticky lg:top-24">
          <h2 className="mb-4 font-semibold">{t("co.summary")} <span className="text-sm font-normal text-muted">({t("cart.items", { n: count })})</span></h2>
          <ul className="space-y-3">
            {lines.map((l) => (
              <li key={l.id + l.color} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{l.product.name} × {l.qty}</span>
                  <span className="text-xs text-muted">{l.color}</span>
                </span>
                <span className="font-mono">{money(l.product.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted">{t("cart.shipping")}</dt><dd>{t("cart.free")}</dd></div>
            <div className="flex justify-between text-base font-semibold"><dt>{t("cart.total")}</dt><dd className="font-mono text-accent">{money(subtotal)}</dd></div>
          </dl>
          <button type="submit" className="btn btn-primary mt-5 w-full">{t("co.place")}</button>
          <Link href="/cart" className="mt-3 block text-center text-sm text-muted hover:text-fg">{t("co.back")}</Link>
        </aside>
      </form>
    </main>
  );
}