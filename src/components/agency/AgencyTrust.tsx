import { agencyConfig, isPlaceholder, resolved } from "@/lib/config/agency";
import type { Project } from "@/lib/projects/types";
import { Container, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LeadForm } from "@/components/forms/LeadForm";
import { WhatsAppLink, PhoneLink } from "@/components/conversion/WhatsAppLink";
import { telUrl } from "@/lib/whatsapp";
import { PinIcon } from "@/components/ui/Icon";

/**
 * Who you are actually speaking to.
 *
 * Every credential here is either verifiable or absent. There are no years of
 * experience, no transaction counts, no awards and no testimonials, because
 * none of those have been supplied — and inventing them is precisely what makes
 * property websites untrustworthy. Placeholder fields render as an honest
 * "to be confirmed" rather than as a fabricated number.
 */

const COMMITMENTS = [
  {
    title: "We cite our sources",
    body: "Every price, size and drive time on this site names where it came from and when we last checked it.",
  },
  {
    title: "We say when we don't know",
    body: "Availability changes daily and we are not the developer. Where we cannot confirm something, we tell you instead of guessing.",
  },
  {
    title: "No guaranteed returns",
    body: "We will discuss what makes a location strategically interesting. We will never promise appreciation, because nobody honestly can.",
  },
  {
    title: "Independent of the developer",
    body: "We advise buyers. We are not CDA, DHA, or the developer of any project we market, and we say so on every page.",
  },
];

export function AgencyTrust({
  project,
  otherProjects = [],
}: {
  project?: Project;
  /** Also offered in the enquiry form's project select. */
  otherProjects?: { slug: string; name: string }[];
}) {
  const office = resolved(agencyConfig.officeAddress);
  const email = resolved(agencyConfig.email);
  const mapUrl = resolved(agencyConfig.googleMapUrl);
  const consultant = resolved(agencyConfig.consultantName);

  return (
    <Section id="about" tone="paper-alt" aria-labelledby="agency-title">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* --- Agency ------------------------------------------------- */}
          <div className="lg:col-span-6">
            <Reveal>
              <p className="flex items-center gap-3.5">
                <span className="h-px w-8 bg-accent/45" aria-hidden="true" />
                <span className="eyebrow text-accent">The consultancy</span>
              </p>
              <h2 id="agency-title" className="optical-left mt-5 text-h2 text-content">
                {agencyConfig.name}
              </h2>
              <p className="mt-6 max-w-[46ch] text-lead text-content-muted">
                {agencyConfig.positioning}
              </p>
            </Reveal>

            <Reveal delay={100}>
              <p className="mt-6 max-w-[58ch] text-body text-content-muted">
                {agencyConfig.description} We work with buyers who want the
                verified position on a project — what is built, what is planned,
                what is payable and what still needs checking — before they commit
                money to it.
              </p>
            </Reveal>

            {/* Consultant card */}
            <Reveal delay={160}>
              <div className="mt-10 flex items-center gap-5 border border-line bg-surface p-5">
                <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden border border-line bg-surface-alt sm:size-24">
                  {resolved(agencyConfig.consultantPhoto) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={agencyConfig.consultantPhoto}
                      alt={consultant ?? "Consultant"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    // Landscape artwork is illegible at 80px; a monogram reads
                    // as a deliberate placeholder rather than a broken image.
                    <span
                      aria-hidden="true"
                      className="font-display text-h3 leading-none text-content-subtle"
                    >
                      IPC
                    </span>
                  )}
                </div>
                <div>
                  <p className="eyebrow text-content-subtle">{agencyConfig.consultantRole}</p>
                  <p className="mt-2 font-display text-h4 text-content">
                    {consultant ?? "Consultant name to be confirmed"}
                  </p>
                  <p className="mt-1.5 text-micro text-content-subtle">
                    {consultant
                      ? `Speak to ${consultant} directly on WhatsApp.`
                      : "Photograph and profile pending — we will not publish a stock portrait in the meantime."}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Commitments */}
            <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {COMMITMENTS.map((item, index) => (
                <Reveal as="li" key={item.title} delay={index * 80}>
                  <h3 className="border-t border-line pt-4 font-sans text-body-sm font-semibold text-content">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-body-sm text-content-muted">{item.body}</p>
                </Reveal>
              ))}
            </ul>

            {/* Contact */}
            <Reveal delay={200}>
              <dl className="mt-10 grid gap-5 border-t border-line pt-8 sm:grid-cols-2">
                <div>
                  <dt className="eyebrow text-content-subtle">WhatsApp</dt>
                  <dd className="mt-2">
                    <WhatsAppLink
                      ctaLocation="agency"
                      projectName={project?.name}
                      projectSlug={project?.slug}
                      bare
                      hideIcon
                      className="text-body font-medium text-content underline decoration-accent/60 underline-offset-4 hover:decoration-accent"
                    >
                      {agencyConfig.whatsappDisplay}
                    </WhatsAppLink>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-content-subtle">Phone</dt>
                  <dd className="mt-2">
                    <PhoneLink
                      href={telUrl}
                      ctaLocation="agency"
                      bare
                      className="text-body font-medium text-content underline decoration-accent/60 underline-offset-4 hover:decoration-accent"
                    >
                      {agencyConfig.phoneDisplay}
                    </PhoneLink>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-content-subtle">Email</dt>
                  <dd className="mt-2 text-body text-content-muted">
                    {email ? (
                      <a
                        href={`mailto:${email}`}
                        className="font-medium text-content underline decoration-accent/60 underline-offset-4"
                      >
                        {email}
                      </a>
                    ) : (
                      <span className="text-content-subtle">To be confirmed</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-content-subtle">Office</dt>
                  <dd className="mt-2 flex items-start gap-2 text-body-sm text-content-muted">
                    <PinIcon size={17} className="mt-0.5 shrink-0 text-content-subtle" />
                    {office ? (
                      mapUrl ? (
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-accent/60 underline-offset-4"
                        >
                          {office}
                        </a>
                      ) : (
                        <span>{office}</span>
                      )
                    ) : (
                      <span className="text-content-subtle">
                        Office address to be confirmed
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </Reveal>

            {isPlaceholder(agencyConfig.yearsOfExperience) && (
              <Reveal delay={240}>
                <p className="mt-6 max-w-[58ch] text-micro leading-relaxed text-content-subtle">
                  Note for the site owner: office address, email, social profiles,
                  consultant name and photograph are still placeholders in
                  <code className="mx-1 bg-content/8 px-1 py-0.5">
                    src/lib/config/agency.ts
                  </code>
                  . They render as &ldquo;to be confirmed&rdquo; rather than as
                  invented details.
                </p>
              </Reveal>
            )}
          </div>

          {/* --- Lead form --------------------------------------------- */}
          <Reveal delay={140} className="lg:col-span-6" id="contact">
            <div className="border border-line bg-surface p-6 sm:p-9 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <h3 className="font-display text-h3 text-content">
                Ask a consultant
              </h3>
              <p className="mt-3 max-w-[42ch] text-body-sm text-content-muted">
                Tell us what you are looking for and we will come back with the
                verified position — not a brochure.
              </p>
              <div className="mt-8">
                <LeadForm project={project} projects={otherProjects} ctaLocation="lead-form" />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
