import Link from "next/link";
import { siteNav } from "@/lib/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container, Section } from "@/components/ui/Section";
import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { buttonClass } from "@/components/ui/button-styles";
import { ProjectArt } from "@/components/media/ProjectArt";

export default function NotFound() {
  return (
    <>
      <Header nav={siteNav} overHero />

      <main
        id="main"
        className="relative isolate flex min-h-[90svh] items-center overflow-hidden bg-ink-950 text-paper-50"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <ProjectArt variant="contour" seed="404" tone="dark" className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-ink-950/70" />
          <div className="grain absolute inset-0" />
        </div>

        <Section flush tone="ink" className="w-full bg-transparent py-24">
          <Container width="editorial">
            <p className="eyebrow text-brass-300">404</p>
            <h1 className="optical-left mt-6 text-h1 text-paper-50">
              This page is off the plan
            </h1>
            <p className="mt-6 max-w-[48ch] text-body-lg text-paper-100/75">
              The page you were looking for does not exist, or it has moved. The
              projects we currently advise on are all listed below.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/projects" className={buttonClass("outlineInverse", "lg")}>
                View all projects
              </Link>
              <WhatsAppLink ctaLocation="footer" size="lg">
                Ask us what you were looking for
              </WhatsAppLink>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
