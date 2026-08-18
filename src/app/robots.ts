import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/config/site";

/**
 * Robots.
 *
 * Indexing is gated on `NEXT_PUBLIC_ALLOW_INDEXING`, so a staging deployment
 * cannot accidentally out-rank production for the agency's own brand terms.
 */
export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
