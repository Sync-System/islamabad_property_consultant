import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { siteConfig } from "@/lib/config/site";
import { jsonLd, organizationSchema, websiteSchema } from "@/lib/structured-data";
import { SmoothAnchors } from "@/components/ui/SmoothAnchors";
import "./globals.css";

/**
 * Root layout.
 *
 * Fonts are self-hosted by `next/font` — no third-party request on the critical
 * path, and `display: swap` with a tuned fallback keeps the metric shift from
 * showing up as CLS.
 */

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
  // Sized against Iowan/Georgia so the swap does not reflow headlines.
  adjustFontFallback: true,
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.titleDefault,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.titleDefault,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.titleDefault,
    description: siteConfig.description,
  },
  robots: siteConfig.indexable
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
      }
    : { index: false, follow: false },
  category: "real estate",
  formatDetection: { telephone: true, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-PK" className={`${display.variable} ${sans.variable}`}>
      <head>
        {/* Applies the stored theme before first paint. Inline and
            render-blocking on purpose: anything async would let the wrong
            theme paint first. Falls through to the OS preference when the
            visitor has never chosen, which is why it writes the attribute
            only for an explicit choice. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=localStorage.getItem("ipc.theme");var d=c==="dark"||(!c&&matchMedia("(prefers-color-scheme: dark)").matches);if(c){document.documentElement.setAttribute("data-theme",c);}document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          // Static, developer-authored payload — no user input reaches it.
          dangerouslySetInnerHTML={{
            __html: jsonLd(organizationSchema(), websiteSchema()),
          }}
        />
        {/* Entrance animations must never hide content when JS is unavailable. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-surface-feature focus:px-5 focus:py-3 focus:text-content"
        >
          Skip to content
        </a>
        <SmoothAnchors />
        {children}
      </body>
    </html>
  );
}
