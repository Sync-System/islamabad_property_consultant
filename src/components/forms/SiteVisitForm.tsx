"use client";

import { useCallback, useMemo } from "react";
import type { Project } from "@/lib/projects/types";
import { Field, Honeypot, Select, TextInput } from "./Field";
import { useLeadForm } from "./useLeadForm";
import { buttonClass } from "@/components/ui/button-styles";
import { CheckIcon, WhatsAppIcon } from "@/components/ui/Icon";
import { agencyConfig } from "@/lib/config/agency";
import { formatPhoneDisplay, normalisePhone } from "@/lib/leads";

/**
 * Guided site-visit request.
 *
 * A site visit is the highest-intent action on the page, so the form asks for
 * the minimum needed to actually book one: who, when, and how many people. The
 * date input is bounded to the next ninety days — a native date picker that
 * accepts 1998 is a validation error waiting to happen.
 */

const TIME_SLOTS = [
  "Morning (9am – 12pm)",
  "Midday (12pm – 3pm)",
  "Afternoon (3pm – 6pm)",
  "Flexible — advise me",
];

const VISITOR_COUNTS = ["1", "2", "3 – 4", "5 or more"];

export function SiteVisitForm({ project }: { project: Project }) {
  const { min, max } = useMemo(() => {
    const today = new Date();
    const later = new Date();
    later.setDate(later.getDate() + 90);
    return {
      min: today.toISOString().slice(0, 10),
      max: later.toISOString().slice(0, 10),
    };
  }, []);

  const toWhatsApp = useCallback(
    (values: Record<string, string>) => ({
      name: values.name,
      phone: (() => {
        const normalised = values.phone ? normalisePhone(values.phone) : null;
        return normalised ? formatPhoneDisplay(normalised) : values.phone;
      })(),
      // A consultant reads this on a phone; "Thu, 20 August 2026" is scannable
      // in a way the ISO value the date input produces is not.
      visitDate: values.visitDate
        ? new Date(`${values.visitDate}T00:00:00`).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : undefined,
      visitTime: values.visitTime,
      visitorCount: values.visitorCount,
      customIntro: values.name
        ? `Assalam o Alaikum, my name is ${values.name} and I would like to request a guided site visit.`
        : undefined,
    }),
    [],
  );

  const { values, setValue, errors, state, submit, reference } = useLeadForm({
    kind: "site-visit",
    ctaLocation: "site-visit",
    projectName: project.name,
    projectSlug: project.slug,
    toWhatsApp,
    initialValues: { visitorCount: VISITOR_COUNTS[0] },
  });

  if (state === "done") {
    return (
      <div
        role="status"
        className="border border-brass-600/30 bg-brass-500/10 p-8 text-center"
      >
        <span className="mx-auto grid size-12 place-items-center rounded-pill bg-brass-500 text-ink-950">
          <CheckIcon size={22} />
        </span>
        <h3 className="mt-5 font-display text-h4 text-ink-900">
          Your visit request is ready to send
        </h3>
        <p className="mx-auto mt-3 max-w-[42ch] text-body-sm text-ink-600">
          Check the message in WhatsApp and press send. We will confirm the date,
          the meeting point and what to bring. If the tab did not open, message{" "}
          <a
            href={agencyConfig.whatsappBaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brass-700 underline underline-offset-4"
          >
            {agencyConfig.whatsappDisplay}
          </a>
          .
        </p>
        {reference && (
          <p className="tabular mt-4 text-micro text-ink-500">
            Reference {reference}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="relative">
      <Honeypot value={values.company ?? ""} onChange={(v) => setValue("company", v)} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" error={errors.name}>
          {({ id, describedBy, invalid }) => (
            <TextInput
              id={id}
              data-field="name"
              name="name"
              autoComplete="name"
              placeholder="e.g. Ahmed Khan"
              required
              value={values.name ?? ""}
              onChange={(e) => setValue("name", e.target.value)}
              aria-describedby={describedBy}
              invalid={invalid}
            />
          )}
        </Field>

        <Field label="Phone number" error={errors.phone}>
          {({ id, describedBy, invalid }) => (
            <TextInput
              id={id}
              data-field="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="0333 3335912"
              required
              value={values.phone ?? ""}
              onChange={(e) => setValue("phone", e.target.value)}
              aria-describedby={describedBy}
              invalid={invalid}
            />
          )}
        </Field>

        <Field label="Preferred date" error={errors.visitDate}>
          {({ id, describedBy, invalid }) => (
            <TextInput
              id={id}
              data-field="visitDate"
              name="visitDate"
              type="date"
              min={min}
              max={max}
              required
              value={values.visitDate ?? ""}
              onChange={(e) => setValue("visitDate", e.target.value)}
              aria-describedby={describedBy}
              invalid={invalid}
            />
          )}
        </Field>

        <Field label="Preferred time" error={errors.visitTime}>
          {({ id, describedBy, invalid }) => (
            <Select
              id={id}
              data-field="visitTime"
              name="visitTime"
              required
              value={values.visitTime ?? ""}
              onChange={(e) => setValue("visitTime", e.target.value)}
              aria-describedby={describedBy}
              invalid={invalid}
            >
              <option value="">Choose a time</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field label="Number of visitors" className="sm:col-span-2">
          {({ id }) => (
            <Select
              id={id}
              name="visitorCount"
              value={values.visitorCount ?? "1"}
              onChange={(e) => setValue("visitorCount", e.target.value)}
            >
              {VISITOR_COUNTS.map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className={buttonClass("whatsapp", "lg", "mt-7 w-full")}
      >
        <WhatsAppIcon size={18} />
        {state === "submitting" ? "Opening WhatsApp…" : "Request site visit"}
      </button>

      <p className="mt-4 text-micro leading-relaxed text-ink-500">
        A visit is confirmed by a consultant on WhatsApp — this form does not
        book a slot on its own.
      </p>
    </form>
  );
}
