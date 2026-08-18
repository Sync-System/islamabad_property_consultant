/**
 * Site-level configuration: canonical origin, default metadata, nav.
 */

const rawBaseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://islamabadpropertyconsultant.com";

export const siteConfig = {
  /** Canonical origin. Set NEXT_PUBLIC_SITE_URL in the deployment env. */
  url: rawBaseUrl,
  name: "Islamabad Property Consultant",
  titleDefault:
    "Islamabad Property Consultant — Premium Real Estate Guidance in Islamabad",
  titleTemplate: "%s | Islamabad Property Consultant",
  description:
    "Independent property consultancy for buyers and investors in Islamabad. Verified project information, plot guidance and site visits — including Margalla Enclave, the CDA and DHA Islamabad joint venture in Zone 4.",
  locale: "en_PK",
  /** Search engines are allowed once real business data replaces placeholders. */
  indexable: process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false",
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export interface NavItem {
  label: string;
  href: string;
  /** Section id used for scroll-spy on project pages. */
  sectionId?: string;
}

/** Navigation shown on a project page — mirrors the section order of the page. */
export const projectNav: NavItem[] = [
  { label: "Overview", href: "#overview", sectionId: "overview" },
  { label: "Properties", href: "#properties", sectionId: "properties" },
  { label: "Payment Plan", href: "#payment-plan", sectionId: "payment-plan" },
  { label: "Master Plan", href: "#master-plan", sectionId: "master-plan" },
  { label: "Amenities", href: "#amenities", sectionId: "amenities" },
  { label: "Gallery", href: "#gallery", sectionId: "gallery" },
  { label: "Location", href: "#location", sectionId: "location" },
  { label: "FAQs", href: "#faqs", sectionId: "faqs" },
];

/** Navigation shown on agency-level pages. */
export const siteNav: NavItem[] = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];
