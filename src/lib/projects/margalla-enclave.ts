import type { Project, Source } from "./types";

/**
 * Margalla Enclave, Islamabad.
 *
 * Every factual claim below is traceable to one of the sources declared here.
 * Figures were transcribed from the developer's published payment schedule and
 * FAQ on 16 August 2026. Nothing has been estimated, rounded or inferred.
 *
 * If you are updating this file: a fact without a `source` does not ship.
 */

const DEVELOPER_SOURCE: Source = {
  kind: "developer",
  label: "DHA Islamabad — Margalla Enclave",
  url: "https://margallaenclave.dhai-r.com.pk/",
  checkedOn: "2026-08-16",
};

const PRESS_TRIBUNE: Source = {
  kind: "press",
  label: "The Express Tribune",
  url: "https://tribune.com.pk/story/2522473/margalla-enclave-expansion-cda-offers-new-residential-plots-for-sale",
  checkedOn: "2026-08-16",
};

/** Shared tenure definitions — identical across residential and commercial. */
const TENURES = [
  {
    id: "lump-sum",
    label: "Lump Sum",
    structure: "Single payment within 30 days of ballot",
    downPaymentNote: "Rebate is already incorporated into the lump-sum price.",
  },
  {
    id: "1-year",
    label: "1 Year Plan",
    structure: "4 × quarterly instalments",
    downPaymentNote: "20% down payment within 30 days of ballot",
  },
  {
    id: "2-year",
    label: "2 Years Plan",
    structure: "8 × quarterly instalments",
    downPaymentNote: "20% down payment within 30 days of ballot",
  },
  {
    id: "3-year",
    label: "3 Years Plan",
    structure: "12 × quarterly instalments",
    downPaymentNote: "20% down payment within 30 days of ballot",
  },
];

