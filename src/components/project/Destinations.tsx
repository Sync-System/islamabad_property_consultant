import type { Project } from "@/lib/projects/types";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The three named landmark destinations.
 *
 * Presented as full-height editorial panels rather than icon tiles, because
 * these are the parts of the scheme a buyer forms a mental picture of. The
 * middle panel is offset vertically on desktop so the row reads as a
 * composition instead of three equal boxes.
 */

export function Destinations({ project }: { project: Project }) {
  const { destinations } = project;
  if (destinations.items.length === 0) return null;

  return (
    <Section id="destinations" tone="paper" aria-labelledby="destinations-title">
      <Container>
        <SectionHeader
          eyebrow={destinations.eyebrow}
          title={destinations.title}
          intro={destinations.intro}
          id="destinations-title"
          split
        />

        <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-6">
          {destinations.items.map((destination, index) => (
            <Reveal
              as="li"
              key={destination.name}
              delay={index * 110}
              className={`group flex flex-col ${
                index === 1 ? "lg:mt-16" : index === 2 ? "lg:mt-8" : ""
              }`}
            >
              <div className="relative overflow-hidden">
                <ProjectMedia
                  media={destination.media}
                  seed={`dest-${index}`}
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                  className="w-full transition-transform duration-[1100ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.05]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent"
                />
                {/* The eyebrow sits top-left, where the bottom-up gradient
                    gives it nothing to read against. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink-950/75 to-transparent"
                />
                <p className="absolute left-5 top-5 eyebrow text-brass-300">
                  {destination.eyebrow}
                </p>
              </div>

              <h3 className="mt-6 font-display text-h3 text-ink-900">
                {destination.name}
              </h3>
              <p className="mt-4 text-body-sm text-ink-600">
                {destination.description}
              </p>

              {destination.facilities && (
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {destination.facilities.map((facility) => (
                    <li
                      key={facility}
                      className="border border-ink-900/15 px-2.5 py-1 text-[0.6875rem] tracking-[0.04em] text-ink-600"
                    >
                      {facility}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
