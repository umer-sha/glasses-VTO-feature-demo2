"use client";

import Link from "next/link";
import { usePrefs } from "@/components/Providers";

export default function SiteFooter() {
  const { t } = usePrefs();
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-x flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
        <div>
          <div className="font-display text-xl">Innovibe</div>
          <p className="mt-1 text-sm text-muted">{t("foot.privacy")}</p>
        </div>
        <div className="flex gap-6 text-sm text-muted">
          <Link href="/#collection" className="hover:text-fg">{t("nav.shop")}</Link>
          <Link href="/try-on" className="hover:text-fg">{t("nav.tryon")}</Link>
          <Link href="/cart" className="hover:text-fg">{t("nav.cart")}</Link>
        </div>
        <p className="text-xs text-muted">{t("foot.rights")}</p>
      </div>
    </footer>
  );
}
