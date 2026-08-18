/**
 * Marketing attribution.
 *
 * UTM parameters arrive once, on the landing URL, and are then lost the moment
 * the visitor navigates. We capture them on first paint, persist them for the
 * session, and attach them to every lead and every WhatsApp message.
 *
 * Storage is sessionStorage: it survives in-session navigation, expires with
 * the tab, and never becomes a long-lived tracking identifier.
 */

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  /** Path the visitor first landed on in this session. */
  landingPage?: string;
  /** document.referrer at first paint. */
  referrer?: string;
  /** ISO timestamp of first touch. */
  firstSeenAt?: string;
  /** Common ad-platform click ids, when present. */
  clickId?: string;
  clickIdSource?: string;
}

/** Where a conversion was triggered from. Keep this list closed and meaningful. */
export type CtaLocation =
  | "header"
  | "hero"
  | "trust-bar"
  | "overview"
  | "highlights"
  | "properties"
  | "payment-plan"
  | "master-plan"
  | "amenities"
  | "destinations"
  | "gallery"
  | "location"
  | "faqs"
  | "progress"
  | "site-visit"
  | "lead-form"
  | "final-cta"
  | "floating-whatsapp"
  | "mobile-sticky"
  | "footer"
  | "nav-drawer"
  | "project-card"
  | "agency";

const STORAGE_KEY = "ipc.attribution.v1";

const CLICK_ID_PARAMS: [string, string][] = [
  ["gclid", "google"],
  ["gbraid", "google"],
  ["wbraid", "google"],
  ["fbclid", "meta"],
  ["ttclid", "tiktok"],
  ["msclkid", "microsoft"],
];

function safeSessionStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    // Private-mode Safari throws on access, not just on write.
    const s = window.sessionStorage;
    const probe = "__ipc_probe__";
    s.setItem(probe, "1");
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

/** Reads attribution from the current URL. */
export function readAttributionFromLocation(): Attribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const attribution: Attribution = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) attribution[key] = value.slice(0, 200);
  }

  for (const [param, source] of CLICK_ID_PARAMS) {
    const value = params.get(param);
    if (value) {
      attribution.clickId = value.slice(0, 200);
      attribution.clickIdSource = source;
      break;
    }
  }

  attribution.landingPage = window.location.pathname + window.location.search;
  attribution.referrer = document.referrer || undefined;
  attribution.firstSeenAt = new Date().toISOString();

  return attribution;
}

/**
 * Returns the session's attribution, capturing it on first call.
 * First touch wins: a later organic pageview must not overwrite the paid click
 * that actually brought the visitor here.
 */
export function getAttribution(): Attribution {
  const store = safeSessionStorage();
  if (!store) return readAttributionFromLocation();

  const existing = store.getItem(STORAGE_KEY);
  const incoming = readAttributionFromLocation();

  if (existing) {
    try {
      const parsed = JSON.parse(existing) as Attribution;
      const incomingHasUtm = UTM_KEYS.some((k) => incoming[k]) || incoming.clickId;
      const storedHasUtm = UTM_KEYS.some((k) => parsed[k]) || parsed.clickId;

      // A fresh campaign click during the session does replace an organic first touch.
      if (incomingHasUtm && !storedHasUtm) {
        const merged = { ...parsed, ...incoming };
        store.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch {
      /* fall through and re-capture */
    }
  }

  store.setItem(STORAGE_KEY, JSON.stringify(incoming));
  return incoming;
}

/** A compact single-line source string for the WhatsApp message body. */
export function formatAttributionLine(
  attribution: Attribution,
  ctaLocation?: CtaLocation,
): string {
  const parts: string[] = [];
  if (attribution.landingPage) parts.push(attribution.landingPage);
  if (attribution.utm_source) parts.push(`src:${attribution.utm_source}`);
  if (attribution.utm_medium) parts.push(`med:${attribution.utm_medium}`);
  if (attribution.utm_campaign) parts.push(`camp:${attribution.utm_campaign}`);
  if (attribution.utm_content) parts.push(`content:${attribution.utm_content}`);
  if (attribution.utm_term) parts.push(`term:${attribution.utm_term}`);
  if (attribution.clickIdSource) parts.push(`click:${attribution.clickIdSource}`);
  if (ctaLocation) parts.push(`cta:${ctaLocation}`);
  return parts.join(" · ");
}
