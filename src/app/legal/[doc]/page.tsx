import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { agencyConfig, resolved } from "@/lib/config/agency";
import { siteNav, absoluteUrl } from "@/lib/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container, Section } from "@/components/ui/Section";
import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";

/**
 * Legal pages.
 *
 * Deliberately plain and specific rather than boilerplate. The disclaimer in
 * particular is the document that matters most for a marketing agency: it
 * states what this firm is, what it is not, and that project figures come from
 * the developer.
 *
 * These are drafted as a working starting point. Have them reviewed by a
 * qualified lawyer before relying on them.
 */

interface LegalDoc {
  title: string;
  description: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}

const DOCS: Record<string, LegalDoc> = {
  disclaimer: {
    title: "Disclaimer",
    description:
      "How to read the project information published by Islamabad Property Consultant, and the limits of our role.",
    updated: "16 August 2026",
    sections: [
      {
        heading: "Our role",
        body: [
          `${agencyConfig.name} is an independent property consultancy and marketing firm operating in Islamabad, Pakistan. We advise buyers and investors on third-party real-estate projects.`,
          "We are not the Capital Development Authority (CDA), we are not the Defence Housing Authority (DHA), and we are not the developer of Margalla Enclave or of any other project referenced on this website. We do not hold ourselves out as an official or authorised sales channel for any developer unless that authorisation has been granted to us in writing and is stated explicitly on the relevant page.",
          "Project names, logos and trademarks referenced on this website remain the property of their respective owners. They are used to identify the projects we advise on, and their use does not imply endorsement, affiliation or agency.",
        ],
      },
      {
        heading: "Project information",
        body: [
          "Project details on this website — including plot sizes, prices, processing fees, payment schedules, amenities, development status, drive times and possession positions — are compiled from material published by the relevant developer, and from mainstream press reporting where cited.",
          "Each figure is attributed to its source and dated on the page where it appears. We publish only what we can attribute. Where a fact could not be verified, the page says so rather than presenting an estimate as a fact.",
          "Developers revise prices, schedules, plans and availability between phases and ballots, sometimes without notice. Information on this website may therefore be out of date at the moment you read it.",
        ],
      },
      {
        heading: "Not financial advice",
        body: [
          "Nothing on this website is investment, financial, legal or tax advice, and nothing on it should be read as a forecast or guarantee of capital appreciation, rental yield or resale value. Real-estate values can fall as well as rise.",
          "We do not promise guaranteed returns, guaranteed appreciation or risk-free investment, and you should treat any party who does with caution.",
        ],
      },
      {
        heading: "Verify before you commit",
        body: [
          "Before making any payment or entering any agreement, verify the current position directly with the developer and with your own legal adviser. That includes: the current payment schedule for your ballot or booking; the plot's block, number and dimensions; the allotment and transfer documentation; all charges and taxes payable in addition to the sale price; the development and possession position; and all applicable approvals.",
          "We will assist you with each of these, and we will tell you where something cannot be confirmed.",
        ],
      },
      {
        heading: "Photography and graphics",
        body: [
          "Photographs on this website are of Islamabad and the Margalla Hills generally. They are published under Creative Commons licences, are credited to their photographers where they appear, and are used to show the city and the setting the project sits in. They are not photographs of the Margalla Enclave site, and nothing on this website should be read as suggesting that they are.",
          "Other visuals are original diagrams prepared by us to illustrate site structure, topography and planning concepts. They are marked as illustrative where they appear, and they are not the developer's official master plan or renderings.",
          "We will publish photography of the site itself once we hold the rights to do so.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "What Islamabad Property Consultant collects when you contact us, why, and how long we keep it.",
    updated: "16 August 2026",
    sections: [
      {
        heading: "What we collect",
        body: [
          "When you submit an enquiry or site-visit request, we collect the details you provide: your name, phone number, the project and property you are interested in, your budget range and preferred contact method if you choose to share them, and any message you write.",
          "We also record basic marketing attribution — which page you arrived on, the referring site, and any campaign parameters in the link you followed — so we know which of our campaigns reached you. This is stored for the duration of your browsing session only and is not used to build a profile of you.",
          "We do not ask for, and you should never send us, your CNIC number, passport details, bank account details, card details or passwords through this website.",
        ],
      },
      {
        heading: "Why we use it",
        body: [
          "We use your details solely to respond to your enquiry, arrange a site visit, and follow up on the project you asked about. We do not sell your details, and we do not share them with third parties for their own marketing.",
          "When you submit a form, the details are also composed into a WhatsApp message that opens on your device. You can read and edit that message before you send it — nothing reaches us through WhatsApp until you press send.",
        ],
      },
      {
        heading: "WhatsApp and third parties",
        body: [
          "Conversations you have with us on WhatsApp are subject to WhatsApp's own privacy terms as well as ours.",
          "If analytics or advertising measurement tools are active on this website, they may set cookies or similar identifiers. Where they are, they are named in this policy before they are enabled.",
        ],
      },
      {
        heading: "Retention and your choices",
        body: [
          "We keep enquiry records only for as long as we are actively assisting you, and for a reasonable period afterwards for our own records.",
          "You can ask us at any time to tell you what we hold about you, to correct it, or to delete it. Message us on WhatsApp or write to us using the contact details on this site and we will action it.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Use",
    description:
      "The terms on which Islamabad Property Consultant makes this website available.",
    updated: "16 August 2026",
    sections: [
      {
        heading: "Use of this website",
        body: [
          "This website is provided for general information about the projects we advise on. By using it you accept these terms and the Disclaimer.",
          "You may read, print and share pages from this website for your own non-commercial use. You may not republish our content, copy our page structure or reproduce our graphics for commercial purposes without our written permission.",
        ],
      },
      {
        heading: "No offer or contract",
        body: [
          "Nothing on this website constitutes an offer, an allotment, a reservation, or a binding contract of any kind. Bookings, allotments and transfers are made only through the relevant developer's own process and documentation.",
          "Submitting a form on this website starts a conversation. It does not reserve a plot, confirm a price, or book a site visit on its own — a consultant confirms a visit with you directly.",
        ],
      },
      {
        heading: "Limitation of liability",
        body: [
          "We take care to source and attribute the information we publish, but we do not warrant that it is complete, current or error-free, and we are not liable for decisions taken in reliance on it without independent verification.",
          "This website may link to third-party sites, including developers' own websites. We are not responsible for their content or their practices.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of the Islamic Republic of Pakistan, and the courts of Islamabad have jurisdiction over any dispute arising from them.",
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export const dynamicParams = false;

export async function generateMetadata(
  props: PageProps<"/legal/[doc]">,
): Promise<Metadata> {
  const { doc } = await props.params;
  const entry = DOCS[doc];
  if (!entry) return { title: "Not found" };

  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: `/legal/${doc}` },
    openGraph: {
      url: absoluteUrl(`/legal/${doc}`),
      title: `${entry.title} | ${agencyConfig.name}`,
      description: entry.description,
    },
  };
}

export default async function LegalPage(props: PageProps<"/legal/[doc]">) {
  const { doc } = await props.params;
  const entry = DOCS[doc];
  if (!entry) notFound();

  const email = resolved(agencyConfig.email);

  return (
    <>
      <Header nav={siteNav} />

      <main id="main">
        <Section tone="paper" className="pt-[calc(var(--header-h)+3.5rem)]">
          <Container width="content">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-micro text-ink-500">
                <li>
                  <Link href="/" className="hover:text-ink-900">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-ink-900">
                  {entry.title}
                </li>
              </ol>
            </nav>

            <h1 className="optical-left mt-8 text-h2 text-ink-900">{entry.title}</h1>
            <p className="mt-5 text-body-lg text-ink-600">{entry.description}</p>
            <p className="mt-4 text-micro text-ink-500">
              Last updated {entry.updated}
            </p>

            <div className="mt-14 space-y-12">
              {entry.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-h4 text-ink-900">{section.heading}</h2>
                  <div className="mt-4 space-y-4">
                    {section.body.map((paragraph, index) => (
                      <p key={index} className="text-body text-ink-600">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-14 border-t border-ink-900/12 pt-8">
              <h2 className="text-h4 text-ink-900">Questions about this page?</h2>
              <p className="mt-3 text-body-sm text-ink-600">
                Message us on WhatsApp
                {email ? (
                  <>
                    {" "}
                    or email{" "}
                    <a
                      href={`mailto:${email}`}
                      className="underline decoration-brass-500/60 underline-offset-4"
                    >
                      {email}
                    </a>
                  </>
                ) : null}
                .
              </p>
              <WhatsAppLink ctaLocation="footer" variant="outline" size="md" className="mt-6">
                Message {agencyConfig.whatsappDisplay}
              </WhatsAppLink>
              <p className="mt-8 text-micro leading-relaxed text-ink-500">
                These documents are a working draft prepared for this website and
                are not a substitute for legal advice. Have them reviewed by a
                qualified lawyer before you rely on them.
              </p>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
