import type { Project } from "@/lib/projects/types";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { AmenityGlyph } from "@/components/ui/Icon";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { MediaCredit } from "@/components/media/MediaCredit";

/**
 * Community planning.
 *
 * A two-column editorial list rather than the usual grid of twenty identical
 * icon tiles: each entry gets a real sentence explaining what it means, and the
 * attribution line under the heading makes clear this is the developer's
 * commitment, not our embellishment of it.
 */

const AMENITIES_BACKDROP = {
  src: "/projects/margalla-enclave/gallery/margalla-forest.jpg",
  alt: "Forest and hillside in Margalla Hills National Park",
  width: 1800,
  height: 1350,
  credit: "Hashim bajwa · CC BY-SA 4.0",
};

export function Amenities({ project }: { project: Project }) {
  const { amenities } = project;

  return (
    <Section id="amenities" tone="pine" aria-labelledby="amenities-title">
      {/* A real forest photo anchors the section without competing with text —
          Margalla Hills National Park, the same range the amenity list's
          "botanical garden and parks" line describes generally. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-[0.32] lg:block"
      >
        <ProjectMedia
          media={AMENITIES_BACKDROP}
          seed="amenities"
          sizes="50vw"
          className="h-full w-full"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--surface-feature), color-mix(in srgb, var(--surface-feature) 85%, transparent) 55%, transparent)",
        }}
      />

      <Container className="relative">
        <SectionHeader
          eyebrow={amenities.eyebrow}
          title={amenities.title}
          intro={amenities.intro}
          id="amenities-title"
          split
        />

        <ul className="mt-16 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:mt-20 lg:max-w-4xl">
          {amenities.items.map((amenity, index) => (
            <Reveal
              as="li"
              key={amenity.title}
              delay={(index % 2) * 90}
              className="group flex gap-5 border-t border-line pt-6"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-accent transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5"
              >
                <AmenityGlyph name={amenity.icon} size={26} />
              </span>
              <div>
                <h3 className="text-h4 text-content">{amenity.title}</h3>
                {amenity.description && (
                  <p className="mt-2.5 text-body-sm text-content-muted">
                    {amenity.description}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </ul>

        {amenities.source && (
          <Reveal delay={120}>
            <p className="mt-12 text-micro text-content-subtle">
              Amenity list as published by {amenities.source.label}
              {amenities.source.checkedOn
                ? `, checked ${amenities.source.checkedOn}`
                : ""}
              . Planned facilities are subject to the developer&rsquo;s
              construction programme.
            </p>
          </Reveal>
        )}
        <MediaCredit media={AMENITIES_BACKDROP} className="mt-3" />
      </Container>
    </Section>
  );
}
