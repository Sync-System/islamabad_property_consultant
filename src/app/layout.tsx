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
    { media: "(prefers-color-scheme: light)", color: "#f7f7fd" },
    { media: "(prefers-color-scheme: dark)", color: "#02071d" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-PK" className={`${display.variable} ${sans.variable}`}>
      <head>
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
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-paper-50"
        >
          Skip to content
        </a>
        <SmoothAnchors />
        {children}
      </body>
    </html>
  );
}
