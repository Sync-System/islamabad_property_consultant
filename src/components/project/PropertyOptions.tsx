"use client";

import { useMemo, useState } from "react";
import type { Project, PropertyOption } from "@/lib/projects/types";
import { isVerified } from "@/lib/projects/types";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { ProjectArt } from "@/components/media/ProjectArt";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { InfoIcon } from "@/components/ui/Icon";

/**
 * Plot categories.
 *
 * The WhatsApp CTA on each card carries that specific plot into the message, so
 * a consultant opening the chat already knows which size the enquiry is about —
 * the single highest-leverage detail in a property conversation.
 *
 * Availability is unverified in the data, so the cards say "confirm current
 * availability" rather than inventing scarcity. Published prices are shown with
 * their conditions attached, never as a bare number.
 */

export function PropertyOptions({ project }: { project: Project }) {
  const { propertyOptions } = project;

  const types = useMemo(
    () => [...new Set(propertyOptions.items.map((item) => item.type))],
    [propertyOptions.items],
  );
  const [activeType, setActiveType] = useState(types[0]);

  const visible = propertyOptions.items.filter((item) => item.type === activeType);

  return (
    <Section id="properties" tone="paper-alt" aria-labelledby="properties-title">
      <Container>
        <SectionHeader
          eyebrow={propertyOptions.eyebrow}
          title={propertyOptions.title}
          intro={propertyOptions.intro}
          id="properties-title"
          split
        />

        {types.length > 1 && (
          <Reveal delay={100} className="mt-12">
            <div
              role="tablist"
              aria-label="Plot category"
              className="inline-flex border border-ink-900/15 bg-paper-50"
            >
              {types.map((type) => {
                const selected = type === activeType;
                return (
                  <button
                    key={type}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveType(type)}
                    className={`min-h-12 px-5 text-[0.8125rem] font-semibold transition-colors duration-300 sm:px-7 ${
                      selected
                        ? "bg-ink-900 text-paper-50"
                        : "text-ink-600 hover:bg-ink-900/5 hover:text-ink-900"
                    }`}
                  >
                    {type}
                    <span className="ml-2 text-[0.6875rem] opacity-60">
                      {
                        propertyOptions.items.filter((item) => item.type === type)
                          .length
                      }
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        )}

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {visible.map((option, index) => (
            <OptionCard
              key={option.id}
              option={option}
              index={index}
              projectName={project.name}
              projectSlug={project.slug}
            />
          ))}
        </ul>

        {propertyOptions.allotmentNote && (
          <Reveal delay={120}>
            <p className="mt-8 flex items-start gap-3 text-body-sm text-ink-600">
              <InfoIcon size={18} className="mt-0.5 shrink-0 text-brass-700" />
              {propertyOptions.allotmentNote}
            </p>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

function OptionCard({
  option,
  index,
  projectName,
  projectSlug,
}: {
  option: PropertyOption;
  index: number;
  projectName: string;
  projectSlug: string;
}) {
  const price = isVerified(option.startingPrice) ? option.startingPrice : null;
  const fee = isVerified(option.processingFee) ? option.processingFee : null;
  const preference = `${option.type} — ${option.size}${
    option.sizeAlt ? ` (${option.sizeAlt})` : ""
  }`;

  return (
    <Reveal
      as="li"
      delay={index * 70}
      className="group flex flex-col border border-ink-900/12 bg-paper-50 transition-colors duration-500 hover:border-ink-900/30"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-ink-900">
        {option.art && (
          <ProjectArt
            variant={option.art}
            seed={option.id}
            tone="dark"
            className="absolute inset-0 h-full w-full transition-transform duration-[900ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.05]"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink-950/75 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
          <div>
            <p className="font-display text-h3 leading-none text-paper-50">
              {option.size}
            </p>
            {option.sizeAlt && (
              <p className="mt-2 eyebrow text-brass-300">{option.sizeAlt}</p>
            )}
          </div>
          {option.featured && (
            <span className="eyebrow rounded-xs bg-brass-500 px-2 py-1 text-[0.5625rem] text-ink-950">
              Most asked
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow text-ink-500">{option.purpose}</p>
        {option.description && (
          <p className="mt-4 text-body-sm text-ink-600">{option.description}</p>
        )}

        <dl className="mt-6 space-y-3 border-t border-ink-900/10 pt-5 text-[0.8125rem] sm:mb-6">
          {price && (
            <div>
              <dt className="text-ink-500">Lump-sum price</dt>
              <dd className="tabular mt-1 font-semibold text-ink-900">
                {price.value}
              </dd>
              {price.note && (
                <dd className="mt-1.5 text-micro leading-relaxed text-ink-500">
                  {price.note}
                </dd>
              )}
            </div>
          )}
          {fee && (
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-ink-500">Processing fee</dt>
              <dd className="tabular font-medium text-ink-800">{fee.value}</dd>
            </div>
          )}
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-ink-500">Availability</dt>
            <dd className="text-right font-medium text-brass-700">
              {isVerified(option.availability)
                ? option.availability.value
                : "Confirm with us"}
            </dd>
          </div>
        </dl>

        <WhatsAppLink
          ctaLocation="properties"
          projectName={projectName}
          projectSlug={projectSlug}
          propertyPreference={preference}
          size="md"
          className="mt-6 w-full sm:mt-auto sm:pt-0"
        >
          Ask latest price
        </WhatsAppLink>
      </div>
    </Reveal>
  );
}
