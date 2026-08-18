import { agencyConfig } from "@/lib/config/agency";
import { telUrl } from "@/lib/whatsapp";
import { Container, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink, PhoneLink } from "@/components/conversion/WhatsAppLink";
import { ProjectArt } from "@/components/media/ProjectArt";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { MediaCredit } from "@/components/media/MediaCredit";
import type { Media } from "@/lib/projects/types";
import { buttonClass } from "@/components/ui/button-styles";
import { CalendarIcon, PhoneIcon } from "@/components/ui/Icon";

/**
 * Closing conversion block.
 *
 * WhatsApp is visually dominant; the site-visit and call actions are present
 * but secondary. No countdown, no "only 3 plots left", no manufactured urgency —
 * the reason to act is that a consultant will answer, not that a timer is
 * running out.
 */

interface FinalCtaProps {
  projectName?: string;
  projectSlug?: string;
  projectShortName?: string;
  /** A real closing photo, when the project has one rights-cleared for it. */
  media?: Media;
}

export function FinalCta({
  projectName,
  projectSlug,
  projectShortName,
  media,
}: FinalCtaProps) {
  const subject = projectShortName ?? "premium property in Islamabad";

  return (
    <Section tone="pine" aria-labelledby="final-cta-title" className="overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40">
        {media?.src ? (
          <ProjectMedia media={media} seed="final" sizes="100vw" className="h-full w-full" />
        ) : (
          <ProjectArt variant="ridge" seed="final" className="h-full w-full" />
        )}
      </div>
      {/* Themed scrim, so the closing band is white-on-white in the light
          theme rather than a lone dark slab at the foot of the page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, var(--scrim-1), var(--scrim-0) 55%, var(--scrim-0))",
        }}
      />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0" />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="flex items-center justify-center gap-3.5">
              <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
              <span className="eyebrow text-accent">Next step</span>
              <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
            </p>
            <h2 id="final-cta-title" className="mt-6 text-h1 text-content">
              Considering {subject}?
            </h2>
            <p className="mx-auto mt-6 max-w-[46ch] text-body-lg text-content-muted">
              Speak directly with {agencyConfig.name} for current project
              information, availability and site-visit guidance.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <WhatsAppLink
                ctaLocation="final-cta"
                projectName={projectName}
                projectSlug={projectSlug}
                size="lg"
                className="w-full sm:w-auto sm:min-w-[16rem]"
              >
                Chat on WhatsApp
              </WhatsAppLink>

              <a
                href="#site-visit"
                className={buttonClass("outline", "lg", "w-full sm:w-auto")}
              >
                <CalendarIcon size={18} />
                Request a site visit
              </a>

              <PhoneLink
                href={telUrl}
                ctaLocation="final-cta"
                bare
                className="inline-flex min-h-14 items-center justify-center gap-2 px-2 text-[0.9375rem] font-medium text-content-muted underline-offset-[6px] transition-colors hover:text-content hover:underline"
              >
                <PhoneIcon size={18} />
                Call {agencyConfig.phoneDisplay}
              </PhoneLink>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <p className="mx-auto mt-10 max-w-[58ch] text-micro leading-relaxed text-content-subtle">
              {agencyConfig.independenceNotice}
            </p>
            {media?.credit && (
              <MediaCredit media={media} className="mt-2" />
            )}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
