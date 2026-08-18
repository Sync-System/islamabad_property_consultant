import Link from "next/link";
import type { Metadata } from "next";
import { siteNav } from "@/lib/config/site";
import { allProjects, primaryProject } from "@/lib/projects";
import { isVerified } from "@/lib/projects/types";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { FloatingWhatsApp } from "@/components/conversion/FloatingWhatsApp";
import { MobileLeadBar } from "@/components/conversion/MobileLeadBar";
import { FinalCta } from "@/components/conversion/FinalCta";
import { AgencyTrust } from "@/components/agency/AgencyTrust";
import { ProjectCard } from "@/components/project/ProjectCard";

import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectArt } from "@/components/media/ProjectArt";
import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { buttonClass } from "@/components/ui/button-styles";
import { ArrowIcon } from "@/components/ui/Icon";

/**
 * Agency home.
 *
 * A consultancy's front door, not a second project page: it states what the firm
 * does, how it works, and routes to the project pages that carry the detail.
 */

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const HOW_WE_WORK = [
  {
    step: "Understand",
    body: "We start with your budget, timeline and whether this is a home or a holding. That determines which projects are even worth your time.",
  },
  {
    step: "Verify",
    body: "We give you the current published position — sizes, schedule, status, approvals — and we name our source for each of them.",
  },
  {
    step: "Visit",
    body: "We walk the site with you so you can see what is built and what is still a drawing. No site visit, no informed decision.",
  },
  {
    step: "Proceed carefully",
    body: "We take you through the documentation, the charges beyond the sale price, and the payment schedule before anything is committed.",
  },
];

