/**
 * Agency configuration — the single source of truth for every contact detail,
 * phone number and social profile used anywhere on the site.
 *
 * Nothing here may be duplicated inside a component. If a component needs the
 * WhatsApp number, it imports it from here.
 *
 * Values written as `[SOMETHING]` are deliberate, clearly-marked placeholders
 * awaiting verified business data. `isPlaceholder()` detects them so the UI can
 * degrade gracefully (hide the link, show "coming soon") instead of shipping a
 * broken `mailto:[EMAIL]`.
 */

export const PLACEHOLDER_PATTERN = /^\[[A-Z0-9_]+\]$/;

/** True when a config value is still an unfilled `[PLACEHOLDER]`. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || PLACEHOLDER_PATTERN.test(value.trim());
}

/** Returns the value, or `undefined` if it is still a placeholder. */
export function resolved(value: string | undefined | null): string | undefined {
  return isPlaceholder(value) ? undefined : (value as string);
}

export interface SocialLink {
  label: string;
  href: string;
  /** Short identifier used to pick the icon. */
  network: "facebook" | "instagram" | "youtube" | "tiktok" | "linkedin";
}

export const agencyConfig = {
  name: "Islamabad Property Consultant",
  shortName: "IPC",
  legalName: "Islamabad Property Consultant",

  /** One-line positioning used in the footer, schema.org and OG description. */
  positioning:
    "Independent guidance for property buyers and investors in Islamabad.",

  description:
    "Islamabad Property Consultant is an independent property consultancy and marketing firm advising buyers and investors on premium real-estate projects across Islamabad.",

  /* --- WhatsApp: the primary conversion channel -------------------------- */
  whatsappNumber: "923333335912",
  whatsappDisplay: "+92 333 3335912",
  whatsappBaseUrl: "https://wa.me/923333335912",

  /* --- Voice ------------------------------------------------------------- */
  phone: "+923333335912",
  phoneDisplay: "+92 333 3335912",

  /* --- Awaiting verified business data ----------------------------------- */
  email: "[EMAIL]",
  officeAddress: "[OFFICE_ADDRESS]",
  officeAddressLines: ["[OFFICE_ADDRESS]"],
  googleMapUrl: "[GOOGLE_MAP_URL]",
  logo: "[AGENCY_LOGO]",
  consultantName: "[CONSULTANT_NAME]",
  consultantPhoto: "[CONSULTANT_PHOTO]",
  consultantRole: "Principal Consultant",
  yearsOfExperience: "[YEARS_OF_EXPERIENCE]",

  /** Office hours — replace once confirmed. */
  hours: "[OFFICE_HOURS]",

  social: [
    { label: "Facebook", href: "[FACEBOOK]", network: "facebook" },
    { label: "Instagram", href: "[INSTAGRAM]", network: "instagram" },
    { label: "YouTube", href: "[YOUTUBE]", network: "youtube" },
    { label: "TikTok", href: "[TIKTOK]", network: "tiktok" },
  ] satisfies SocialLink[],

  /**
   * Standing disclosure. Islamabad Property Consultant markets and advises on
   * third-party projects; it is not the developer or a government authority.
   */
  independenceNotice:
    "Islamabad Property Consultant is an independent property consultancy and marketing firm. We are not CDA, DHA, or the developer of Margalla Enclave, and we do not represent ourselves as an official sales channel unless separately authorised in writing.",

  projectDataDisclaimer:
    "Project information on this page is compiled from the developer's published material and is provided for general guidance only. Prices, availability, development status, approvals and timelines change. Verify all details and documentation directly with the developer before making any financial decision.",
} as const;

export type AgencyConfig = typeof agencyConfig;

/** Social profiles that actually have a URL, for rendering. */
export const activeSocialLinks: SocialLink[] = agencyConfig.social.filter((s) =>
  Boolean(resolved(s.href)),
);
