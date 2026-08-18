import { agencyConfig } from "./config/agency";
import {
  formatAttributionLine,
  type Attribution,
  type CtaLocation,
} from "./attribution";

/**
 * WhatsApp URL and message generation.
 *
 * Every WhatsApp entry point on the site goes through `whatsappUrl()`. The
 * number lives in `agencyConfig` and appears exactly once in the codebase.
 */

export interface WhatsAppContext {
  /** Which button was pressed. Appended to the message for attribution. */
  ctaLocation?: CtaLocation;
  /** Project the visitor is looking at. */
  projectName?: string;
  projectSlug?: string;
  /** A specific plot / property the visitor selected. */
  propertyPreference?: string;
  /** Payment tenure the visitor was viewing. */
  paymentPlan?: string;
  /** Lead details, when the message follows a form submission. */
  name?: string;
  phone?: string;
  budget?: string;
  contactMethod?: string;
  message?: string;
  /** Site-visit request details. */
  visitDate?: string;
  visitTime?: string;
  visitorCount?: string;
  /** Session attribution. */
  attribution?: Attribution;
  /** Replaces the generated opening line entirely. */
  customIntro?: string;
}

const GREETING = "Assalam o Alaikum";

/**
 * The default message used by bare "chat with us" buttons where the visitor has
 * not selected anything specific.
 */
export const DEFAULT_MESSAGE = `${GREETING}, I am interested in Margalla Enclave Islamabad through Islamabad Property Consultant. Please share the latest verified prices, payment plan, availability and site visit details.`;

function line(label: string, value?: string | null): string | null {
  const trimmed = value?.toString().trim();
  return trimmed ? `${label}: ${trimmed}` : null;
}

/**
 * Builds the human-readable message body.
 *
 * Kept deliberately plain: WhatsApp renders no markup, and a consultant reading
 * this on a phone needs to scan it in two seconds.
 */
export function buildWhatsAppMessage(context: WhatsAppContext = {}): string {
  const {
    projectName,
    propertyPreference,
    paymentPlan,
    name,
    phone,
    budget,
    contactMethod,
    message,
    visitDate,
    visitTime,
    visitorCount,
    attribution,
    ctaLocation,
    customIntro,
  } = context;

  const intro =
    customIntro ??
    (name
      ? `${GREETING}, my name is ${name}.`
      : `${GREETING}.`);

  const subject = projectName
    ? `I'm interested in ${projectName} through ${agencyConfig.name}.`
    : `I'd like guidance from ${agencyConfig.name} on a property in Islamabad.`;

  const details = [
    line("Property preference", propertyPreference),
    line("Payment plan", paymentPlan),
    line("Budget", budget),
    line("Phone", phone),
    line("Preferred contact", contactMethod),
    line("Preferred visit date", visitDate),
    line("Preferred time", visitTime),
    line("Number of visitors", visitorCount),
    line("Message", message),
  ].filter(Boolean) as string[];

  const closing =
    visitDate || visitTime
      ? "Please confirm a guided site visit and share the latest verified details."
      : "Please share the latest verified details, availability and guidance.";

  const attributionLine = attribution
    ? formatAttributionLine(attribution, ctaLocation)
    : ctaLocation
      ? `cta:${ctaLocation}`
      : "";

  const blocks = [
    `${intro}\n${subject}`,
    details.length ? details.join("\n") : "",
    closing,
    attributionLine ? `Source: ${attributionLine}` : "",
  ].filter(Boolean);

  return blocks.join("\n\n");
}

/**
 * Builds a wa.me deep link.
 *
 * `encodeURIComponent` is the correct encoder here: wa.me expects the message in
 * a query parameter, and it handles the newlines and non-ASCII characters that
 * `encodeURI` would leave alone.
 */
export function whatsappUrl(context: WhatsAppContext = {}): string {
  const text = buildWhatsAppMessage(context);
  return `${agencyConfig.whatsappBaseUrl}?text=${encodeURIComponent(text)}`;
}

/** A wa.me link carrying the default message — used by generic entry points. */
export function defaultWhatsappUrl(ctaLocation?: CtaLocation): string {
  return `${agencyConfig.whatsappBaseUrl}?text=${encodeURIComponent(
    ctaLocation ? `${DEFAULT_MESSAGE}\n\nSource: cta:${ctaLocation}` : DEFAULT_MESSAGE,
  )}`;
}

/** `tel:` link for the agency phone line. */
export const telUrl = `tel:${agencyConfig.phone}`;
