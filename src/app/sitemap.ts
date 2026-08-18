import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/config/site";
import { getProjectSlugs } from "@/lib/projects";

/**
 * Sitemap.
 *
 * Project routes are derived from the registry, so a new project appears here
 * the moment its data file is added — no second list to keep in sync.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: absoluteUrl("/projects"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: absoluteUrl("/legal/disclaimer"), lastModified: now, priority: 0.2 },
    { url: absoluteUrl("/legal/privacy"), lastModified: now, priority: 0.2 },
    { url: absoluteUrl("/legal/terms"), lastModified: now, priority: 0.2 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = getProjectSlugs().map((slug) => ({
    url: absoluteUrl(`/projects/${slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...projectRoutes];
}
