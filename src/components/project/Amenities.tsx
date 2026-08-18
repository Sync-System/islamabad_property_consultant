import type { Project } from "@/lib/projects/types";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { AmenityGlyph } from "@/components/ui/Icon";
import { ProjectArt } from "@/components/media/ProjectArt";

/**
 * Community planning.
 *
 * A two-column editorial list rather than the usual grid of twenty identical
 * icon tiles: each entry gets a real sentence explaining what it means, and the
 * attribution line under the heading makes clear this is the developer's
 * commitment, not our embellishment of it.
 */

export function Amenities({ project }: { project: Project }) {
  const { amenities } = project;

  return (
    <Section id="amenities" tone="pine" aria-labelledby="amenities-title">
      {/* A single large drawing anchors the section without competing with text. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-[0.16] lg:block"
      >
        <ProjectArt variant="canopy" seed="amenities" tone="dark" className="h-full w-full" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-pine-950 via-pine-950/85 to-transparent lg:block"
      />

      <Container className="relative">
        <SectionHeader
          eyebrow={amenities.eyebrow}
          title={amenities.title}
          intro={amenities.intro}
          id="amenities-title"
          tone="dark"
          split
        />

        <ul className="mt-16 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:mt-20 lg:max-w-4xl">
          {amenities.items.map((amenity, index) => (
            <Reveal
              as="li"
              key={amenity.title}
              delay={(index % 2) * 90}
              className="group flex gap-5 border-t border-paper-50/12 pt-6"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-brass-400 transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5"
              >
                <AmenityGlyph name={amenity.icon} size={26} />
              </span>
              <div>
                <h3 className="text-h4 text-paper-50">{amenity.title}</h3>
                {amenity.description && (
                  <p className="mt-2.5 text-body-sm text-paper-100/65">
                    {amenity.description}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </ul>

        {amenities.source && (
          <Reveal delay={120}>
            <p className="mt-12 text-micro text-paper-100/45">
              Amenity list as published by {amenities.source.label}
              {amenities.source.checkedOn
                ? `, checked ${amenities.source.checkedOn}`
                : ""}
              . Planned facilities are subject to the developer&rsquo;s
              construction programme.
            </p>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}
