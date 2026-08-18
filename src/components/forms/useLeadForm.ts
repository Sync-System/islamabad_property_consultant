"use client";

import { useCallback, useRef, useState } from "react";
import { getAttribution, type CtaLocation } from "@/lib/attribution";
import { track } from "@/lib/analytics";
import {
  hasErrors,
  submitLead,
  validateLead,
  type LeadErrors,
  type LeadInput,
  type LeadKind,
} from "@/lib/leads";
import { whatsappUrl, type WhatsAppContext } from "@/lib/whatsapp";

/**
 * Shared behaviour for both lead forms.
 *
 * The submit sequence is deliberate:
 *   1. validate — bad data never reaches the consultant or the CRM
 *   2. fire the capture request, but do not await its success as a gate
 *   3. open WhatsApp with the structured message
 *
 * Step 3 runs whether or not step 2 succeeded. If our backend is down, that is
 * our problem to fix in the logs; it must never cost the visitor a
 * conversation. `window.open` is called inside the submit handler's own task so
 * Safari still treats it as user-initiated.
 */

export type SubmitState = "idle" | "submitting" | "done" | "error";

interface UseLeadFormOptions {
  kind: LeadKind;
  ctaLocation: CtaLocation;
  projectName?: string;
  projectSlug?: string;
  /** Builds the WhatsApp context from the current values. */
  toWhatsApp: (values: Record<string, string>) => WhatsAppContext;
  /**
   * Values the controls render as pre-selected. Seeding state with them keeps
   * "what the visitor sees selected" and "what we send" identical — an
   * untouched select must not silently submit nothing.
   */
  initialValues?: Record<string, string>;
}

export function useLeadForm({
  kind,
  ctaLocation,
  projectName,
  projectSlug,
  toWhatsApp,
  initialValues,
}: UseLeadFormOptions) {
  const [values, setValues] = useState<Record<string, string>>(
    () => initialValues ?? {},
  );
  const [errors, setErrors] = useState<LeadErrors>({});
  const [state, setState] = useState<SubmitState>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const startedAt = useRef<number | null>(null);
  const startTracked = useRef(false);

  const setValue = useCallback(
    (key: string, value: string) => {
      if (!startedAt.current) startedAt.current = Date.now();
      if (!startTracked.current) {
        startTracked.current = true;
        track(
          "lead_form_start",
          { ctaLocation, projectSlug, projectName, formKind: kind },
          getAttribution(),
        );
      }
      setValues((current) => ({ ...current, [key]: value }));
      // Clear a field's error as soon as the visitor edits it.
      setErrors((current) => {
        if (!current[key as keyof LeadErrors]) return current;
        const next = { ...current };
        delete next[key as keyof LeadErrors];
        return next;
      });
    },
    [ctaLocation, kind, projectName, projectSlug],
  );

  const submit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const attribution = getAttribution();
      const input: LeadInput = {
        kind,
        name: values.name ?? "",
        phone: values.phone ?? "",
        projectName,
        projectSlug,
        propertyPreference: values.propertyPreference,
        budget: values.budget,
        contactMethod: values.contactMethod as LeadInput["contactMethod"],
        message: values.message,
        visitDate: values.visitDate,
        visitTime: values.visitTime,
        visitorCount: values.visitorCount,
        ctaLocation,
        attribution,
        company: values.company,
        elapsedMs: startedAt.current ? Date.now() - startedAt.current : undefined,
      };

      const found = validateLead(input);
      if (hasErrors(found)) {
        setErrors(found);
        setState("idle");
        // Move focus to the first field with a problem.
        const firstKey = Object.keys(found)[0];
        document
          .querySelector<HTMLElement>(`[data-field="${firstKey}"]`)
          ?.focus();
        return;
      }

      setState("submitting");

      // Build the deep link before any await so the popup stays user-initiated.
      const href = whatsappUrl({
        ...toWhatsApp(values),
        ctaLocation,
        projectName,
        projectSlug,
        attribution,
      });

      track(
        kind === "site-visit" ? "site_visit_request" : "lead_form_submit",
        {
          ctaLocation,
          projectSlug,
          projectName,
          propertyPreference: values.propertyPreference,
          contactMethod: values.contactMethod,
        },
        attribution,
      );

      const opened = window.open(href, "_blank", "noopener,noreferrer");

      const result = await submitLead(input);
      setReference(result.reference ?? null);
      setState("done");

      // Popup blocked — navigate in place rather than losing the conversion.
      if (!opened) window.location.href = href;
    },
    [ctaLocation, kind, projectName, projectSlug, toWhatsApp, values],
  );

  return { values, setValue, errors, state, reference, submit };
}
