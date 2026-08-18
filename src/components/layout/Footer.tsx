import Link from "next/link";
import { activeSocialLinks, agencyConfig, resolved } from "@/lib/config/agency";
import { allProjects } from "@/lib/projects";
import { telUrl } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Section";
import { WhatsAppLink, PhoneLink } from "@/components/conversion/WhatsAppLink";
import { SocialGlyph } from "@/components/ui/Icon";
import { Wordmark } from "./Wordmark";

/**
 * Footer.
 *
 * Also carries the standing legal position: what this agency is, what it is
 * not, and the caveat that applies to every figure on the site. That belongs
 * where it is always reachable rather than buried on a separate page.
 */

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Use", href: "/legal/terms" },
  { label: "Disclaimer", href: "/legal/disclaimer" },
];

export function Footer() {
  const email = resolved(agencyConfig.email);
  const office = resolved(agencyConfig.officeAddress);
  const mapUrl = resolved(agencyConfig.googleMapUrl);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-feature pb-24 pt-section-sm text-content-muted md:pb-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* --- Identity ------------------------------------------------ */}
          <div className="lg:col-span-5">
            <Wordmark />
            <p className="mt-6 max-w-[40ch] text-body-sm text-content-muted">
              {agencyConfig.positioning}
            </p>
            <WhatsAppLink ctaLocation="footer" size="md" className="mt-7">
              Message us on WhatsApp
            </WhatsAppLink>

            {activeSocialLinks.length > 0 ? (
              <ul className="mt-8 flex gap-2.5">
                {activeSocialLinks.map((social) => (
                  <li key={social.network}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${agencyConfig.name} on ${social.label}`}
                      className="grid size-10 place-items-center border border-line text-content-muted transition-colors hover:border-line-strong hover:text-content"
                    >
                      <SocialGlyph network={social.network} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-8 text-micro text-content-subtle">
                Social profiles to be confirmed.
              </p>
            )}
          </div>

          {/* --- Navigation ---------------------------------------------- */}
          <nav aria-label="Footer" className="lg:col-span-3">
            <h2 className="eyebrow text-accent">Projects</h2>
            <ul className="mt-5 space-y-3">
              {allProjects.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-body-sm text-content-muted transition-colors hover:text-content"
                  >
                    {project.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/projects"
                  className="text-body-sm text-content-muted transition-colors hover:text-content"
                >
                  All projects
                </Link>
              </li>
            </ul>

            <h2 className="eyebrow mt-9 text-accent">Company</h2>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/#about"
                  className="text-body-sm text-content-muted transition-colors hover:text-content"
                >
                  About the consultancy
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-body-sm text-content-muted transition-colors hover:text-content"
                >
                  Contact
                </Link>
              </li>
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-content-muted transition-colors hover:text-content"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* --- Contact -------------------------------------------------- */}
          <div className="lg:col-span-4">
            <h2 className="eyebrow text-accent">Contact</h2>
            <dl className="mt-5 space-y-4 text-body-sm">
              <div>
                <dt className="text-content-subtle">WhatsApp</dt>
                <dd className="mt-1">
                  <WhatsAppLink
                    ctaLocation="footer"
                    bare
                    hideIcon
                    className="text-content underline decoration-line-strong underline-offset-4 hover:decoration-accent"
                  >
                    {agencyConfig.whatsappDisplay}
                  </WhatsAppLink>
                </dd>
              </div>
              <div>
                <dt className="text-content-subtle">Phone</dt>
                <dd className="mt-1">
                  <PhoneLink
                    href={telUrl}
                    ctaLocation="footer"
                    bare
                    className="text-content underline decoration-line-strong underline-offset-4 hover:decoration-accent"
                  >
                    {agencyConfig.phoneDisplay}
                  </PhoneLink>
                </dd>
              </div>
              <div>
                <dt className="text-content-subtle">Email</dt>
                <dd className="mt-1 text-content-muted">
                  {email ? (
                    <a href={`mailto:${email}`} className="text-content underline decoration-paper-50/30 underline-offset-4">
                      {email}
                    </a>
                  ) : (
                    "To be confirmed"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-content-subtle">Office</dt>
                <dd className="mt-1 text-content-muted">
                  {office ? (
                    mapUrl ? (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-content underline decoration-paper-50/30 underline-offset-4"
                      >
                        {office}
                      </a>
                    ) : (
                      office
                    )
                  ) : (
                    "To be confirmed"
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* --- Legal ---------------------------------------------------- */}
        <div className="mt-14 border-t border-line pt-8">
          <p className="max-w-[92ch] text-micro leading-relaxed text-content-subtle">
            {agencyConfig.independenceNotice}
          </p>
          <p className="mt-3 max-w-[92ch] text-micro leading-relaxed text-content-subtle">
            {agencyConfig.projectDataDisclaimer}
          </p>
          <p className="mt-6 text-micro text-content-subtle">
            © {year} {agencyConfig.legalName}. All rights reserved. Project names
            and trademarks referenced on this site belong to their respective
            owners.
          </p>
        </div>
      </Container>
    </footer>
  );
}
