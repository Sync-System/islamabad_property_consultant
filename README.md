# Islamabad Property Consultant

A production website for an independent property consultancy in Islamabad, built
so that **every project page is a data file, not a rebuild** — and so that every
factual claim on it can be traced to a source.

The first project is **Margalla Enclave** (`/projects/margalla-enclave`), the
CDA and DHA Islamabad joint venture in Zone 4.

---

## Quick start

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build && npm start   # production build
npx tsc --noEmit             # type check
npx eslint .                 # lint
```

**Node 20.9+ required** (Next.js 16). Turbopack is the default for both `dev`
and `build`.

---

## Before you go live

Two things need real values. Everything else works today.

### 1. Business details

All placeholders live in one file: [`src/lib/config/agency.ts`](src/lib/config/agency.ts).
They are written as `[BRACKETED_TOKENS]`, and the UI detects them — a
placeholder renders as “to be confirmed” rather than as a broken `mailto:[EMAIL]`.

| Field | Status |
| --- | --- |
| `whatsappNumber`, `whatsappDisplay`, `phone` | ✅ set to `+92 333 3335912` |
| `email` | `[EMAIL]` |
| `officeAddress`, `googleMapUrl` | `[OFFICE_ADDRESS]`, `[GOOGLE_MAP_URL]` |
| `logo` | `[AGENCY_LOGO]` — a typographic wordmark stands in |
| `consultantName`, `consultantPhoto` | `[CONSULTANT_NAME]`, `[CONSULTANT_PHOTO]` |
| `social` | `[FACEBOOK]`, `[INSTAGRAM]`, `[YOUTUBE]`, `[TIKTOK]` |

There are deliberately **no** placeholders for years of experience, awards,
review counts or client numbers. Those are not invented here; add them only when
they are true, and add the field at the same time.

### 2. Environment

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com   # canonical origin
NEXT_PUBLIC_ALLOW_INDEXING=false               # set on staging only
LEAD_WEBHOOK_URL=                              # optional: where leads are POSTed
LEAD_WEBHOOK_TOKEN=                            # optional: bearer token for above
```

With no `LEAD_WEBHOOK_URL`, leads are logged (redacted) and the WhatsApp hand-off
still happens — see “Lead capture” below.

---

## How it is put together

```
src/
  app/
    page.tsx                    agency home
    projects/page.tsx           project directory
    projects/[slug]/page.tsx    the reusable project page
    legal/[doc]/page.tsx        disclaimer · privacy · terms
    api/lead/route.ts           lead intake
    sitemap.ts robots.ts        derived from the project registry
  lib/
    config/agency.ts            every phone number, address and social link
    config/site.ts              canonical URL, metadata defaults, navigation
    projects/types.ts           the project content schema
    projects/margalla-enclave.ts   all Margalla Enclave facts, with sources
    projects/index.ts           the project registry
    whatsapp.ts                 URL + message generation
    attribution.ts              UTM / click-id capture
    analytics.ts                vendor-agnostic event bus
    leads.ts                    validation, sanitisation, transport
    structured-data.ts          schema.org payloads
  components/
    project/  …                 one component per page section
    conversion/ …               WhatsApp CTA, floating button, mobile bar
    forms/    …                 enquiry + site-visit forms
    media/    …                 image + generated-artwork rendering
    ui/       …                 motion, icons, section shells
```

### Adding project #2

1. Create `src/lib/projects/<slug>.ts` exporting a `Project`.
2. Import it in `src/lib/projects/index.ts` and add it to the `projects` array.
3. Drop imagery into `public/projects/<slug>/…` and set `src` on the media entries.

Routing, metadata, the sitemap, the directory page, the enquiry form’s project
picker and every WhatsApp message pick it up automatically. Section inclusion is
per project via `project.sections`, so a scheme with no payment plan or no master
plan simply renders without them.

---

## The parts worth knowing about

### Sourcing discipline

Real-estate copy invites invention, so the schema makes it awkward. Anything
that could influence a purchase — price, size, date, distance, approval, status —
is a `SourcedValue`:

```ts
startingPrice: {
  verified: true,
  value: "PKR 21,434,375",
  source: { kind: "developer", label: "DHA Islamabad — Margalla Enclave",
            url: "…", checkedOn: "2026-08-16" },
  note: "Lump-sum price, payable within 30 days of ballot. Exclusive of …",
}
```

`{ verified: false }` renders as “confirm with us” with a WhatsApp route — never
as a plausible-looking number. Drive times, the sector designation and every
figure in the payment plan carry their attribution on the page.

