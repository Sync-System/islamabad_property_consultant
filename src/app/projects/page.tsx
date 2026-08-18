import type { Metadata } from "next";
import Link from "next/link";
import { allProjects, projectFacets } from "@/lib/projects";
import { siteNav, absoluteUrl } from "@/lib/config/site";
import { breadcrumbSchema, jsonLd } from "@/lib/structured-data";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { FloatingWhatsApp } from "@/components/conversion/FloatingWhatsApp";
import { MobileLeadBar } from "@/components/conversion/MobileLeadBar";
import { FinalCta } from "@/components/conversion/FinalCta";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Container, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";

/**
 * Projects directory.
 *
 * With one project live, filters would be theatre — so the facets are computed
 * and displayed as a summary of coverage rather than rendered as controls. The
 * data (`projectFacets`) is already shaped for real filtering; the UI can be
 * switched on the moment there is enough to filter.
 */

export const metadata: Metadata = {
  title: "Projects in Islamabad",
  description:
    "Premium real-estate projects Islamabad Property Consultant currently advises on, including Margalla Enclave in Zone 4 — a CDA and DHA Islamabad joint venture.",
  alternates: { canonical: "/projects" },
  openGraph: {
    url: absoluteUrl("/projects"),
    title: "Projects in Islamabad | Islamabad Property Consultant",
    description:
      "Premium real-estate projects Islamabad Property Consultant currently advises on.",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
            ]),
          ),
        }}
      />
      <AnalyticsProvider />
      <Header nav={siteNav} />

      <main id="main">
        <Section tone="paper" className="pt-[calc(var(--header-h)+4rem)]">
          <Container>
            <Reveal>
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-micro text-ink-500">
                  <li>
                    <Link href="/" className="hover:text-ink-900">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-ink-900">
                    Projects
                  </li>
                </ol>
              </nav>

              <h1 className="optical-left mt-8 max-w-3xl text-h1 text-ink-900">
                Projects we advise on
              </h1>
              <p className="mt-7 max-w-[54ch] text-lead text-ink-600">
                We take on a project only once we can source its published
                detail. Each page below carries the developer&rsquo;s figures,
                our attribution, and a direct line to a consultant.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <dl className="mt-12 grid grid-cols-2 gap-6 border-y border-ink-900/12 py-7 sm:grid-cols-4">
                <div>
                  <dt className="eyebrow text-ink-500">Live projects</dt>
                  <dd className="tabular mt-2 font-display text-h4 text-ink-900">
                    {allProjects.length}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink-500">Cities</dt>
                  <dd className="mt-2 text-body-sm font-medium text-ink-900">
                    {projectFacets.cities.join(", ")}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="eyebrow text-ink-500">Property types</dt>
                  <dd className="mt-2 text-body-sm font-medium text-ink-900">
                    {projectFacets.types.join(" · ")}
                  </dd>
                </div>
              </dl>
            </Reveal>

            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allProjects.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} />
              ))}

              <Reveal
                as="li"
                delay={120}
                className="flex flex-col justify-between border border-dashed border-ink-900/25 bg-paper-100 p-8"
              >
                <div>
                  <p className="eyebrow text-brass-700">Looking for something else?</p>
                  <h2 className="mt-5 font-display text-h3 text-ink-900">
                    Tell us what you are trying to buy
                  </h2>
                  <p className="mt-4 text-body-sm text-ink-600">
                    Plots, houses, apartments or commercial — if we do not cover
                    it, we will say so rather than sell you something adjacent.
                  </p>
                </div>
                <WhatsAppLink
                  ctaLocation="project-card"
                  variant="outline"
                  size="md"
                  className="mt-8"
                >
                  Ask a consultant
                </WhatsAppLink>
              </Reveal>
            </ul>
          </Container>
        </Section>

        <FinalCta />
      </main>

      <Footer />
      <FloatingWhatsApp />
      <MobileLeadBar siteVisitHref="/#contact" />
    </>
  );
}