export const margallaEnclave: Project = {
  slug: "margalla-enclave",
  name: "Margalla Enclave Islamabad",
  shortName: "Margalla Enclave",
  tagline: "A CDA and DHA Islamabad joint venture at the foot of the Margalla Hills.",
  summary:
    "Residential and commercial plots in Zone 4, Islamabad, on Jinnah Avenue — allotted by ballot, with lump-sum and quarterly instalment plans published by the developer.",
  city: "Islamabad",
  locationLabel: "Zone 4, Islamabad",
  projectType: ["Residential Plots", "Commercial Plots"],
  status: {
    verified: true,
    value: "Under Development",
    source: DEVELOPER_SOURCE,
    note: "The developer's FAQ describes the project as under-development.",
  },
  developers: [
    {
      name: "Capital Development Authority (CDA)",
      role: "Joint venture partner",
      source: DEVELOPER_SOURCE,
    },
    {
      name: "DHA Islamabad",
      role: "Joint venture partner and project developer",
      source: DEVELOPER_SOURCE,
    },
  ],
  featured: true,
  order: 1,

  sections: {
    trustBar: true,
    overview: true,
    highlights: true,
    propertyOptions: true,
    paymentPlan: true,
    masterPlan: true,
    amenities: true,
    destinations: true,
    location: true,
    gallery: true,
    progress: true,
    siteVisit: true,
    leadForm: true,
    faqs: true,
  },

  /* ---------------------------------------------------------------------- */
  /* Hero                                                                    */
  /* ---------------------------------------------------------------------- */

  hero: {
    eyebrow: "Islamabad Property Consultant presents",
    title: "Margalla Enclave",
    subtitle:
      "Plots in Zone 4, Islamabad — where the capital's planned grid meets the Margalla foothills.",
    locationLabel: "Zone 4, Islamabad · Jinnah Avenue",
    association: {
      verified: true,
      value: "A joint venture of CDA & DHA Islamabad",
      source: DEVELOPER_SOURCE,
    },
    media: {
      src: "/projects/margalla-enclave/hero/margalla-panorama.jpg",
      alt: "Panorama of the Margalla Hills above Islamabad",
      width: 2600,
      height: 1004,
      art: "ridge",
      credit: "Margalla Hills National Park · Zain.3nov · CC BY-SA 4.0",
      ratio: "16/9",
    },
    primaryCta: "Get Details on WhatsApp",
    secondaryCta: "Explore the Project",
  },

  /* ---------------------------------------------------------------------- */
  /* Trust bar                                                               */
  /* ---------------------------------------------------------------------- */

  stats: [
    {
      value: "Zone 4",
      label: "Islamabad",
      footnote: "On Jinnah Avenue, formerly Kuri Road",
      source: DEVELOPER_SOURCE,
    },
    {
      value: "CDA + DHA",
      label: "Joint venture",
      footnote: "As stated by the developer",
      source: DEVELOPER_SOURCE,
    },
    {
      value: "7",
      label: "Plot categories",
      footnote: "3 residential and 4 commercial sizes, allotted by ballot",
      source: DEVELOPER_SOURCE,
    },
    {
      value: "3",
      label: "Year instalment plan",
      footnote: "Lump sum up to 3 years, paid quarterly",
      source: DEVELOPER_SOURCE,
    },
  ],

  /* ---------------------------------------------------------------------- */
  /* Overview                                                                */
  /* ---------------------------------------------------------------------- */

  overview: {
    eyebrow: "The project",
    title: "A planned address at the foot of the Margallas",
    lead: "Margalla Enclave sits in Zone 4 of Islamabad, on Jinnah Avenue — the road formerly known as Kuri Road. It is developed as a joint venture between the Capital Development Authority and DHA Islamabad.",
    body: [
      "Islamabad is one of the few cities in Pakistan built to a master plan, and Zone 4 is where that plan meets open land and the treeline of the Margalla Hills. Margalla Enclave is positioned in that transition — inside the capital's road network, but with the hills as its horizon rather than its postcard.",
      "The developer describes a community planned around completed infrastructure and public amenity rather than a plotted grid alone: an extensive road and drainage network, underground utilities, parks and green belts, education and healthcare provision, and round-the-clock security across a gated boundary.",
      "For buyers, the structure is straightforward. Residential and commercial plots are allotted through ballot, open to holders of a valid CNIC or NICOP, with a published payment schedule that runs from a single lump sum to twelve quarterly instalments across three years.",
    ],
    pullQuote:
      "Inside the capital's road network, with the hills as the horizon rather than the postcard.",
    media: [
      {
        src: "/projects/margalla-enclave/context/islamabad-blue-area.jpg",
        alt: "Islamabad's Blue Area at dusk, with the Margalla Hills behind the city",
        width: 1800,
        height: 1200,
        art: "aerial",
        ratio: "4/5",
        caption: "Islamabad at dusk — the capital the project sits inside",
        credit: "Obaid747 · CC BY-SA 3.0",
      },
      {
        src: "/projects/margalla-enclave/context/green-belt.jpg",
        alt: "Green belt planting and mature trees in Islamabad",
        width: 1600,
        height: 1066,
        art: "canopy",
        ratio: "1/1",
        caption: "Islamabad's green belts",
        credit: "Nida Hassan · CC BY-SA 4.0",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  /* Why consider                                                            */
  /* ---------------------------------------------------------------------- */

  highlights: {
    eyebrow: "Why buyers are looking here",
    title: "Five things worth weighing before you decide",
    intro:
      "An honest read of the project as it stands today — based on what the developer has actually published, not on what sells fastest.",
    items: [
      {
        category: "Location",
        title: "Zone 4, on Jinnah Avenue",
        body: "The site sits at the foothills of the Margalla Hills in Zone 4, Islamabad, on Jinnah Avenue — previously Kuri Road. The developer lists direct access to Srinagar Highway, Jinnah Avenue and the surrounding arterial network.",
        art: "ridge",
      },
      {
        category: "Credibility",
        title: "A CDA and DHA Islamabad joint venture",
        body: "Margalla Enclave is developed jointly by the Capital Development Authority and DHA Islamabad. Allotment runs through a published ballot process open to CNIC and NICOP holders, with payments made to a named project account.",
        art: "plan",
      },
      {
        category: "Structure",
        title: "A published payment schedule",
        body: "Prices, processing fees and instalment structures are published by the developer rather than negotiated privately — lump sum, or 4, 8 and 12 quarterly instalments across one, two and three years, each with a 20% down payment.",
        art: "tower",
      },
      {
        category: "Lifestyle",
        title: "Amenity planned in, not promised later",
        body: "The developer's amenity list covers the Lake District and sports facilities, Bazar-e-Bozorg and shopping, a botanical garden and parks, education and healthcare, an extensive road and drainage network, and 24/7 security.",
        art: "water",
      },
      {
        category: "Considerations",
        title: "What still needs your own diligence",
        body: "The project is described by the developer as under-development. Payment plans cannot be changed once selected, late payment carries a surcharge, and quoted prices exclude applicable DHA charges and government taxes. We will walk you through each of these before you commit.",
        art: "contour",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  /* Property options                                                        */
  /* ---------------------------------------------------------------------- */

  propertyOptions: {
    eyebrow: "Property options",
    title: "Plot categories offered",
    intro:
      "Residential and commercial plots are allotted through ballot. Sizes and processing fees below are as published by the developer.",
    allotmentNote:
      "All plots are allotted through ballot. Applicants must hold a valid CNIC or NICOP.",
    items: [
      {
        id: "res-125",
        type: "Residential Plot",
        size: "125 Sq Yds",
        sizeAlt: "5 Marla",
        purpose: "Home construction",
        description:
          "The entry residential category — the most frequently requested size for a first home in a planned Islamabad sector.",
        processingFee: {
          verified: true,
          value: "PKR 10,000",
          source: DEVELOPER_SOURCE,
          note: "Non-refundable and non-adjustable.",
        },
        startingPrice: {
          verified: true,
          value: "PKR 21,434,375",
          source: DEVELOPER_SOURCE,
          note: "Lump-sum price, payable within 30 days of ballot. Exclusive of applicable DHA charges and government taxes.",
        },
        availability: { verified: false },
        art: "street",
      },
      {
        id: "res-250",
        type: "Residential Plot",
        size: "250 Sq Yds",
        sizeAlt: "10 Marla",
        purpose: "Home construction",
        description:
          "A mid-size residential plot with room for a conventional double-storey house and setbacks.",
        processingFee: {
          verified: true,
          value: "PKR 15,000",
          source: DEVELOPER_SOURCE,
          note: "Non-refundable and non-adjustable.",
        },
        startingPrice: {
          verified: true,
          value: "PKR 42,011,375",
          source: DEVELOPER_SOURCE,
          note: "Lump-sum price, payable within 30 days of ballot. Exclusive of applicable DHA charges and government taxes.",
        },
        availability: { verified: false },
        art: "canopy",
        featured: true,
      },
      {
        id: "res-500",
        type: "Residential Plot",
        size: "500 Sq Yds",
        sizeAlt: "1 Kanal",
        purpose: "Home construction",
        description:
          "The largest published residential category, and the size reported to have drawn the heaviest demand in balloting.",
        processingFee: {
          verified: true,
          value: "PKR 20,000",
          source: DEVELOPER_SOURCE,
          note: "Non-refundable and non-adjustable.",
        },
        startingPrice: {
          verified: true,
          value: "PKR 72,876,875",
          source: DEVELOPER_SOURCE,
          note: "Lump-sum price, payable within 30 days of ballot. Exclusive of applicable DHA charges and government taxes.",
        },
        availability: { verified: false },
        art: "aerial",
      },
      {
        id: "com-100",
        type: "Commercial Plot",
        size: "100 Sq Yds",
        purpose: "Retail and commercial development",
        processingFee: {
          verified: true,
          value: "PKR 30,000",
          source: DEVELOPER_SOURCE,
          note: "Non-refundable and non-adjustable.",
        },
        startingPrice: {
          verified: true,
          value: "PKR 81,450,625",
          source: DEVELOPER_SOURCE,
          note: "Lump-sum price, payable within 30 days of ballot. Exclusive of applicable DHA charges and government taxes.",
        },
        availability: { verified: false },
        art: "tower",
      },
      {
        id: "com-13325",
        type: "Commercial Plot",
        size: "133.25 Sq Yds",
        purpose: "Retail and commercial development",
        processingFee: {
          verified: true,
          value: "PKR 40,000",
          source: DEVELOPER_SOURCE,
          note: "Non-refundable and non-adjustable.",
        },
        startingPrice: {
          verified: true,
          value: "PKR 120,032,500",
          source: DEVELOPER_SOURCE,
          note: "Lump-sum price, payable within 30 days of ballot. Exclusive of applicable DHA charges and government taxes.",
        },
        availability: { verified: false },
        art: "plan",
      },
      {
        id: "com-200",
        type: "Commercial Plot",
        size: "200 Sq Yds",
        purpose: "Retail and commercial development",
        processingFee: {
          verified: true,
          value: "PKR 50,000",
          source: DEVELOPER_SOURCE,
          note: "Non-refundable and non-adjustable.",
        },
        startingPrice: {
          verified: true,
          value: "PKR 145,753,750",
          source: DEVELOPER_SOURCE,
          note: "Lump-sum price, payable within 30 days of ballot. Exclusive of applicable DHA charges and government taxes.",
        },
        availability: { verified: false },
        art: "street",
      },
      {
        id: "com-500",
        type: "Commercial Plot",
        size: "500 Sq Yds",
        purpose: "Retail and commercial development",
        processingFee: {
          verified: true,
          value: "PKR 60,000",
          source: DEVELOPER_SOURCE,
          note: "Non-refundable and non-adjustable.",
        },
        startingPrice: {
          verified: true,
          value: "PKR 342,950,000",
          source: DEVELOPER_SOURCE,
          note: "Lump-sum price, payable within 30 days of ballot. Exclusive of applicable DHA charges and government taxes.",
        },
        availability: { verified: false },
        art: "aerial",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  /* Payment plan — transcribed from the developer's published schedule       */
  /* ---------------------------------------------------------------------- */

  paymentPlan: {
    intro:
      "The developer publishes a single schedule covering lump-sum payment and quarterly instalment plans of one, two and three years. Instalment plans require a 20% down payment within 30 days of ballot.",
    currency: "PKR",
    tenures: TENURES,
    source: DEVELOPER_SOURCE,
    notes: [
      "Prices are exclusive of applicable DHA charges and government taxes.",
      "The lump-sum price already incorporates the rebate; no further rebate applies.",
      "A payment plan cannot be changed once it has been selected.",
      "Late payment of an instalment attracts a surcharge.",
      "Processing fees are non-refundable and non-adjustable.",
    ],
    freshnessNote:
      "Schedules are revised between phases and ballots. Confirm the current figures for your ballot before you pay anything.",
    document: { label: "Official application form", href: undefined },
    groups: [
      {
        id: "residential",
        label: "Residential Plots",
        rows: [
          {
            optionId: "res-125",
            size: "125 Sq Yds",
            processingFee: "10,000",
            prices: {
              "lump-sum": { salePrice: "21,434,375" },
              "1-year": { salePrice: "22,562,500", downPayment: "4,512,500" },
              "2-year": { salePrice: "23,750,000", downPayment: "4,750,000" },
              "3-year": { salePrice: "25,000,000", downPayment: "5,000,000" },
            },
          },
          {
            optionId: "res-250",
            size: "250 Sq Yds",
            processingFee: "15,000",
            prices: {
              "lump-sum": { salePrice: "42,011,375" },
              "1-year": { salePrice: "44,222,500", downPayment: "8,844,500" },
              "2-year": { salePrice: "46,550,000", downPayment: "9,310,000" },
              "3-year": { salePrice: "49,000,000", downPayment: "9,800,000" },
            },
          },
          {
            optionId: "res-500",
            size: "500 Sq Yds",
            processingFee: "20,000",
            prices: {
              "lump-sum": { salePrice: "72,876,875" },
              "1-year": { salePrice: "76,712,500", downPayment: "15,342,500" },
              "2-year": { salePrice: "80,750,000", downPayment: "16,150,000" },
              "3-year": { salePrice: "85,000,000", downPayment: "17,000,000" },
            },
          },
        ],
      },
      {
        id: "commercial",
        label: "Commercial Plots",
        rows: [
          {
            optionId: "com-100",
            size: "100 Sq Yds",
            processingFee: "30,000",
            prices: {
              "lump-sum": { salePrice: "81,450,625" },
              "1-year": { salePrice: "85,737,500", downPayment: "17,147,500" },
              "2-year": { salePrice: "90,250,000", downPayment: "18,050,000" },
              "3-year": { salePrice: "95,000,000", downPayment: "19,000,000" },
            },
          },
          {
            optionId: "com-13325",
            size: "133.25 Sq Yds",
            processingFee: "40,000",
            prices: {
              "lump-sum": { salePrice: "120,032,500" },
              "1-year": { salePrice: "126,350,000", downPayment: "25,270,000" },
              "2-year": { salePrice: "133,000,000", downPayment: "26,600,000" },
              "3-year": { salePrice: "140,000,000", downPayment: "28,000,000" },
            },
          },
          {
            optionId: "com-200",
            size: "200 Sq Yds",
            processingFee: "50,000",
            prices: {
              "lump-sum": { salePrice: "145,753,750" },
              "1-year": { salePrice: "153,425,000", downPayment: "30,685,000" },
              "2-year": { salePrice: "161,500,000", downPayment: "32,300,000" },
              "3-year": { salePrice: "170,000,000", downPayment: "34,000,000" },
            },
          },
          {
            optionId: "com-500",
            size: "500 Sq Yds",
            processingFee: "60,000",
            prices: {
              "lump-sum": { salePrice: "342,950,000" },
              "1-year": { salePrice: "361,000,000", downPayment: "72,200,000" },
              "2-year": { salePrice: "380,000,000", downPayment: "76,000,000" },
              "3-year": { salePrice: "400,000,000", downPayment: "80,000,000" },
            },
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  /* Master plan                                                             */
  /* ---------------------------------------------------------------------- */

  masterPlan: {
    media: {
      alt: "Margalla Enclave master plan showing residential and commercial blocks, road network and public open space",
      art: "plan",
      ratio: "3/2",
    },
    note: "Awaiting the developer's released master-plan sheet. The viewer below is showing an indicative site-structure diagram, not the official plan. Ask us for the current sheet and block availability on WhatsApp.",
    legend: [
      { label: "Residential blocks", swatch: "var(--color-pine-600)" },
      { label: "Commercial", swatch: "var(--color-brass-500)" },
      { label: "Parks & green belt", swatch: "var(--color-pine-400)" },
      { label: "Lake District", swatch: "#3f7fa8" },
      { label: "Arterial road network", swatch: "var(--color-ink-500)" },
    ],
  },

  /* ---------------------------------------------------------------------- */
  /* Amenities                                                               */
  /* ---------------------------------------------------------------------- */

  amenities: {
    eyebrow: "Community planning",
    title: "What the developer has committed to",
    intro:
      "The list below is reproduced from the developer's published amenity schedule. We have not added anything to it.",
    source: DEVELOPER_SOURCE,
    items: [
      {
        title: "Lake District & sports facilities",
        description:
          "A waterfront district planned as the community's signature public destination, with sports provision.",
        icon: "water",
      },
      {
        title: "Bazar-e-Bozorg & shopping malls",
        description:
          "A heritage-inspired marketplace alongside further retail and dining provision.",
        icon: "retail",
      },
      {
        title: "Botanical garden & parks",
        description: "Landscaped public open space, green belts and walking trails.",
        icon: "landscape",
      },
      {
        title: "Education facilities",
        description: "Schooling provision planned within the community.",
        icon: "education",
      },
      {
        title: "Hospitals",
        description: "Healthcare provision planned within reach of residents.",
        icon: "health",
      },
      {
        title: "Road network & drainage",
        description:
          "An extensive internal road network with an engineered drainage system.",
        icon: "road",
      },
      {
        title: "24/7 security & surveillance",
        description: "A gated boundary with round-the-clock surveillance.",
        icon: "security",
      },
      {
        title: "Underground utilities",
        description:
          "Electricity and utility infrastructure routed underground rather than overhead.",
        icon: "utilities",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  /* Signature destinations                                                  */
  /* ---------------------------------------------------------------------- */

  destinations: {
    eyebrow: "Signature destinations",
    title: "Three places the community is planned around",
    intro:
      "The developer has named three landmark destinations within Margalla Enclave. Each is a planned facility — ask us for the current construction status before you factor it into a decision.",
    items: [
      {
        eyebrow: "Waterfront",
        name: "Lake District",
        description:
          "Planned as the community's signature destination: a waterfront setting bringing together open water, leisure and public life at the centre of the enclave.",
        media: {
          alt: "Waterfront setting planned for the Lake District at Margalla Enclave",
          art: "water",
          ratio: "4/5",
        },
      },
      {
        eyebrow: "Heritage bazaar",
        name: "Bazar-e-Bazurg",
        description:
          "A marketplace drawing on the architecture of the traditional bazaar, combined with contemporary retail, dining and public space.",
        media: {
          alt: "Heritage-inspired marketplace architecture planned at Bazar-e-Bazurg",
          art: "street",
          ratio: "4/5",
        },
      },
      {
        eyebrow: "Family club",
        name: "Jacaranda Family Club",
        description:
          "The community's private club, planned around fitness, water and dining facilities for residents and their families.",
        facilities: [
          "Swimming pool",
          "Paddle courts",
          "Bowling alley",
          "Banquet hall",
          "Boating",
          "Rooftop restaurant",
          "Waterfront boat restaurant",
        ],
        media: {
          alt: "Clubhouse architecture planned for the Jacaranda Family Club",
          art: "tower",
          ratio: "4/5",
        },
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  /* Location                                                                */
  /* ---------------------------------------------------------------------- */

  location: {
    addressLine: "Zone 4, Islamabad — on Jinnah Avenue, formerly Kuri Road",
    zone: "Zone 4",
    sector: {
      verified: true,
      value: "Reported as Sector C-14, on Park Road",
      source: PRESS_TRIBUNE,
      note: "Sector designation is per press reporting rather than the developer's own site.",
    },
    road: "Jinnah Avenue (formerly Kuri Road)",
    mapEmbedUrl: undefined,
    mapLinkUrl: undefined,
    media: {
      src: "/projects/margalla-enclave/location/islamabad-highway.jpg",
      alt: "Islamabad Highway seen from the 9th Avenue bridge",
      width: 1800,
      height: 1100,
      art: "contour",
      ratio: "3/2",
      caption:
        "Islamabad's arterial network. Contextual photograph, not the project site.",
      credit: "Sohaib484 · CC BY-SA 4.0",
    },
    nearby: [
      {
        name: "Srinagar Highway",
        kind: "Arterial route",
        distance: {
          verified: true,
          value: "5 min drive",
          source: DEVELOPER_SOURCE,
          note: "Drive time as published by the developer.",
        },
      },
      {
        name: "Faizabad",
        kind: "Interchange",
        distance: {
          verified: true,
          value: "8 min drive",
          source: DEVELOPER_SOURCE,
          note: "Drive time as published by the developer.",
        },
      },
      {
        name: "Zero Point",
        kind: "Interchange",
        distance: {
          verified: true,
          value: "10 min drive",
          source: DEVELOPER_SOURCE,
          note: "Drive time as published by the developer.",
        },
      },
      {
        name: "Park Road Link",
        kind: "Access road",
        distance: {
          verified: true,
          value: "Nearing completion",
          source: DEVELOPER_SOURCE,
        },
      },
    ],
    accessNotes: [
      {
        title: "Jinnah Avenue frontage",
        body: "The project addresses Jinnah Avenue — the route previously known as Kuri Road — which forms its primary approach from the city.",
      },
      {
        title: "Arterial connections",
        body: "The developer lists direct access to Srinagar Highway, Jinnah Avenue and the surrounding arterial roads, with two new road accesses cited for the project.",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  /* Gallery                                                                 */
  /* ---------------------------------------------------------------------- */

  gallery: [
    {
      src: "/projects/margalla-enclave/gallery/margalla-ridge.jpg",
      alt: "The wooded ridge of the Margalla Hills above Islamabad",
      width: 1800,
      height: 1355,
      art: "ridge",
      ratio: "4/3",
      caption: "The Margalla Hills — the range the project takes its name from",
      credit: "Haanya · CC BY-SA 3.0",
    },
    {
      src: "/projects/margalla-enclave/gallery/islamabad-aerial.jpg",
      alt: "Aerial view over Islamabad from Daman-e-Koh in the Margalla Hills",
      width: 1800,
      height: 1350,
      art: "aerial",
      ratio: "4/3",
      caption: "Islamabad from Daman-e-Koh",
      credit: "Azam Ishaque · CC BY-SA 3.0",
    },
    {
      src: "/projects/margalla-enclave/gallery/islamabad-sector.jpg",
      alt: "Construction under way in a planned Islamabad sector, with the Margalla Hills behind",
      width: 1800,
      height: 1134,
      art: "plan",
      ratio: "3/2",
      caption: "An Islamabad sector under construction — contextual, not this site",
      credit: "M. Ahabb Sheraz · CC BY-SA 4.0",
    },
    {
      src: "/projects/margalla-enclave/gallery/islamabad-avenue.jpg",
      alt: "A tree-lined avenue in Islamabad",
      width: 1800,
      height: 1200,
      art: "street",
      ratio: "3/2",
      caption: "Islamabad's tree-lined avenues",
      credit: "Obaid747 · CC BY-SA 3.0",
    },
    {
      src: "/projects/margalla-enclave/gallery/margalla-forest.jpg",
      alt: "Forest and hillside in Margalla Hills National Park",
      width: 1800,
      height: 1350,
      art: "canopy",
      ratio: "4/3",
      caption: "Margalla Hills National Park",
      credit: "Hashim bajwa · CC BY-SA 4.0",
    },
    {
      src: "/projects/margalla-enclave/gallery/daman-e-koh.jpg",
      alt: "The viewing terraces at Daman-e-Koh in the Margalla Hills",
      width: 1800,
      height: 1350,
      art: "water",
      ratio: "4/3",
      caption: "Daman-e-Koh, in the hills above the city",
      credit: "Sameer Toor · CC BY-SA 3.0",
    },
    {
      src: "/projects/margalla-enclave/gallery/islamabad-sunset.jpg",
      alt: "Sunset over Islamabad",
      width: 1800,
      height: 1350,
      art: "contour",
      ratio: "4/3",
      caption: "Evening over the capital",
      credit: "S zillayali · CC BY-SA 3.0",
    },
    {
      src: "/projects/margalla-enclave/gallery/faisal-margalla.jpg",
      alt: "A lit Islamabad avenue running towards the Margalla Hills, with Faisal Mosque in the distance",
      width: 1800,
      height: 1174,
      art: "tower",
      ratio: "3/2",
      caption: "Islamabad's road network, running up to the Margallas",
      credit: "Ahmed Iftikhar Sarmad · CC BY-SA 4.0",
    },
  ],

  /* ---------------------------------------------------------------------- */
  /* Development progress                                                    */
  /* ---------------------------------------------------------------------- */

  progress: {
    intro:
      "We publish development updates only when they can be traced to the developer or to reported coverage. We do not publish completion percentages, because the developer does not publish them.",
    entries: [
      {
        date: "Current status",
        phase: "Development",
        note: "The developer's own FAQ describes Margalla Enclave as under-development. No overall completion percentage has been published by the developer, and we will not estimate one.",
        source: DEVELOPER_SOURCE,
        media: {
          alt: "Site development and road works in progress",
          art: "aerial",
          ratio: "4/3",
        },
      },
      {
        date: "Possession",
        phase: "Handover",
        note: "The developer states that possession was delivered within 11 months and marks it as a project milestone. Press reporting separately indicates possession follows a letter of intimation from CDA. Confirm the possession position for your specific block and ballot before relying on it.",
        source: DEVELOPER_SOURCE,
        media: {
          alt: "Completed street infrastructure at handover",
          art: "street",
          ratio: "4/3",
        },
      },
      {
        date: "Demand",
        phase: "Balloting",
        note: "The Express Tribune reported 1,700 applications received against 236 available plots of 500 square yards in a CDA ballot for the project.",
        source: PRESS_TRIBUNE,
        media: {
          alt: "Ballot documentation and application handling",
          art: "plan",
          ratio: "4/3",
        },
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  /* FAQs                                                                    */
  /* ---------------------------------------------------------------------- */

  faqs: [
    {
      category: "Location",
      question: "Where exactly is Margalla Enclave located?",
      answer:
        "Margalla Enclave is at the foothills of the Margalla Hills in Zone 4, Islamabad, on Jinnah Avenue — the road formerly known as Kuri Road. Press reporting places the project in Sector C-14 on Park Road.",
      source: DEVELOPER_SOURCE,
    },
    {
      category: "Developer",
      question: "Who is developing Margalla Enclave?",
      answer:
        "It is a joint venture between the Capital Development Authority (CDA) and DHA Islamabad. Islamabad Property Consultant is an independent consultancy advising buyers on the project — we are not CDA, DHA, or the developer.",
      source: DEVELOPER_SOURCE,
    },
    {
      category: "Property types",
      question: "What plot sizes are offered?",
      answer:
        "Residential plots are offered in 125, 250 and 500 square yards (5 Marla, 10 Marla and 1 Kanal). Commercial plots are offered in 100, 133.25, 200 and 500 square yards. All are allotted through ballot.",
      source: DEVELOPER_SOURCE,
    },
    {
      category: "Booking",
      question: "Who is eligible to apply?",
      answer:
        "All applicants holding a valid Computerised National Identity Card (CNIC) or a National Identity Card for Overseas Pakistanis (NICOP) are eligible to participate in the ballot.",
      source: DEVELOPER_SOURCE,
    },
    {
      category: "Booking",
      question: "How are payments made?",
      answer:
        "The developer accepts pay order or demand draft made in favour of \"Margalla Enclave\" (NTN # F907422-6), online payment through KUICKPAY, and over-the-counter payment at any Askari Bank branch using a challan generated from the DHA website. Processing fees are non-refundable and non-adjustable.",
      source: DEVELOPER_SOURCE,
    },
    {
      category: "Payment plan",
      question: "Can I pay in instalments?",
      answer:
        "Yes. The developer publishes plans running from a single lump-sum payment up to a three-year plan. The one-year plan is four quarterly instalments, the two-year plan is eight, and the three-year plan is twelve. Instalment plans require a 20% down payment within 30 days of the ballot.",
      source: DEVELOPER_SOURCE,
    },
    {
      category: "Payment plan",
      question: "Is there a rebate for paying in full?",
      answer:
        "The developer states that the rebate is already incorporated into the lump-sum price, so no additional rebate is applied on top of it.",
      source: DEVELOPER_SOURCE,
    },
    {
      category: "Payment plan",
      question: "Can I change my payment plan later?",
      answer:
        "No. The developer states that a payment plan cannot be changed once it has been selected. Late payment of an instalment attracts a surcharge, so choose a tenure you are confident of servicing.",
      source: DEVELOPER_SOURCE,
    },
    {
      category: "Payment plan",
      question: "Do the published prices include taxes and charges?",
      answer:
        "No. The developer's schedule states that prices are exclusive of applicable DHA charges and government taxes. Budget for these separately, and ask us for the current figures before you commit.",
      source: DEVELOPER_SOURCE,
    },
    {
      category: "Development",
      question: "Is the project developed or under development?",
      answer:
        "The developer describes Margalla Enclave as under-development. It also states that possession was delivered within 11 months as a project milestone. Confirm the position for your specific block before relying on it.",
      source: DEVELOPER_SOURCE,
    },
    {
      category: "Amenities",
      question: "What amenities are planned?",
      answer:
        "The developer lists the Lake District and sports facilities, Bazar-e-Bozorg and other shopping malls, a botanical garden and parks, education facilities, hospitals, an extensive road network and drainage system, and 24/7 security and surveillance.",
      source: DEVELOPER_SOURCE,
    },
    {
      category: "Site visit",
      question: "Can Islamabad Property Consultant arrange a site visit?",
      answer:
        "Yes. Request a guided visit through the site-visit form on this page or message us on WhatsApp, and we will confirm a date, meeting point and what to bring.",
    },
    {
      category: "Overseas buyers",
      question: "Can overseas Pakistanis apply?",
      answer:
        "The developer's eligibility criteria include holders of a valid NICOP. We can walk overseas buyers through the application, payment routes and documentation over WhatsApp across time zones.",
      source: DEVELOPER_SOURCE,
    },
    {
      category: "Documentation",
      question: "What should I verify before paying anything?",
      answer:
        "Verify the current payment schedule for your ballot, the plot's block and dimensions, the allotment and transfer documentation, outstanding DHA charges and taxes, and the possession position. We will go through each of these with you, and we will tell you when something cannot be confirmed.",
    },
    {
      category: "Contact",
      question: "How do I reach Islamabad Property Consultant?",
      answer:
        "WhatsApp is fastest — use any WhatsApp button on this page and your message arrives pre-filled with the details you have selected. You can also call us on the number in the header.",
    },
  ],

  /* ---------------------------------------------------------------------- */
  /* SEO                                                                     */
  /* ---------------------------------------------------------------------- */

  seo: {
    title: "Margalla Enclave Islamabad — Plots, Payment Plan & Location",
    description:
      "Margalla Enclave Islamabad: a CDA and DHA Islamabad joint venture in Zone 4 on Jinnah Avenue. Verified plot sizes, the developer's published payment plan, location and amenities — with independent guidance from Islamabad Property Consultant.",
    keywords: [
      "Margalla Enclave Islamabad",
      "Margalla Enclave plots",
      "Margalla Enclave payment plan",
      "Margalla Enclave location",
      "CDA DHA joint venture Islamabad",
      "property consultant Islamabad",
    ],
    ogImageAlt:
      "Margalla Enclave Islamabad — Zone 4, a CDA and DHA Islamabad joint venture",
  },

  officialSource: DEVELOPER_SOURCE,
};
