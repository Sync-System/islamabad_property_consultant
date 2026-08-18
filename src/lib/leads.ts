/**
 * Lead capture: shape, validation, sanitisation and transport.
 *
 * The same validators run on the client (for instant field errors) and on the
 * server route (because client validation is a convenience, not a control).
 *
 * Transport is deliberately abstracted. `submitLead()` posts to our own
 * `/api/lead` route; swapping that route's implementation for Supabase,
 * Firebase, Google Sheets, HubSpot or the WhatsApp Business API requires no
 * change to any component.
 */

import type { Attribution, CtaLocation } from "./attribution";

export type ContactMethod = "WhatsApp" | "Phone call" | "Email";

export type LeadKind = "enquiry" | "site-visit";

export interface LeadInput {
  kind: LeadKind;
  name: string;
  phone: string;
  projectSlug?: string;
  projectName?: string;
  propertyPreference?: string;
  budget?: string;
  contactMethod?: ContactMethod;
  message?: string;
  /* Site-visit specific */
  visitDate?: string;
  visitTime?: string;
  visitorCount?: string;
  /* Attribution */
  ctaLocation?: CtaLocation;
  attribution?: Attribution;
  /** Honeypot. Must be empty; bots fill it. */
  company?: string;
  /** Milliseconds between form focus and submit. Sub-second submits are bots. */
  elapsedMs?: number;
}

export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

/* -------------------------------------------------------------------------- */
/* Sanitisation                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Strips control characters and clamps length. Output of this function is safe
 * to place in a WhatsApp message body and to store; it is never interpolated as
 * HTML (React escapes for us) so no entity encoding is needed.
 */
export function sanitiseText(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

/**
 * Normalises a Pakistani mobile number to international form (92XXXXXXXXXX).
 * Returns null when the input cannot be read as a valid mobile number.
 */
export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "");
  const bare = digits.replace(/^\+/, "");

  // 03XXXXXXXXX → 92XXXXXXXXXX
  if (/^03\d{9}$/.test(bare)) return `92${bare.slice(1)}`;
  // 92XXXXXXXXXX (3XXXXXXXXX after country code)
  if (/^923\d{9}$/.test(bare)) return bare;
  // 3XXXXXXXXX typed without the leading zero
  if (/^3\d{9}$/.test(bare)) return `92${bare}`;
  // Any other plausible international number: 8–15 digits.
  if (/^\d{8,15}$/.test(bare)) return bare;

  return null;
}

/** Formats a normalised number for display: 92333… → +92 333 3335912 */
export function formatPhoneDisplay(normalised: string): string {
  if (/^92\d{10}$/.test(normalised)) {
    return `+92 ${normalised.slice(2, 5)} ${normalised.slice(5)}`;
  }
  return `+${normalised}`;
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                  */
/* -------------------------------------------------------------------------- */

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]{1,79}$/u;

export function validateLead(input: Partial<LeadInput>): LeadErrors {
  const errors: LeadErrors = {};

  const name = sanitiseText(input.name, 80);
  if (!name) {
    errors.name = "Please enter your name.";
  } else if (!NAME_PATTERN.test(name)) {
    errors.name = "Please enter your name using letters only.";
  }

  const phoneRaw = sanitiseText(input.phone, 30);
  if (!phoneRaw) {
    errors.phone = "Please enter a phone number we can reach you on.";
  } else if (!normalisePhone(phoneRaw)) {
    errors.phone = "Please enter a valid number, for example 0333 3335912.";
  }

  if (input.kind === "site-visit") {
    if (!sanitiseText(input.visitDate, 40)) {
      errors.visitDate = "Please choose a preferred date.";
    } else if (input.visitDate && isPastDate(input.visitDate)) {
      errors.visitDate = "Please choose a date from today onwards.";
    }
    if (!sanitiseText(input.visitTime, 40)) {
      errors.visitTime = "Please choose a preferred time.";
    }
  }

  if (input.message && sanitiseText(input.message, 2000).length > 1000) {
    errors.message = "Please keep your message under 1000 characters.";
  }

  return errors;
}

function isPastDate(value: string): boolean {
  const chosen = new Date(`${value}T00:00:00`);
  if (Number.isNaN(chosen.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return chosen < today;
}

export function hasErrors(errors: LeadErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Spam heuristics that do not inconvenience a real visitor: an invisible
 * honeypot field, and a minimum time-on-form. No CAPTCHA, no third-party
 * script, no tracking.
 */
export function looksAutomated(input: Partial<LeadInput>): boolean {
  if (input.company && input.company.trim() !== "") return true;
  if (typeof input.elapsedMs === "number" && input.elapsedMs < 1200) return true;
  return false;
}

/** Produces a clean, length-capped record ready for storage or a CRM. */
export function normaliseLead(input: LeadInput) {
  const phone = normalisePhone(sanitiseText(input.phone, 30));
  return {
    kind: input.kind,
    name: sanitiseText(input.name, 80),
    phone: phone ?? "",
    phoneDisplay: phone ? formatPhoneDisplay(phone) : "",
    projectSlug: sanitiseText(input.projectSlug, 80) || undefined,
    projectName: sanitiseText(input.projectName, 120) || undefined,
    propertyPreference: sanitiseText(input.propertyPreference, 120) || undefined,
    budget: sanitiseText(input.budget, 80) || undefined,
    contactMethod: sanitiseText(input.contactMethod, 40) || undefined,
    message: sanitiseText(input.message, 1000) || undefined,
    visitDate: sanitiseText(input.visitDate, 40) || undefined,
    visitTime: sanitiseText(input.visitTime, 40) || undefined,
    visitorCount: sanitiseText(input.visitorCount, 20) || undefined,
    ctaLocation: input.ctaLocation,
    attribution: input.attribution,
    receivedAt: new Date().toISOString(),
  };
}

export type NormalisedLead = ReturnType<typeof normaliseLead>;

/* -------------------------------------------------------------------------- */
/* Transport                                                                   */
/* -------------------------------------------------------------------------- */

export interface LeadSubmitResult {
  ok: boolean;
  /** Server-assigned reference, when the backend provides one. */
  reference?: string;
  error?: string;
}

/**
 * Posts a lead to our API route.
 *
 * The WhatsApp hand-off must not depend on this succeeding — a failed capture
 * is our problem, not the visitor's, so callers open WhatsApp regardless.
 */
export async function submitLead(input: LeadInput): Promise<LeadSubmitResult> {
  try {
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      keepalive: true,
    });

    if (!response.ok) {
      return { ok: false, error: `Request failed (${response.status})` };
    }

    const data = (await response.json()) as { reference?: string };
    return { ok: true, reference: data.reference };
  } catch {
    return { ok: false, error: "Network error" };
  }
}
