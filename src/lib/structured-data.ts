import { agencyConfig, resolved } from "./config/agency";
import { absoluteUrl, siteConfig } from "./config/site";
import type { Faq, Project } from "./projects/types";

/**
 * Schema.org payloads.
 *
 * Two rules govern what appears here:
 *  1. Nothing is emitted that is not visible on the page. Structured data that
 *     contradicts the page is a manual-action risk, not an SEO win.
 *  2. Placeholder config values are omitted entirely rather than serialised as
 *     "[EMAIL]" — a knowledge panel showing a bracketed token is worse than a
 *     missing field.
 */

type Json = Record<string, unknown>;

function compact(input: Json): Json {
  return Object.fromEntries(
    Object.entries(input).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
}

export function organizationSchema(): Json {
  const email = resolved(agencyConfig.email);
  const address = resolved(agencyConfig.officeAddress);
  const sameAs = agencyConfig.social
    .map((s) => resolved(s.href))
    .filter((href): href is string => Boolean(href));

  return compact({
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": absoluteUrl("/#organization"),
    name: agencyConfig.name,
    legalName: agencyConfig.legalName,
    description: agencyConfig.description,
    url: siteConfig.url,
    telephone: agencyConfig.phone,
    email,
    areaServed: { "@type": "City", name: "Islamabad", addressCountry: "PK" },
    address: address
      ? compact({
          "@type": "PostalAddress",
          streetAddress: address,
          addressLocality: "Islamabad",
          addressCountry: "PK",
        })
      : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    knowsLanguage: ["en", "ur"],
  });
}

export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en-PK",
  };
}

export function breadcrumbSchema(
  trail: { name: string; path: string }[],
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path),
    })),
  };
}

/**
 * FAQPage markup.
 *
 * Google restricts rich FAQ results to authoritative government and health
 * sites, so this is emitted for semantic clarity rather than for a rich result.
 * It qualifies on the terms that still matter: every question and answer here
 * is visible on the page, in full, with no gating.
 */
export function faqSchema(faqs: Faq[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/**
 * Project markup.
 *
 * Typed as `Residence` with an `offers` block only where a price is verified.
 * Prices carry `priceValidUntil`-free semantics deliberately: the developer
 * revises schedules between ballots, so we describe rather than assert.
 */
export function projectSchema(project: Project): Json {
  const verifiedPrices = project.propertyOptions.items
    .filter((item) => item.startingPrice?.verified)
    .map((item) =>
      compact({
        "@type": "Offer",
        name: `${item.type} — ${item.size}`,
        priceCurrency: "PKR",
        price:
          item.startingPrice?.verified === true
            ? item.startingPrice.value.replace(/[^\d]/g, "")
            : undefined,
        availability: "https://schema.org/PreOrder",
        url: absoluteUrl(`/projects/${project.slug}#properties`),
      }),
    );

  return compact({
    "@context": "https://schema.org",
    "@type": "Residence",
    "@id": absoluteUrl(`/projects/${project.slug}#project`),
    name: project.name,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}`),
    address: {
      "@type": "PostalAddress",
      addressLocality: project.city,
      addressRegion: project.locationLabel,
      addressCountry: "PK",
    },
    amenityFeature: project.amenities.items.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity.title,
      value: true,
    })),
    makesOffer: verifiedPrices.length ? verifiedPrices : undefined,
    provider: { "@id": absoluteUrl("/#organization") },
  });
}

/** Serialises a schema object for a <script type="application/ld+json"> tag. */
export function jsonLd(...schemas: Json[]): string {
  const payload = schemas.length === 1 ? schemas[0] : schemas;
  // `<` is escaped so the payload can never terminate the script element.
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}