export default function HomePage() {
  const featured = primaryProject;

  return (
    <>
      <AnalyticsProvider />
      <Header nav={siteNav} overHero />

      <main id="main">
        {/* --- Hero ---------------------------------------------------- */}
        <section
          className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden bg-ink-950 text-paper-50"
          aria-labelledby="home-title"
        >
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <ProjectArt variant="ridge" seed="home" tone="dark" className="h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/65 to-ink-950/75" />
            <div className="grain absolute inset-0" />
          </div>

          <Container className="pb-16 pt-[calc(var(--header-h)+4rem)] lg:pb-24">
            <p
              className="hero-enter flex items-center gap-3.5"
              style={{ "--enter-delay": "40ms" } as React.CSSProperties}
            >
              <span className="h-px w-10 bg-brass-400/70" aria-hidden="true" />
              <span className="eyebrow text-brass-300">
                Property consultancy · Islamabad
              </span>
            </p>

            <div className="mt-7 max-w-5xl overflow-hidden">
              <h1
                id="home-title"
                className="hero-enter-mask optical-left text-h1 text-paper-50"
                style={{ "--enter-delay": "90ms" } as React.CSSProperties}
              >
                Independent guidance for property buyers and investors in
                Islamabad.
              </h1>
            </div>

            <p
              className="hero-enter mt-8 max-w-[52ch] text-lead text-paper-100/80"
              style={{ "--enter-delay": "170ms" } as React.CSSProperties}
            >
              We advise on premium schemes across the capital — with the
              verified position on price, status and documentation, and a clear
              statement of what we could not confirm.
            </p>

            <div
              className="hero-enter mt-10"
              style={{ "--enter-delay": "250ms" } as React.CSSProperties}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={`/projects/${featured.slug}`}
                  className={buttonClass("outlineInverse", "lg", "w-full sm:w-auto")}
                >
                  Explore {featured.shortName}
                  <ArrowIcon size={18} />
                </Link>
                <WhatsAppLink
                  ctaLocation="hero"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Speak to a consultant
                </WhatsAppLink>
              </div>
            </div>
          </Container>
        </section>

        {/* --- Projects ------------------------------------------------ */}
        <Section id="projects" tone="paper" aria-labelledby="home-projects-title">
          <Container>
            <SectionHeader
              eyebrow="Current projects"
              title="Where we are actively advising"
              intro="Each project page carries the developer's published detail, our sourcing, and a direct route to a consultant."
              id="home-projects-title"
              split
            />

            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allProjects.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} />
              ))}

              <Reveal
                as="li"
                delay={120}
                className="flex flex-col justify-between border border-dashed border-ink-900/25 bg-paper-100 p-8"
              >
                <div>
                  <p className="eyebrow text-brass-700">Next</p>
                  <h3 className="mt-5 font-display text-h3 text-ink-900">
                    More projects, as we take them on
                  </h3>
                  <p className="mt-4 text-body-sm text-ink-600">
                    We add a project only once we can source its published detail.
                    Tell us what you are looking for and we will advise whether we
                    cover it.
                  </p>
                </div>
                <WhatsAppLink ctaLocation="project-card" variant="outline" size="md" className="mt-8">
                  Ask what else we cover
                </WhatsAppLink>
              </Reveal>
            </ul>
          </Container>
        </Section>

        {/* --- How we work --------------------------------------------- */}
        <Section tone="pine" aria-labelledby="how-title">
          <Container>
            <SectionHeader
              eyebrow="How we work"
              title="Four steps, in this order"
              id="how-title"
              tone="dark"
              intro="It is a deliberately unglamorous process. It is also the one that stops people paying for something they have not understood."
              split
            />

            <ol className="mt-16 grid gap-px overflow-hidden border border-paper-50/12 bg-paper-50/12 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_WE_WORK.map((item, index) => (
                <Reveal
                  as="li"
                  key={item.step}
                  delay={index * 90}
                  className="bg-pine-950 p-8 lg:p-9"
                >
                  <span className="eyebrow tabular text-brass-400/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-h4 text-paper-50">{item.step}</h3>
                  <p className="mt-4 text-body-sm text-paper-100/70">{item.body}</p>
                </Reveal>
              ))}
            </ol>
          </Container>
        </Section>

        {/* --- Featured detail ------------------------------------------ */}
        <Section tone="paper-alt">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
              <Reveal variant="mask" className="lg:col-span-6">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ProjectArt
                    variant="aerial"
                    seed="home-featured"
                    tone="dark"
                    className="h-full w-full"
                  />
                </div>
              </Reveal>

              <div className="lg:col-span-6">
                <Reveal>
                  <p className="eyebrow text-brass-700">Featured project</p>
                  <h2 className="optical-left mt-5 text-h2 text-ink-900">
                    {featured.name}
                  </h2>
                  <p className="mt-6 max-w-[48ch] text-body-lg text-ink-600">
                    {featured.summary}
                  </p>
                </Reveal>

                <Reveal delay={120}>
                  <dl className="mt-9 grid grid-cols-2 gap-6 border-t border-ink-900/12 pt-7">
                    <div>
                      <dt className="eyebrow text-ink-500">Location</dt>
                      <dd className="mt-2 text-body-sm font-medium text-ink-900">
                        {featured.locationLabel}
                      </dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-ink-500">Status</dt>
                      <dd className="mt-2 text-body-sm font-medium text-ink-900">
                        {isVerified(featured.status)
                          ? featured.status.value
                          : "To confirm"}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="eyebrow text-ink-500">Developed by</dt>
                      <dd className="mt-2 text-body-sm font-medium text-ink-900">
                        {featured.developers.map((d) => d.name).join(" · ")}
                      </dd>
                    </div>
                  </dl>
                </Reveal>

                <Reveal delay={180}>
                  <Link
                    href={`/projects/${featured.slug}`}
                    className={buttonClass("solid", "lg", "mt-9 w-full sm:w-auto")}
                  >
                    View the full project page
                    <ArrowIcon size={18} />
                  </Link>
                </Reveal>
              </div>
            </div>
          </Container>
        </Section>

        <AgencyTrust
          project={featured}
          otherProjects={allProjects
            .filter((p) => p.slug !== featured.slug)
            .map((p) => ({ slug: p.slug, name: p.name }))}
        />

        <FinalCta />
      </main>

      <Footer />
      <FloatingWhatsApp />
      <MobileLeadBar siteVisitHref="#contact" />
    </>
  );
}
