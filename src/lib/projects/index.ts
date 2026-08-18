import { margallaEnclave } from "./margalla-enclave";
import type { Project, ProjectSummary } from "./types";

/**
 * Project registry.
 *
 * Adding project #2 is a three-step change: create `./<slug>.ts` exporting a
 * `Project`, import it, and add it to this array. Routing, metadata, the
 * sitemap, the directory page and every WhatsApp message follow automatically.
 */
const projects: Project[] = [margallaEnclave];

export const allProjects: Project[] = [...projects].sort(
  (a, b) => a.order - b.order,
);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

export function toSummary(project: Project): ProjectSummary {
  return {
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
    tagline: project.tagline,
    summary: project.summary,
    city: project.city,
    locationLabel: project.locationLabel,
    projectType: project.projectType,
    statusLabel: project.status.verified ? project.status.value : "Status to confirm",
    featured: project.featured,
    order: project.order,
    media: project.hero.media,
  };
}

export const projectSummaries: ProjectSummary[] = allProjects.map(toSummary);

/** Distinct filter facets for the projects directory. */
export const projectFacets = {
  cities: [...new Set(allProjects.map((p) => p.city))].sort(),
  types: [...new Set(allProjects.flatMap((p) => p.projectType))].sort(),
  statuses: [...new Set(projectSummaries.map((p) => p.statusLabel))].sort(),
};

export { margallaEnclave };
export * from "./types";

/** The project featured across agency-level pages. */
export const primaryProject = margallaEnclave;
