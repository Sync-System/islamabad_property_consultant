/**
 * Analytics abstraction.
 *
 * The UI never talks to a vendor directly. It calls `track()` with a typed
 * event; adapters registered here forward it on. Adding GA4, GTM, Meta Pixel or
 * TikTok later means registering one adapter — no component changes.
 *
 * Events are meaningful conversion moments only. We do not track mouse
 * movement, scroll depth per pixel, or anything resembling surveillance.
 */

import type { Attribution, CtaLocation } from "./attribution";

export type AnalyticsEventName =
  | "project_view"
  | "whatsapp_click"
  | "lead_form_start"
  | "lead_form_submit"
  | "phone_click"
  | "location_view"
  | "gallery_open"
  | "payment_plan_view"
  | "master_plan_open"
  | "site_visit_request";

export interface AnalyticsPayload {
  ctaLocation?: CtaLocation;
  projectSlug?: string;
  projectName?: string;
  propertyPreference?: string;
  paymentPlan?: string;
  contactMethod?: string;
  /** Free-form, vendor-agnostic extras. Never include PII beyond what a lead needs. */
  [key: string]: unknown;
}

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  payload: AnalyticsPayload;
  attribution?: Attribution;
  timestamp: string;
}

export type AnalyticsAdapter = (event: AnalyticsEvent) => void;

const adapters: AnalyticsAdapter[] = [];

/** Registers a vendor adapter. Returns an unsubscribe function. */
export function registerAnalyticsAdapter(adapter: AnalyticsAdapter): () => void {
  adapters.push(adapter);
  return () => {
    const i = adapters.indexOf(adapter);
    if (i >= 0) adapters.splice(i, 1);
  };
}

/** Fires an event to every registered adapter. Never throws into the UI. */
export function track(
  name: AnalyticsEventName,
  payload: AnalyticsPayload = {},
  attribution?: Attribution,
): void {
  const event: AnalyticsEvent = {
    name,
    payload,
    attribution,
    timestamp: new Date().toISOString(),
  };

  for (const adapter of adapters) {
    try {
      adapter(event);
    } catch {
      // An analytics failure must never break a conversion path.
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Built-in adapters — opt in by calling these once on the client.             */
/* -------------------------------------------------------------------------- */

interface DataLayerWindow extends Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  ttq?: { track: (name: string, props?: unknown) => void };
}

/** Google Tag Manager / GA4 via dataLayer. */
export const dataLayerAdapter: AnalyticsAdapter = (event) => {
  const w = window as DataLayerWindow;
  if (!w.dataLayer) return;
  w.dataLayer.push({
    event: event.name,
    ...event.payload,
    ...event.attribution,
    event_timestamp: event.timestamp,
  });
};

/** Meta Pixel — maps our events onto standard pixel events where they fit. */
export const metaPixelAdapter: AnalyticsAdapter = (event) => {
  const w = window as DataLayerWindow;
  if (typeof w.fbq !== "function") return;

  const standard: Partial<Record<AnalyticsEventName, string>> = {
    whatsapp_click: "Contact",
    phone_click: "Contact",
    lead_form_submit: "Lead",
    site_visit_request: "Schedule",
    project_view: "ViewContent",
  };

  const mapped = standard[event.name];
  if (mapped) {
    w.fbq("track", mapped, event.payload);
  } else {
    w.fbq("trackCustom", event.name, event.payload);
  }
};

/** TikTok Pixel. */
export const tiktokPixelAdapter: AnalyticsAdapter = (event) => {
  const w = window as DataLayerWindow;
  if (!w.ttq?.track) return;
  const standard: Partial<Record<AnalyticsEventName, string>> = {
    lead_form_submit: "SubmitForm",
    whatsapp_click: "Contact",
    phone_click: "Contact",
  };
  w.ttq.track(standard[event.name] ?? event.name, event.payload);
};

/** Logs events to the console. Development aid only. */
export const debugAdapter: AnalyticsAdapter = (event) => {
  if (process.env.NODE_ENV !== "development") return;
  console.debug("[analytics]", event.name, event.payload);
};
