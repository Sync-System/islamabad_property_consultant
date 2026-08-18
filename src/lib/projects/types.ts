/**
 * Project content schema.
 *
 * Every project page is rendered entirely from one of these objects. No project
 * facts live inside components. The shape is intentionally serialisable (no
 * functions, no JSX) so it can migrate to Sanity / Strapi / Supabase / a custom
 * dashboard later without touching the presentation layer.
 *
 * Verification discipline
 * -----------------------
 * Real-estate copy invites invention. It is not allowed here. Anything that
 * could influence a purchase — price, size, date, distance, approval, status —
 * carries a `SourcedValue` recording where it came from. Unverified facts are
 * expressed as `{ verified: false }` and the UI renders a "confirm on WhatsApp"
 * affordance instead of a number.
 */

/* -------------------------------------------------------------------------- */
/* Sourcing                                                                    */
/* -------------------------------------------------------------------------- */

export type SourceKind =
  | "developer" // published by the project developer
  | "press" // mainstream news reporting
  | "agency" // Islamabad Property Consultant's own statement
  | "unverified"; // not yet confirmed — must not be presented as fact

export interface Source {
  kind: SourceKind;
  /** Human label shown in attribution lines, e.g. "DHA Islamabad". */
  label: string;
  url?: string;
  /** ISO date the value was last checked. */
  checkedOn?: string;
}

/** A value that is only rendered when it has been verified. */
export type SourcedValue<T> =
  | { verified: true; value: T; source: Source; note?: string }
  | { verified: false; placeholder?: string; note?: string };

export function isVerified<T>(
  v: SourcedValue<T> | undefined,
): v is { verified: true; value: T; source: Source; note?: string } {
  return Boolean(v && v.verified);
}

/** Reads a sourced value, or returns the fallback when unverified. */
export function valueOr<T>(v: SourcedValue<T> | undefined, fallback: T): T {
  return isVerified(v) ? v.value : fallback;
}

/* -------------------------------------------------------------------------- */
/* Media                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A media slot. When `src` is absent the app renders an original generated
 * placeholder keyed by `art` — never a broken image and never a third-party
 * photograph we do not hold rights to. Dropping a file into
 * `/public/projects/<slug>/...` and setting `src` is the only step needed to
 * swap in real photography.
 */
export interface Media {
  /** Path under /public once licensed artwork is available. */
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  /** Caption shown in galleries and lightboxes. */
  caption?: string;
  /** Which generated composition to draw while `src` is empty. */
  art?: ArtVariant;
  /** Credit line for licensed or developer-supplied imagery. */
  credit?: string;
  /** Aspect ratio hint for layout, e.g. "4/5". Prevents layout shift. */
  ratio?: string;
}

export type ArtVariant =
  | "ridge" // layered Margalla ridge lines
  | "contour" // topographic contour field
  | "plan" // architectural site-plan abstraction
  | "tower" // elevation / massing study
  | "water" // lake / waterfront
  | "canopy" // trees and green belt
  | "street" // boulevard perspective
  | "aerial"; // aerial block layout

/* -------------------------------------------------------------------------- */
/* Sections                                                                    */
/* -------------------------------------------------------------------------- */

/** Per-project switchboard. Projects need not share a layout. */
export interface SectionFlags {
  trustBar: boolean;
  overview: boolean;
  highlights: boolean;
  propertyOptions: boolean;
  paymentPlan: boolean;
  masterPlan: boolean;
  amenities: boolean;
  destinations: boolean;
  location: boolean;
  gallery: boolean;
  progress: boolean;
  siteVisit: boolean;
  leadForm: boolean;
  faqs: boolean;
}

/* -------------------------------------------------------------------------- */
/* Content blocks                                                              */
/* -------------------------------------------------------------------------- */

export interface Stat {
  /** Numeric portion, animated when it parses as a number. */
  value: string;
  label: string;
  /** Small qualifier, e.g. "as reported by the developer". */
  footnote?: string;
  source?: Source;
}

export interface Highlight {
  /** Short categorical label: Location, Credibility, Lifestyle… */
  category: string;
  title: string;
  body: string;
  art?: ArtVariant;
}

export interface PropertyOption {
  id: string;
  /** "Residential Plot", "Commercial Plot", "Apartment"… */
  type: string;
  /** Display size, e.g. "250 Sq Yds". */
  size: string;
  /** Local equivalent where it aids comprehension, e.g. "10 Marla". */
  sizeAlt?: string;
  purpose: string;
  description?: string;
  /** Non-refundable processing / application fee, when published. */
  processingFee?: SourcedValue<string>;
  /** Headline price, when published. */
  startingPrice?: SourcedValue<string>;
  /** Availability wording. Never invent scarcity. */
  availability?: SourcedValue<string>;
  art?: ArtVariant;
  featured?: boolean;
}

/** One row of a payment plan: a size and its prices across tenures. */
export interface PaymentPlanRow {
  /** Matches a PropertyOption id where possible. */
  optionId?: string;
  size: string;
  processingFee?: string;
  /** Keyed by PaymentPlanTenure.id. */
  prices: Record<string, { salePrice: string; downPayment?: string }>;
}

