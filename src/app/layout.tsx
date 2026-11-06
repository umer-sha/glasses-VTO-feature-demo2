import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CartToast from "@/components/CartToast";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Fraunces({ variable: "--font-serif-display", subsets: ["latin"], axes: ["opsz"] });
const arabic = Noto_Naskh_Arabic({ variable: "--font-arabic", subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "Innovibe | Virtual glasses try-on",
  description: "Try glasses on live with your camera. An AI stylist reads your face shape and skin tone and talks you through what suits you.",
};

export const viewport: Viewport = {
  themeColor: "#faf8f4",
};

// runs before the page paints, so there is no flash: light by default, remembers the visitor's choice
const initScript = `(function(){try{var t=localStorage.getItem('lumiere2-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light';}catch(e){document.documentElement.dataset.theme='light'}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${arabic.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <Providers>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
          <CartToast />
        </Providers>
      </body>
    </html>
  );
}
