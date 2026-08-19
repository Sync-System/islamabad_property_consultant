import type { Project } from "@/lib/projects/types";
import { isVerified } from "@/lib/projects/types";
import { agencyConfig } from "@/lib/config/agency";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { buttonClass } from "@/components/ui/button-styles";
import { ArrowDownIcon, CalendarIcon } from "@/components/ui/Icon";
import { MediaCredit } from "@/components/media/MediaCredit";
import { HeroBackdrop } from "./HeroBackdrop";

/**
 * Full-viewport project hero.
 *
 * Five questions have to be answered before a visitor decides to scroll:
 * what the project is, where it is, why it matters, who is speaking, and how to
 * reach them. Everything above the fold serves one of those five and nothing
 * else — the eyebrow names the agency, the title and location answer what and
 * where, the association line carries the credibility, and the CTA pair answers
 * how.
 */

export function ProjectHero({ project }: { project: Project }) {
  const { hero } = project;
  const association = isVerified(hero.association) ? hero.association.value : null;

  return (
    <section
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-surface-feature text-content"
      aria-labelledby="hero-title"
    >
      {/* --- Backdrop ------------------------------------------------------ */}
      <div className="absolute inset-0 -z-10">
        <HeroBackdrop>
          <div className="absolute inset-x-0 -top-[8%] h-[116%]">
            <ProjectMedia
              media={hero.media}
              priority
              sizes="(max-width: 768px) 180vw, 100vw"
              className="h-full w-full"
              ratio={undefined}
              seed="hero"
            />
          </div>
        </HeroBackdrop>

        {/* Three scrims, each with one job: ground the copy at the bottom, seat
            the header at the top, and veil the left column where the display
            type sits — so the photograph stays visible instead of being
            flattened by one blanket overlay.

            They come from `--hero-veil-*`, which is defined per theme so each
            can concentrate the veil where its copy actually sits. That is what
            lets the light theme keep the Margallas clearly visible in the
            upper-right while the lower-left stays near-white under the type. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundImage: "var(--hero-veil-bottom)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundImage: "var(--hero-veil-side)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-44"
          style={{ backgroundImage: "var(--hero-veil-top)" }}
        />
        <div aria-hidden="true" className="grain absolute inset-0" />
      </div>

      {/* --- Content ------------------------------------------------------- */}
      <div className="mx-auto flex w-full max-w-wide flex-1 flex-col justify-end px-gutter pb-14 pt-[calc(var(--header-h)+3rem)] sm:px-8 lg:px-12 lg:pb-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <p
              className="hero-enter flex items-center gap-3.5"
              style={{ "--enter-delay": "40ms" } as React.CSSProperties}
            >
              <span className="h-px w-10 bg-accent/60" aria-hidden="true" />
              <span className="eyebrow text-accent">{hero.eyebrow}</span>
            </p>

            <div className="mt-6 overflow-hidden">
              <h1
                id="hero-title"
                className="hero-enter-mask optical-left font-display text-display leading-[0.86] text-content"
                style={{ "--enter-delay": "90ms" } as React.CSSProperties}
              >
                {hero.title}
              </h1>
            </div>

            <p
              className="hero-enter mt-7 max-w-[46ch] text-lead text-content-muted"
              style={{ "--enter-delay": "170ms" } as React.CSSProperties}
            >
              {hero.subtitle}
            </p>

            <div
              className="hero-enter mt-8"
              style={{ "--enter-delay": "250ms" } as React.CSSProperties}
            >
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.8125rem] text-content-muted">
                <span className="flex items-center gap-2">
                  <span className="size-1.5 rounded-pill bg-accent" aria-hidden="true" />
                  {hero.locationLabel}
                </span>
                {association && (
                  <>
                    <span className="hidden h-3.5 w-px bg-line-strong sm:block" aria-hidden="true" />
                    <span>{association}</span>
                  </>
                )}
              </div>
            </div>

            <div
              className="hero-enter mt-10"
              style={{ "--enter-delay": "330ms" } as React.CSSProperties}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <WhatsAppLink
                  ctaLocation="hero"
                  projectName={project.name}
                  projectSlug={project.slug}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {hero.primaryCta}
                </WhatsAppLink>

                <a
                  href="#overview"
                  className={buttonClass("outline", "lg", "w-full sm:w-auto")}
                >
                  {hero.secondaryCta}
                </a>

                <a
                  href="#site-visit"
                  className="inline-flex min-h-12 items-center justify-center gap-2 px-1 text-[0.875rem] font-medium text-content-muted underline-offset-[6px] transition-colors hover:text-content hover:underline sm:ml-1"
                >
                  <CalendarIcon size={17} />
                  Request a site visit
                </a>
              </div>
            </div>
          </div>

          {/* Right rail: who is speaking, and the standing disclosure. */}
          <div
            className="hero-enter lg:col-span-4 lg:pb-2"
            style={{ "--enter-delay": "410ms" } as React.CSSProperties}
          >
            <div className="border-l border-line pl-5 lg:pl-7">
              <p className="eyebrow text-content-muted">Presented by</p>
              <p className="mt-3 font-display text-h4 text-content">
                {agencyConfig.name}
              </p>
              <p className="mt-3 text-body-sm text-content-muted">
                {agencyConfig.positioning} We are an independent consultancy —
                not CDA, DHA, or the developer.
              </p>
            </div>
          </div>
        </div>

        {/* --- Scroll cue -------------------------------------------------- */}
        <div className="mt-12 flex items-center justify-between border-t border-line pt-6 lg:mt-16">
          <a
            href="#overview"
            className="group flex min-h-11 items-center gap-3 pr-2 text-[0.75rem] tracking-[0.16em] text-content-muted uppercase transition-colors hover:text-content"
          >
            <span
              aria-hidden="true"
              className="relative block h-8 w-px overflow-hidden bg-line-strong"
            >
              <span
                className="absolute inset-0 bg-accent"
                style={{ animation: "scroll-hint 2.6s var(--ease-in-out-quart) infinite" }}
              />
            </span>
            Scroll
            <ArrowDownIcon
              size={15}
              className="transition-transform duration-400 group-hover:translate-y-0.5"
            />
          </a>

          <div className="hidden max-w-[42ch] text-right sm:block">
            <p className="text-micro text-content-muted">
              Project information is compiled from the developer&rsquo;s
              published material. Verify current details before any financial
              decision.
            </p>
            {/* Contextual photograph of the Margallas, not the project site. */}
            <MediaCredit media={hero.media} className="mt-1.5" />
          </div>
        </div>
      </div>
    </section>
  );
}
