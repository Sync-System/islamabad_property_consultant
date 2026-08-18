import type { Project } from "@/lib/projects/types";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { ProjectArt } from "@/components/media/ProjectArt";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { MediaCredit } from "@/components/media/MediaCredit";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";

/**
 * Why buyers are looking here.
 *
 * Deliberately structured as a numbered argument rather than a grid of feature
 * cards — the last item is the one that lists what still needs the buyer's own
 * diligence. Leading with strengths and closing with caveats is what a
 * consultant does; a brochure does the opposite.
 *
 * There is no "guaranteed return" language anywhere in this data, and the
 * component provides no slot for it.
 */

export function InvestmentHighlights({ project }: { project: Project }) {
  const { highlights } = project;

  return (
    <Section id="why" tone="pine" aria-labelledby="highlights-title">
      <Container>
        <SectionHeader
          eyebrow={highlights.eyebrow}
          title={highlights.title}
          intro={highlights.intro}
          id="highlights-title"
          tone="dark"
          split
        />

        <ul className="mt-16 grid gap-px overflow-hidden border border-paper-50/12 bg-paper-50/12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {highlights.items.map((item, index) => {
            const isLast = index === highlights.items.length - 1;
            return (
              <Reveal
                as="li"
                key={item.title}
                delay={index * 90}
                className={`group relative isolate overflow-hidden bg-pine-950 p-8 lg:p-10 ${
                  isLast ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                {/* A real photo where one actually illustrates the point; the
                    generated composition elsewhere, so an abstract item never
                    borrows a photo it has no claim to. Both sit behind at low
                    opacity and lift on hover. */}
                {(item.media?.src || item.art) && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 opacity-[0.28] transition-opacity duration-700 ease-[var(--ease-out-quint)] group-hover:opacity-45"
                  >
                    {item.media?.src ? (
                      <ProjectMedia
                        media={item.media}
                        seed={`hl-${index}`}
                        sizes="(max-width: 640px) 100vw, 34vw"
                        className="h-full w-full"
                      />
                    ) : (
                      <ProjectArt
                        variant={item.art!}
                        seed={`hl-${index}`}
                        tone="dark"
                        className="h-full w-full"
                      />
                    )}
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-gradient-to-t from-pine-950 via-pine-950/85 to-pine-950/55"
                />

                <div className="flex items-baseline gap-4">
                  <span className="eyebrow tabular text-brass-400/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="eyebrow text-paper-100/50">{item.category}</span>
                </div>

                <h3 className="mt-6 text-h4 text-paper-50">{item.title}</h3>
                <p className="mt-4 text-body-sm text-paper-100/70">{item.body}</p>
                {item.media?.credit && (
                  <MediaCredit media={item.media} tone="dark" className="mt-3" />
                )}

                <span
                  aria-hidden="true"
                  className="mt-8 block h-px w-10 origin-left scale-x-100 bg-brass-500/60 transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-x-[2.6]"
                />
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={120} className="mt-12 lg:mt-14">
          <div className="flex flex-col gap-5 border-t border-paper-50/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[52ch] text-body-sm text-paper-100/65">
              We will not tell you a plot is guaranteed to appreciate. We will
              tell you what is verified, what is not, and what to check before
              you pay anything.
            </p>
            <WhatsAppLink
              ctaLocation="highlights"
              projectName={project.name}
              projectSlug={project.slug}
              variant="outlineInverse"
              size="md"
              className="shrink-0"
            >
              Ask us a hard question
            </WhatsAppLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
