import type { Project } from "@/lib/projects/types";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Development updates.
 *
 * Structured as a chronological timeline so future site visits can be appended
 * as data without touching this component. Deliberately percentage-free: the
 * developer publishes no completion figure, so neither do we — a fabricated
 * "72% complete" is the exact kind of claim this site exists to avoid.
 */

export function DevelopmentProgress({ project }: { project: Project }) {
  const { progress } = project;
  if (progress.entries.length === 0) return null;

  return (
    <Section id="progress" tone="paper" aria-labelledby="progress-title">
      <Container>
        <SectionHeader
          eyebrow="Development"
          title="Where the project actually stands"
          intro={progress.intro}
          id="progress-title"
          split
        />

        <ol className="mt-16 space-y-14 lg:mt-20 lg:space-y-20">
          {progress.entries.map((entry, index) => (
            <Reveal
              as="li"
              key={entry.date + entry.phase}
              delay={index * 80}
              className="grid gap-7 lg:grid-cols-12 lg:gap-12"
            >
              <div className="lg:col-span-4">
                <div className="flex items-baseline gap-4 border-t border-line pt-5">
                  <span className="eyebrow tabular text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    {entry.isoDate ? (
                      <time dateTime={entry.isoDate} className="eyebrow text-content-subtle">
                        {entry.date}
                      </time>
                    ) : (
                      <p className="eyebrow text-content-subtle">{entry.date}</p>
                    )}
                    <h3 className="mt-3 font-display text-h4 text-content">
                      {entry.phase}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <p className="text-body-sm text-content-muted">{entry.note}</p>
                {entry.source && (
                  <p className="mt-4 text-micro text-content-subtle">
                    Source: {entry.source.label}
                    {entry.source.checkedOn ? ` · checked ${entry.source.checkedOn}` : ""}
                  </p>
                )}
              </div>

              {entry.media && (
                <div className="lg:col-span-4">
                  <ProjectMedia
                    media={entry.media}
                    seed={`prog-${index}`}
                    sizes="(max-width: 1024px) 92vw, 30vw"
                    className="w-full"
                  />
                </div>
              )}
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
