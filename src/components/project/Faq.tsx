"use client";

import { useState } from "react";
import type { Faq as FaqItem, Project } from "@/lib/projects/types";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { MinusIcon, PlusIcon } from "@/components/ui/Icon";

/**
 * FAQ accordion.
 *
 * Built on buttons with `aria-expanded` and `aria-controls` rather than
 * `<details>`, so the open/close transition can be animated with
 * `grid-template-rows` — which animates smoothly, unlike `height: auto`.
 *
 * Answers are always in the DOM, so the content is indexable and findable with
 * in-page search whether or not a panel is open.
 */

export function Faq({ project }: { project: Project }) {
  const categories = [...new Set(project.faqs.map((f) => f.category).filter(Boolean))];
  const [category, setCategory] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(0);

  const visible = category
    ? project.faqs.filter((f) => f.category === category)
    : project.faqs;

  return (
    <Section id="faqs" tone="paper" aria-labelledby="faqs-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeader
              eyebrow="Questions"
              title="Answers, with their sources"
              id="faqs-title"
            />
            <Reveal delay={100}>
              <p className="mt-6 text-body-sm text-content-muted">
                Where an answer comes from the developer&rsquo;s own published
                material, it says so. Where it is our own guidance, it says that
                too.
              </p>
            </Reveal>

            {categories.length > 1 && (
              <Reveal delay={160}>
                <div className="mt-8 flex flex-wrap gap-2">
                  <FilterChip
                    active={category === null}
                    onClick={() => {
                      setCategory(null);
                      setOpen(0);
                    }}
                  >
                    All
                  </FilterChip>
                  {categories.map((entry) => (
                    <FilterChip
                      key={entry}
                      active={category === entry}
                      onClick={() => {
                        setCategory(entry!);
                        setOpen(0);
                      }}
                    >
                      {entry}
                    </FilterChip>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal delay={220}>
              <div className="mt-10 border-t border-line pt-7">
                <p className="text-body-sm text-content-muted">
                  Still unanswered? Ask us directly — we would rather tell you
                  something is unconfirmed than guess.
                </p>
                <WhatsAppLink
                  ctaLocation="faqs"
                  projectName={project.name}
                  projectSlug={project.slug}
                  variant="outline"
                  size="md"
                  className="mt-5"
                >
                  Ask your question
                </WhatsAppLink>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <ul className="border-t border-line">
              {visible.map((faq, index) => (
                <AccordionRow
                  key={faq.question}
                  faq={faq}
                  index={index}
                  isOpen={open === index}
                  onToggle={() => setOpen(open === index ? null : index)}
                />
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-11 border px-3.5 text-[0.75rem] font-medium transition-colors duration-300 ${
        active
          ? "border-line-strong bg-surface-feature text-content"
          : "border-line text-content-muted hover:border-line-strong"
      }`}
    >
      {children}
    </button>
  );
}

function AccordionRow({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <li className="border-b border-line">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-start gap-5 py-6 text-left"
        >
          <span className="eyebrow tabular mt-1.5 shrink-0 text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="flex-1 text-h4 text-content">{faq.question}</span>
          <span
            aria-hidden="true"
            className="mt-1 shrink-0 text-content-subtle transition-transform duration-400 ease-[var(--ease-out-quint)]"
          >
            {isOpen ? <MinusIcon size={20} /> : <PlusIcon size={20} />}
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-quint)] ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-7 pl-[3.25rem] pr-8">
            <p className="max-w-[62ch] text-body text-content-muted">{faq.answer}</p>
            {faq.source && (
              <p className="mt-4 text-micro text-content-subtle">
                Source: {faq.source.label}
                {faq.source.checkedOn ? ` · checked ${faq.source.checkedOn}` : ""}
              </p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
