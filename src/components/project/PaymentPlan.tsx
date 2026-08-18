"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects/types";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { AlertIcon, CheckIcon } from "@/components/ui/Icon";
import { getAttribution } from "@/lib/attribution";
import { track } from "@/lib/analytics";

/**
 * Payment plan.
 *
 * Two presentations of the same data, chosen by viewport rather than by
 * squeezing one into the other: a real table on desktop, where a buyer wants to
 * compare tenures across sizes, and a stack of per-size cards on mobile, where
 * a nine-column table is unusable. Neither is a horizontally-scrolling
 * compromise.
 *
 * Every figure is transcribed from the developer's published schedule. The
 * freshness note and the WhatsApp CTA are not decoration — schedules change
 * between ballots, and sending someone to confirm is the honest default.
 */

export function PaymentPlan({ project }: { project: Project }) {
  const plan = project.paymentPlan;
  const [activeGroup, setActiveGroup] = useState(plan?.groups[0]?.id ?? "");
  const [activeTenure, setActiveTenure] = useState(plan?.tenures[1]?.id ?? "");
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewed = useRef(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewed.current) {
          viewed.current = true;
          track(
            "payment_plan_view",
            { ctaLocation: "payment-plan", projectSlug: project.slug },
            getAttribution(),
          );
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [project.slug]);

  if (!plan) return null;

  const group = plan.groups.find((g) => g.id === activeGroup) ?? plan.groups[0];
  const tenure = plan.tenures.find((t) => t.id === activeTenure) ?? plan.tenures[0];

  return (
    <Section
      id="payment-plan"
      tone="paper"
      aria-labelledby="payment-plan-title"
    >
      <div ref={sectionRef}>
        <Container>
          <SectionHeader
            eyebrow="Payment plan"
            title="Lump sum, or up to twelve quarterly instalments"
            intro={plan.intro}
            id="payment-plan-title"
            split
          />

          {/* --- Group switch ---------------------------------------------- */}
          <Reveal delay={80} className="mt-12">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div
                role="tablist"
                aria-label="Plot category"
                className="inline-flex border border-ink-900/15"
              >
                {plan.groups.map((g) => {
                  const selected = g.id === group.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveGroup(g.id)}
                      className={`min-h-12 px-5 text-[0.8125rem] font-semibold transition-colors duration-300 sm:px-7 ${
                        selected
                          ? "bg-ink-900 text-paper-50"
                          : "text-ink-600 hover:bg-ink-900/5 hover:text-ink-900"
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>

              <p className="text-micro text-ink-500">
                Figures in {plan.currency}. Source: {plan.source.label}
                {plan.source.checkedOn ? `, checked ${plan.source.checkedOn}` : ""}.
              </p>
            </div>
          </Reveal>

          {/* --- Desktop table --------------------------------------------- */}
          <Reveal delay={140} className="mt-8 hidden lg:block">
            <div className="overflow-x-auto border border-ink-900/12">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">
                  {group.label} payment schedule for {project.name}, showing
                  lump-sum and instalment prices in {plan.currency}.
                </caption>
                <thead>
                  <tr className="bg-ink-900 text-paper-50">
                    <th scope="col" rowSpan={2} className="px-5 py-4 align-bottom text-[0.75rem] font-semibold tracking-[0.08em] uppercase">
                      Size
                    </th>
                    <th scope="col" rowSpan={2} className="px-5 py-4 align-bottom text-[0.75rem] font-semibold tracking-[0.08em] uppercase">
                      Processing fee
                    </th>
                    {plan.tenures.map((t) => (
                      <th
                        key={t.id}
                        scope="col"
                        colSpan={t.id === "lump-sum" ? 1 : 2}
                        className="border-l border-paper-50/15 px-5 pb-2 pt-4 text-center text-[0.75rem] font-semibold tracking-[0.08em] uppercase"
                      >
                        {t.label}
                        <span className="mt-1 block text-[0.625rem] font-normal normal-case tracking-normal text-paper-100/60">
                          {t.structure}
                        </span>
                      </th>
                    ))}
                  </tr>
                  <tr className="bg-ink-800 text-paper-100">
                    {plan.tenures.map((t) =>
                      t.id === "lump-sum" ? (
                        <th
                          key={t.id}
                          scope="col"
                          className="border-l border-paper-50/12 px-5 py-2.5 text-right text-[0.6875rem] font-medium"
                        >
                          Price
                        </th>
                      ) : (
                        [
                          <th
                            key={`${t.id}-price`}
                            scope="col"
                            className="border-l border-paper-50/12 px-5 py-2.5 text-right text-[0.6875rem] font-medium"
                          >
                            Sale price
                          </th>,
                          <th
                            key={`${t.id}-down`}
                            scope="col"
                            className="px-5 py-2.5 text-right text-[0.6875rem] font-medium"
                          >
                            20% down
                          </th>,
                        ]
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row, i) => (
                    <tr
                      key={row.size}
                      className={i % 2 ? "bg-paper-100/60" : "bg-paper-50"}
                    >
                      <th
                        scope="row"
                        className="px-5 py-4 font-display text-[1.25rem] text-ink-900"
                      >
                        {row.size}
                      </th>
                      <td className="tabular px-5 py-4 text-[0.875rem] text-ink-600">
                        {row.processingFee}
                      </td>
                      {plan.tenures.map((t) => {
                        const cell = row.prices[t.id];
                        return t.id === "lump-sum" ? (
                          <td
                            key={t.id}
                            className="tabular border-l border-ink-900/8 px-5 py-4 text-right text-[0.9375rem] font-semibold text-ink-900"
                          >
                            {cell?.salePrice ?? "—"}
                          </td>
                        ) : (
                          [
                            <td
                              key={`${t.id}-p`}
                              className="tabular border-l border-ink-900/8 px-5 py-4 text-right text-[0.9375rem] text-ink-800"
                            >
                              {cell?.salePrice ?? "—"}
                            </td>,
                            <td
                              key={`${t.id}-d`}
                              className="tabular px-5 py-4 text-right text-[0.875rem] text-ink-600"
                            >
                              {cell?.downPayment ?? "—"}
                            </td>,
                          ]
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* --- Mobile / tablet cards ------------------------------------- */}
          <div className="mt-8 lg:hidden">
            <div
              role="tablist"
              aria-label="Payment tenure"
              className="scrollbar-none -mx-gutter flex gap-2 overflow-x-auto px-gutter pb-1 sm:mx-0 sm:px-0"
            >
              {plan.tenures.map((t) => {
                const selected = t.id === tenure.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveTenure(t.id)}
                    className={`min-h-11 shrink-0 border px-4 text-[0.8125rem] font-semibold transition-colors duration-300 ${
                      selected
                        ? "border-ink-900 bg-ink-900 text-paper-50"
                        : "border-ink-900/15 text-ink-600"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-body-sm text-ink-600">{tenure.structure}</p>

            <ul className="mt-5 space-y-4">
              {group.rows.map((row, index) => {
                const cell = row.prices[tenure.id];
                return (
                  <Reveal
                    as="li"
                    key={row.size}
                    delay={index * 70}
                    className="border border-ink-900/12 bg-paper-50 p-6"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-h4 text-ink-900">{row.size}</h3>
                      <span className="eyebrow text-ink-500">{group.label}</span>
                    </div>

                    <dl className="mt-5 space-y-3.5 text-[0.875rem]">
                      <div className="flex items-baseline justify-between gap-4 border-b border-ink-900/8 pb-3.5">
                        <dt className="text-ink-500">
                          {tenure.id === "lump-sum" ? "Lump-sum price" : "Sale price"}
                        </dt>
                        <dd className="tabular text-[1.0625rem] font-semibold text-ink-900">
                          {plan.currency} {cell?.salePrice ?? "—"}
                        </dd>
                      </div>
                      {cell?.downPayment && (
                        <div className="flex items-baseline justify-between gap-4 border-b border-ink-900/8 pb-3.5">
                          <dt className="text-ink-500">20% down payment</dt>
                          <dd className="tabular font-medium text-ink-800">
                            {plan.currency} {cell.downPayment}
                          </dd>
                        </div>
                      )}
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-ink-500">Processing fee</dt>
                        <dd className="tabular font-medium text-ink-800">
                          {plan.currency} {row.processingFee}
                        </dd>
                      </div>
                    </dl>

                    <WhatsAppLink
                      ctaLocation="payment-plan"
                      projectName={project.name}
                      projectSlug={project.slug}
                      propertyPreference={`${group.label} — ${row.size}`}
                      paymentPlan={tenure.label}
                      size="md"
                      className="mt-6 w-full"
                    >
                      Confirm this plan
                    </WhatsAppLink>
                  </Reveal>
                );
              })}
            </ul>
          </div>

          {/* --- Conditions and CTA ---------------------------------------- */}
          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <h3 className="eyebrow text-brass-700">Conditions published with the schedule</h3>
              <ul className="mt-5 space-y-3">
                {plan.notes.map((note) => (
                  <li key={note} className="flex items-start gap-3 text-body-sm text-ink-600">
                    <CheckIcon size={17} className="mt-1 shrink-0 text-pine-600" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-5">
              <div className="border border-brass-600/30 bg-brass-500/8 p-7">
                <p className="flex items-start gap-3 text-body-sm text-ink-800">
                  <AlertIcon size={19} className="mt-0.5 shrink-0 text-brass-700" />
                  <span>{plan.freshnessNote}</span>
                </p>
                <WhatsAppLink
                  ctaLocation="payment-plan"
                  projectName={project.name}
                  projectSlug={project.slug}
                  paymentPlan={`${group.label} — current schedule`}
                  size="lg"
                  className="mt-6 w-full"
                >
                  Get the latest payment plan
                </WhatsAppLink>
                <p className="mt-4 text-micro text-ink-500">
                  The official application form is issued by the developer. We
                  will point you to the current version and walk you through it.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>
    </Section>
  );
}
