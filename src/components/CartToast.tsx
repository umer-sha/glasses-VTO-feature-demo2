"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { getGlasses } from "@/lib/glasses";
import { usePrefs } from "@/components/Providers";

// pops up whenever anything (button, voice, try-on page) adds to the cart
export default function CartToast() {
  const { lastAdded } = useCart();
  const { t } = usePrefs();
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    if (!lastAdded) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShown(lastAdded.t);
    const id = setTimeout(() => setShown(null), 3500);
    return () => clearTimeout(id);
  }, [lastAdded]);

  if (!lastAdded || shown !== lastAdded.t) return null;
  const p = getGlasses(lastAdded.id);
  return (
    <div className="fade-up fixed bottom-5 end-5 z-[60] flex max-w-sm items-center gap-4 rounded-2xl border border-line bg-surface p-4 shadow-2xl" role="status">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg">✓</div>
      <div className="min-w-0">
        <div className="text-sm font-semibold">{t("cart.added")}</div>
        <div className="truncate text-xs text-muted">
          {p.name} · {lastAdded.color}
        </div>
      </div>
      <Link href="/cart" className="btn btn-ghost !px-4 !py-2 text-xs" onClick={() => setShown(null)}>
        {t("cart.view")}
      </Link>
    </div>
  );
}
