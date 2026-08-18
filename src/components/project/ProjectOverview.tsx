import type { Project } from "@/lib/projects/types";
import { Container, Section } from "@/components/ui/Section";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { MediaCredit } from "@/components/media/MediaCredit";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Editorial project story.
 *
 * An asymmetric two-column composition: the argument runs down a narrow measure
 * on the left while the imagery steps out of the grid on the right. The pull
 * quote breaks the column entirely, which is what stops a long read from
 * flattening into a wall of paragraphs.
 */

export function ProjectOverview({ project }: { project: Project }) {
  const { overview } = project;
  const [primaryMedia, secondaryMedia] = overview.media;

  return (
    <Section id="overview" tone="paper" aria-labelledby="overview-title">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* --- Argument --------------------------------------------------- */}
          <div className="lg:col-span-6 lg:pr-6">
            <Reveal>
              <p className="flex items-center gap-3.5">
                <span className="h-px w-8 bg-accent/45" aria-hidden="true" />
                <span className="eyebrow text-accent">{overview.eyebrow}</span>
              </p>
              <h2
                id="overview-title"
                className="optical-left mt-5 text-h2 text-content"
              >
                {overview.title}
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-8 border-l-2 border-accent/45 pl-6 text-lead text-content">
                {overview.lead}
              </p>
            </Reveal>

            <div className="mt-9 space-y-6">
              {overview.body.map((paragraph, index) => (
                <Reveal key={index} delay={160 + index * 80}>
                  <p className="max-w-[58ch] text-body text-content-muted">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* --- Imagery ----------------------------------------------------- */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-12 gap-4 sm:gap-6">
              {primaryMedia && (
                <Reveal variant="mask" className="col-span-12 sm:col-span-9">
                  <figure>
                    <ProjectMedia
                      media={primaryMedia}
                      seed="ov-1"
                      sizes="(max-width: 1024px) 90vw, 40vw"
                      className="w-full"
                    />
                    {(primaryMedia.caption || primaryMedia.credit) && (
                      <figcaption className="mt-3 text-micro text-content-subtle">
                        {primaryMedia.caption}
                        <MediaCredit media={primaryMedia} className="mt-1" />
                      </figcaption>
                    )}
                  </figure>
                </Reveal>
              )}

              {secondaryMedia && (
                <Reveal
                  variant="mask"
                  delay={200}
                  className="col-span-8 col-start-5 -mt-12 sm:col-span-6 sm:col-start-7 sm:-mt-20"
                >
                  <figure>
                    <ProjectMedia
                      media={secondaryMedia}
                      seed="ov-2"
                      sizes="(max-width: 1024px) 60vw, 26vw"
                      className="w-full border-4 border-line-strong"
                    />
                    {(secondaryMedia.caption || secondaryMedia.credit) && (
                      <figcaption className="mt-3 text-micro text-content-subtle">
                        {secondaryMedia.caption}
                        <MediaCredit media={secondaryMedia} className="mt-1" />
                      </figcaption>
                    )}
                  </figure>
                </Reveal>
              )}
            </div>

            {overview.pullQuote && (
              <Reveal delay={260}>
                <blockquote className="mt-14 max-w-[34ch] font-display text-h3 leading-[1.15] text-content sm:mt-16">
                  <span aria-hidden="true" className="text-accent">
                    &ldquo;
                  </span>
                  {overview.pullQuote}
                </blockquote>
              </Reveal>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
