"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/lib/projects/types";
import { isVerified } from "@/lib/projects/types";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { MediaCredit } from "@/components/media/MediaCredit";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { InfoIcon, PinIcon } from "@/components/ui/Icon";
import { getAttribution } from "@/lib/attribution";
import { track } from "@/lib/analytics";

/**
 * Location.
 *
 * Drive times are the most commonly fabricated numbers in Pakistani property
 * marketing, so each one here renders only if `isVerified()` passes, and each
 * carries the developer's name as its attribution. An unverified distance
 * renders as "ask us" — never as a plausible-looking number.
 *
 * The map embed is placeholder-aware: with no verified embed URL configured we
 * show the location diagram and a WhatsApp route to a pinned location rather
 * than an iframe pointing at a guessed coordinate.
 */

export function LocationSection({ project }: { project: Project }) {
  const { location } = project;
  const ref = useRef<HTMLDivElement>(null);
  const seen = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !seen.current) {
          seen.current = true;
          track(
            "location_view",
            { ctaLocation: "location", projectSlug: project.slug },
            getAttribution(),
          );
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [project.slug]);

  return (
    <Section id="location" tone="paper-alt" aria-labelledby="location-title">
      <div ref={ref}>
        <Container>
          <SectionHeader
            eyebrow="Location"
            title="Where it sits, and what that means"
            intro={location.addressLine}
            id="location-title"
            split
          />

          <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* --- Map / diagram ------------------------------------------ */}
            <Reveal variant="mask" className="lg:col-span-7">
              {location.mapEmbedUrl ? (
                <>
                  <iframe
                    src={location.mapEmbedUrl}
                    title={`Map of the road and zone ${project.name} addresses`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="aspect-[3/2] w-full border border-ink-900/12"
                  />
                  {/* Google's own resolution of the road/zone, not a plot-accurate
                      pin — we do not have verified boundary coordinates, so this
                      says exactly what it is rather than implying more precision
                      than we have. */}
                  <p className="mt-3 flex items-start gap-2.5 text-micro text-ink-500">
                    <InfoIcon size={15} className="mt-px shrink-0 text-brass-700" />
                    <span>
                      Google Maps&rsquo; own location for {location.road ?? "the road"}{" "}
                      in {location.zone ?? "the zone"} — the general area the
                      project addresses, not a confirmed plot boundary.
                      {location.mapLinkUrl && (
                        <>
                          {" "}
                          <a
                            href={location.mapLinkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-ink-700 underline decoration-brass-500/60 underline-offset-4 hover:text-ink-900"
                          >
                            Open in Google Maps
                          </a>
                          .
                        </>
                      )}
                    </span>
                  </p>
                </>
              ) : (
                <div className="relative">
                  <ProjectMedia
                    media={location.media}
                    seed="location"
                    sizes="(max-width: 1024px) 92vw, 58vw"
                    className="w-full border border-ink-900/12"
                  />
                  <p className="absolute inset-x-4 bottom-4 flex items-start gap-2.5 bg-paper-50/92 p-3.5 text-micro text-ink-600 backdrop-blur-sm">
                    <InfoIcon size={15} className="mt-px shrink-0 text-brass-700" />
                    An interactive map will be published once we have confirmed
                    the exact site boundary with the developer. Ask us for a
                    pinned location on WhatsApp.
                  </p>
                  <MediaCredit media={location.media} className="mt-2" />
                </div>
              )}
            </Reveal>

            {/* --- Verified distances ------------------------------------- */}
            <div className="lg:col-span-5">
              <Reveal>
                <h3 className="eyebrow text-brass-700">Connectivity</h3>
              </Reveal>

              <ul className="mt-6 divide-y divide-ink-900/10 border-y border-ink-900/10">
                {location.nearby.map((place, index) => (
                  <Reveal
                    as="li"
                    key={place.name}
                    delay={index * 70}
                    className="flex items-center justify-between gap-5 py-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <PinIcon size={18} className="shrink-0 text-ink-400" />
                      <div>
                        <p className="text-body-sm font-medium text-ink-900">
                          {place.name}
                        </p>
                        {place.kind && (
                          <p className="text-micro text-ink-500">{place.kind}</p>
                        )}
                      </div>
                    </div>
                    <p className="shrink-0 text-right">
                      {isVerified(place.distance) ? (
                        <span className="tabular text-body-sm font-semibold text-ink-900">
                          {place.distance.value}
                        </span>
                      ) : (
                        <span className="text-micro text-brass-700">Ask us</span>
                      )}
                    </p>
                  </Reveal>
                ))}
              </ul>

              <Reveal delay={140}>
                <p className="mt-4 text-micro leading-relaxed text-ink-500">
                  Drive times are as published by {project.officialSource.label} and
                  will vary with traffic and your point of origin. We do not
                  publish distances we cannot attribute.
                </p>
              </Reveal>

              {location.accessNotes && (
                <div className="mt-8 space-y-5">
                  {location.accessNotes.map((note, index) => (
                    <Reveal key={note.title} delay={160 + index * 70}>
                      <h4 className="font-sans text-body-sm font-semibold text-ink-900">
                        {note.title}
                      </h4>
                      <p className="mt-1.5 text-body-sm text-ink-600">{note.body}</p>
                    </Reveal>
                  ))}
                </div>
              )}

              <Reveal delay={220}>
                <WhatsAppLink
                  ctaLocation="location"
                  projectName={project.name}
                  projectSlug={project.slug}
                  propertyPreference="Site location and directions"
                  size="lg"
                  className="mt-8 w-full sm:w-auto"
                >
                  Get directions and a pinned location
                </WhatsAppLink>
              </Reveal>
            </div>
          </div>

          {isVerified(location.sector) && (
            <Reveal delay={120}>
              <p className="mt-10 border-l-2 border-brass-500/45 pl-5 text-body-sm text-ink-600">
                {location.sector.value}.{" "}
                <span className="text-ink-500">
                  {location.sector.note} Confirm the sector designation on your
                  allotment documentation.
                </span>
              </p>
            </Reveal>
          )}
        </Container>
      </div>
    </Section>
  );
}