The payment schedule, plot sizes, processing fees, eligibility, amenity list and
FAQ answers were transcribed from the developer’s published material on
**16 August 2026**. The sector designation and balloting demand figures come from
press reporting and are labelled as such. No completion percentage is published,
because the developer does not publish one.

### WhatsApp conversion

`whatsappUrl()` in [`src/lib/whatsapp.ts`](src/lib/whatsapp.ts) is the only place
a `wa.me` link is built, and `agencyConfig.whatsappNumber` is the only place the
number appears. There are 22 WhatsApp entry points across the project page —
header, hero, every plot card, payment plan, master plan, gallery, location,
FAQs, both forms, footer, the floating button and the mobile bar — and each
carries its own `ctaLocation`, the project, the selected plot and full session
attribution into the message body.

Links render server-side with a working `href`, then upgrade in place once
attribution is available on the client. A visitor on a slow phone can convert
before hydration finishes.

### Lead capture

`useLeadForm` runs the same sequence for both forms:

1. validate (the server revalidates — client validation is a convenience)
2. fire the capture request
3. open WhatsApp with the structured message

Step 3 runs **whether or not step 2 succeeded**. A backend outage is our problem,
not the visitor’s. Spam handling is a honeypot plus a minimum time-on-form — no
CAPTCHA, no third-party script.

To connect a CRM, edit `deliverLead()` in
[`src/app/api/lead/route.ts`](src/app/api/lead/route.ts). Everything upstream
already speaks `NormalisedLead`.

### Analytics

The UI never talks to a vendor. It calls `track()` with a typed event; adapters
forward it on. GA4/GTM, Meta Pixel and TikTok adapters ship in
[`src/lib/analytics.ts`](src/lib/analytics.ts) and are no-ops until the relevant
script is present — so installing a tag manager later needs no code change.

Tracked: `project_view`, `whatsapp_click`, `lead_form_start`, `lead_form_submit`,
`phone_click`, `location_view`, `gallery_open`, `payment_plan_view`,
`master_plan_open`, `site_visit_request`.

### Imagery

Photographs are of **Islamabad and the Margalla Hills**, published under Creative
Commons licences and credited individually where they appear. They are *not*
photographs of the Margalla Enclave site, and the gallery, the hero credit line
and the disclaimer all say so.

Slots without a licensed photograph render original generated SVG artwork
(`ProjectArt`) rather than a grey box or someone else’s image — architectural
line work, ridge sections, site-plan abstractions. Dropping a file into
`public/projects/<slug>/…` and setting `Media.src` replaces it with no component
change.

The master plan is explicitly an indicative diagram, not the developer’s sheet,
and is labelled as such in the viewer.

### Motion

No animation library. Entrances are CSS driven by one data attribute that an
`IntersectionObserver` flips (`Reveal`); the hero uses pure CSS keyframes that
start on the first frame, because animating the LCP element from `opacity: 0`
after hydration cost 2.5 seconds of LCP. `prefers-reduced-motion` is honoured
globally in `globals.css`.

### Design tokens

Colour, type scale, spacing, radius, elevation and easing are defined once in
the `@theme` block of [`src/app/globals.css`](src/app/globals.css). Two notes:

- Container tokens must not be named after CSS keywords. `--container-full`
  would silently redefine `w-full` and `max-w-full` site-wide.
- The WhatsApp green is deeper than the brand `#25D366`, which fails WCAG AA
  against white at 2.7:1. The tokens here reach 5.4:1.

---

## Verified state

Measured on the production build, throttled to a mid-range phone
(4× CPU slowdown, ~1.6 Mbps, 390 × 844):

| | Project page | Home |
| --- | --- | --- |
| LCP | 1.13 s | 0.88 s |
| CLS | 0 | 0 |
| Transfer | 442 KB | 388 KB |
| Requests | 20 | 22 |

Also checked: no horizontal overflow at 375 / 390 / 430 / 768 / 1024 / 1280 /
1440 px; zero WCAG AA contrast failures; keyboard paths through the nav drawer,
gallery lightbox and master-plan viewer (focus trap, `Escape`, focus return);
reduced-motion; both forms end-to-end including validation, attribution and the
generated WhatsApp message.

---

## Legal position

The site states in the hero, the footer, the final CTA and a dedicated
disclaimer page that Islamabad Property Consultant is an independent
consultancy — not CDA, not DHA, and not the developer of Margalla Enclave. The
legal pages in `src/app/legal/[doc]/page.tsx` are a working draft written for
this site; have them reviewed by a qualified lawyer before relying on them.
