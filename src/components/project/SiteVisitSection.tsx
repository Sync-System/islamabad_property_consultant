import type { Project } from "@/lib/projects/types";
import { Container, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SiteVisitForm } from "@/components/forms/SiteVisitForm";
import { ProjectArt } from "@/components/media/ProjectArt";
import { CheckIcon } from "@/components/ui/Icon";

/**
 * Site-visit request.
 *
 * The highest-intent conversion on the page, so it gets a full dark panel and
 * its own form rather than a line in the footer. The list on the left sets
 * expectations for what a visit actually involves — which is what turns a
 * curious click into someone who turns up.
 */

const WHAT_TO_EXPECT = [
  "A consultant meets you at the site, not a call centre.",
  "We walk the accessible blocks and show you what is built and what is not.",
  "You get the current payment schedule and the documentation checklist in writing.",
  "No pressure to book on the day — we would rather you check everything first.",
];

export function SiteVisitSection({ project }: { project: Project }) {
  return (
    <Section id="site-visit" tone="ink" aria-labelledby="site-visit-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <ProjectArt variant="street" seed="site-visit" className="h-full w-full" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/92 to-ink-950/70"
      />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="flex items-center gap-3.5">
                <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
                <span className="eyebrow text-accent">Site visit</span>
              </p>
              <h2
                id="site-visit-title"
                className="optical-left mt-5 text-h2 text-content"
              >
                Want to visit {project.shortName}?
              </h2>
              <p className="mt-6 max-w-[48ch] text-body-lg text-content-muted">
                Reading about a site is not the same as standing on it. Tell us
                when suits you and we will arrange a guided visit.
              </p>
            </Reveal>

            <ul className="mt-10 space-y-4">
              {WHAT_TO_EXPECT.map((item, index) => (
                <Reveal
                  as="li"
                  key={item}
                  delay={index * 80}
                  className="flex items-start gap-3.5 text-body-sm text-content-muted"
                >
                  <CheckIcon size={18} className="mt-0.5 shrink-0 text-accent" />
                  <span>{item}</span>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={140} className="lg:col-span-6">
            {/* A light card on the dark panel: form controls need paper-level
                contrast, and floating the card gives the section its focus. */}
            <div className="bg-surface p-6 shadow-dialog sm:p-9">
              <SiteVisitForm project={project} />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
