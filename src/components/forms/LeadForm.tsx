"use client";

import { useCallback } from "react";
import type { Project } from "@/lib/projects/types";
import type { CtaLocation } from "@/lib/attribution";
import { Field, Honeypot, Select, TextArea, TextInput } from "./Field";
import { useLeadForm } from "./useLeadForm";
import { buttonClass } from "@/components/ui/button-styles";
import { CheckIcon, WhatsAppIcon } from "@/components/ui/Icon";
import { agencyConfig } from "@/lib/config/agency";
import { formatPhoneDisplay, normalisePhone } from "@/lib/leads";

/**
 * Main enquiry form.
 *
 * Property options come from project data, so a new project's plot categories
 * appear here automatically. Submitting hands off to WhatsApp with everything
 * the visitor typed already in the message — the consultant never has to ask
 * for it twice, which is the whole point of the form existing at all.
 */

const BUDGETS = [
  "Under PKR 25 million",
  "PKR 25 – 50 million",
  "PKR 50 – 100 million",
  "PKR 100 – 200 million",
  "Above PKR 200 million",
  "Prefer to discuss",
];

const CONTACT_METHODS = ["WhatsApp", "Phone call", "Email"];

/** Shows the consultant a tappable international number, not raw input. */
function displayPhone(raw?: string): string | undefined {
  if (!raw) return undefined;
  const normalised = normalisePhone(raw);
  return normalised ? formatPhoneDisplay(normalised) : raw;
}

interface LeadFormProps {
  project?: Project;
  /** Additional projects offered in the "Interested project" select. */
  projects?: { slug: string; name: string }[];
  ctaLocation?: CtaLocation;
  compact?: boolean;
}

export function LeadForm({
  project,
  projects = [],
  ctaLocation = "lead-form",
  compact = false,
}: LeadFormProps) {
  const propertyChoices = project?.propertyOptions.items ?? [];

  const toWhatsApp = useCallback(
    (values: Record<string, string>) => ({
      name: values.name,
      phone: displayPhone(values.phone),
      propertyPreference: values.propertyPreference,
      budget: values.budget,
      contactMethod: values.contactMethod,
      message: values.message,
      projectName: values.projectName || project?.name,
    }),
    [project?.name],
  );

  const { values, setValue, errors, state, submit, reference } = useLeadForm({
    kind: "enquiry",
    ctaLocation,
    projectName: project?.name,
    projectSlug: project?.slug,
    toWhatsApp,
    initialValues: {
      contactMethod: CONTACT_METHODS[0],
      ...(project ? { projectName: project.name } : {}),
    },
  });

  if (state === "done") {
    return <Success reference={reference} />;
  }

  const projectOptions = project
    ? [{ slug: project.slug, name: project.name }, ...projects.filter((p) => p.slug !== project.slug)]
    : projects;

  return (
    <form onSubmit={submit} noValidate className="relative">
      <Honeypot value={values.company ?? ""} onChange={(v) => setValue("company", v)} />

      <div className={`grid gap-5 ${compact ? "" : "sm:grid-cols-2"}`}>
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

        <Field
          label="Phone number"
          error={errors.phone}
          hint="Pakistani or international. We reply on WhatsApp."
        >
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

        {projectOptions.length > 0 && (
          <Field label="Interested project">
            {({ id }) => (
              <Select
                id={id}
                name="projectName"
                value={values.projectName ?? projectOptions[0]?.name ?? ""}
                onChange={(e) => setValue("projectName", e.target.value)}
              >
                {projectOptions.map((option) => (
                  <option key={option.slug} value={option.name}>
                    {option.name}
                  </option>
                ))}
                <option value="Another project in Islamabad">
                  Another project in Islamabad
                </option>
              </Select>
            )}
          </Field>
        )}

        {propertyChoices.length > 0 && (
          <Field label="Property preference">
            {({ id }) => (
              <Select
                id={id}
                name="propertyPreference"
                value={values.propertyPreference ?? ""}
                onChange={(e) => setValue("propertyPreference", e.target.value)}
              >
                <option value="">Not sure yet — advise me</option>
                {propertyChoices.map((option) => (
                  <option
                    key={option.id}
                    value={`${option.type} — ${option.size}${option.sizeAlt ? ` (${option.sizeAlt})` : ""}`}
                  >
                    {option.type} — {option.size}
                    {option.sizeAlt ? ` (${option.sizeAlt})` : ""}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        )}

        <Field label="Budget range" optional>
          {({ id }) => (
            <Select
              id={id}
              name="budget"
              value={values.budget ?? ""}
              onChange={(e) => setValue("budget", e.target.value)}
            >
              <option value="">Prefer not to say</option>
              {BUDGETS.map((budget) => (
                <option key={budget} value={budget}>
                  {budget}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field label="Preferred contact method">
          {({ id }) => (
            <Select
              id={id}
              name="contactMethod"
              value={values.contactMethod ?? "WhatsApp"}
              onChange={(e) => setValue("contactMethod", e.target.value)}
            >
              {CONTACT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field
          label="Anything specific you'd like to know?"
          optional
          error={errors.message}
          className={compact ? "" : "sm:col-span-2"}
        >
          {({ id, describedBy, invalid }) => (
            <TextArea
              id={id}
              data-field="message"
              name="message"
              rows={3}
              maxLength={1000}
              placeholder="e.g. I'd like to understand the transfer process for overseas buyers."
              value={values.message ?? ""}
              onChange={(e) => setValue("message", e.target.value)}
              aria-describedby={describedBy}
              invalid={invalid}
            />
          )}
        </Field>
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className={buttonClass("whatsapp", "lg", "mt-7 w-full")}
      >
        <WhatsAppIcon size={18} />
        {state === "submitting" ? "Opening WhatsApp…" : "Send on WhatsApp"}
      </button>

      <p className="mt-4 text-micro leading-relaxed text-content-subtle">
        Submitting opens WhatsApp with your details already written out, so you
        can check the message before you send it. We use what you provide only to
        respond to your enquiry.
      </p>
    </form>
  );
}

function Success({ reference }: { reference: string | null }) {
  return (
    <div
      role="status"
      className="border border-accent/30 bg-accent/8 p-8 text-center"
    >
      <span className="mx-auto grid size-12 place-items-center rounded-pill bg-accent text-surface">
        <CheckIcon size={22} />
      </span>
      <h3 className="mt-5 font-display text-h4 text-content">
        WhatsApp is open in a new tab
      </h3>
      <p className="mx-auto mt-3 max-w-[42ch] text-body-sm text-content-muted">
        Your message is written out and ready — press send and a consultant will
        pick it up. If the tab did not open, message us directly on{" "}
        <a
          href={agencyConfig.whatsappBaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent underline underline-offset-4"
        >
          {agencyConfig.whatsappDisplay}
        </a>
        .
      </p>
      {reference && (
        <p className="tabular mt-4 text-micro text-content-subtle">
          Reference {reference}
        </p>
      )}
    </div>
  );
}