export interface PaymentPlanTenure {
  id: string;
  label: string;
  /** e.g. "4 × quarterly instalments". */
  structure: string;
  /** e.g. "20% down payment within 30 days of ballot". */
  downPaymentNote?: string;
}

export interface PaymentPlanGroup {
  id: string;
  label: string;
  rows: PaymentPlanRow[];
}

export interface PaymentPlan {
  /** Rendered above the table. */
  intro: string;
  tenures: PaymentPlanTenure[];
  groups: PaymentPlanGroup[];
  /** Currency prefix for every figure, e.g. "PKR". */
  currency: string;
  /** Legal / tax note reproduced from the developer's schedule. */
  notes: string[];
  source: Source;
  /** Downloadable official schedule, when we are cleared to host it. */
  document?: { label: string; href?: string };
  /** Shown when figures may be stale — always routes to WhatsApp. */
  freshnessNote: string;
}

export interface Amenity {
  title: string;
  description?: string;
  /** Icon key resolved by the Amenities component. */
  icon: AmenityIcon;
}

export type AmenityIcon =
  | "location"
  | "security"
  | "landscape"
  | "utilities"
  | "education"
  | "health"
  | "retail"
  | "sport"
  | "water"
  | "road";

/** A named landmark destination inside the project. */
export interface Destination {
  eyebrow: string;
  name: string;
  description: string;
  facilities?: string[];
  media: Media;
}

export interface NearbyPlace {
  name: string;
  /** Only rendered when verified — no invented drive times. */
  distance: SourcedValue<string>;
  kind?: string;
}

export interface MasterPlan {
  media: Media;
  legend?: { label: string; swatch: string }[];
  note?: string;
}

export interface LocationInfo {
  /** Prose address, e.g. "Zone 4, Islamabad, on Jinnah Avenue". */
  addressLine: string;
  zone?: string;
  sector?: SourcedValue<string>;
  road?: string;
  /** Embed URL for the map iframe. Placeholder-aware. */
  mapEmbedUrl?: string;
  mapLinkUrl?: string;
  media: Media;
  nearby: NearbyPlace[];
  accessNotes?: { title: string; body: string }[];
}

export interface ProgressEntry {
  /** Human date, e.g. "November 2025". */
  date: string;
  /** ISO for sorting / <time>. */
  isoDate?: string;
  phase: string;
  note: string;
  media?: Media;
  source?: Source;
}

export interface Faq {
  question: string;
  answer: string;
  category?: string;
  source?: Source;
}

export interface ProjectSeo {
  title: string;
  description: string;
  keywords?: string[];
  ogImageAlt?: string;
}

export interface ProjectHero {
  eyebrow: string;
  /** Rendered as the h1. */
  title: string;
  /** Sits beneath the title — the positioning line. */
  subtitle: string;
  locationLabel: string;
  /** Verified association line, e.g. "A CDA & DHA Islamabad joint venture". */
  association?: SourcedValue<string>;
  media: Media;
  primaryCta: string;
  secondaryCta: string;
}

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

export type ProjectStatus =
  | "Under Development"
  | "Pre-Launch"
  | "Launched"
  | "Possession"
  | "Completed";

export interface Project {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  /** Card / meta summary. One or two sentences. */
  summary: string;
  city: string;
  /** Short human label for cards and meta, e.g. "Zone 4, Islamabad". */
  locationLabel: string;
  /** Categorisation for the future /projects filters. */
  projectType: string[];
  status: SourcedValue<ProjectStatus>;
  developers: { name: string; role: string; source?: Source }[];
  featured: boolean;
  /** Publication order on the directory page. */
  order: number;

  sections: SectionFlags;

  hero: ProjectHero;
  stats: Stat[];
  overview: {
    eyebrow: string;
    title: string;
    lead: string;
    body: string[];
    media: Media[];
    pullQuote?: string;
  };
  highlights: {
    eyebrow: string;
    title: string;
    intro?: string;
    items: Highlight[];
  };
  propertyOptions: {
    eyebrow: string;
    title: string;
    intro?: string;
    allotmentNote?: string;
    items: PropertyOption[];
  };
  paymentPlan?: PaymentPlan;
  masterPlan?: MasterPlan;
  amenities: {
    eyebrow: string;
    title: string;
    intro?: string;
    items: Amenity[];
    source?: Source;
  };
  destinations: {
    eyebrow: string;
    title: string;
    intro?: string;
    items: Destination[];
  };
  location: LocationInfo;
  gallery: Media[];
  progress: {
    intro?: string;
    entries: ProgressEntry[];
  };
  faqs: Faq[];
  seo: ProjectSeo;
  /** Where the developer's own information can be checked. */
  officialSource: Source;
}

/** Summary shape used by the projects directory — cheap to render. */
export interface ProjectSummary {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  summary: string;
  city: string;
  locationLabel: string;
  projectType: string[];
  statusLabel: string;
  featured: boolean;
  order: number;
  media: Media;
}
