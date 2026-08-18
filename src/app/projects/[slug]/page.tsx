import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allProjects, getProject, getProjectSlugs } from "@/lib/projects";
import { absoluteUrl } from "@/lib/config/site";
import { projectNav } from "@/lib/config/site";
import {
  breadcrumbSchema,
  faqSchema,
  jsonLd,
  projectSchema,
} from "@/lib/structured-data";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { FloatingWhatsApp } from "@/components/conversion/FloatingWhatsApp";
import { MobileLeadBar } from "@/components/conversion/MobileLeadBar";
import { FinalCta } from "@/components/conversion/FinalCta";

import { ProjectHero } from "@/components/project/ProjectHero";
import { ProjectStats } from "@/components/project/ProjectStats";
import { ProjectOverview } from "@/components/project/ProjectOverview";
import { InvestmentHighlights } from "@/components/project/InvestmentHighlights";
import { PropertyOptions } from "@/components/project/PropertyOptions";
import { PaymentPlan } from "@/components/project/PaymentPlan";
import { MasterPlanViewer } from "@/components/project/MasterPlanViewer";
import { Destinations } from "@/components/project/Destinations";
import { Amenities } from "@/components/project/Amenities";
import { LocationSection } from "@/components/project/LocationSection";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { DevelopmentProgress } from "@/components/project/DevelopmentProgress";
import { SiteVisitSection } from "@/components/project/SiteVisitSection";
import { Faq } from "@/components/project/Faq";
import { AgencyTrust } from "@/components/agency/AgencyTrust";

/**
 * The reusable project page.
 *
 * Section order and inclusion come from `project.sections`, so a project with no
 * payment plan or no master plan simply renders without them — no conditional
 * spaghetti in a second template, and no forcing every scheme into the same
 * narrative.
 */

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  const url = `/projects/${project.slug}`;

  return {
    title: project.seo.title,
    description: project.seo.description,
    keywords: project.seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url: absoluteUrl(url),
      title: project.seo.title,
      description: project.seo.description,
      siteName: "Islamabad Property Consultant",
      locale: "en_PK",
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo.title,
      description: project.seo.description,
    },
  };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const { sections } = project;

  // Only advertise sections the project actually renders.
  const nav = projectNav.filter((item) => {
    switch (item.sectionId) {
      case "properties":
        return sections.propertyOptions;
      case "payment-plan":
        return sections.paymentPlan && Boolean(project.paymentPlan);
      case "master-plan":
        return sections.masterPlan && Boolean(project.masterPlan);
      case "amenities":
        return sections.amenities;
      case "gallery":
        return sections.gallery;
      case "location":
        return sections.location;
      case "faqs":
        return sections.faqs;
      case "overview":
        return sections.overview;
      default:
        return true;
    }
  });

  const otherProjects = allProjects
    .filter((p) => p.slug !== project.slug)
    .map((p) => ({ slug: p.slug, name: p.name }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            projectSchema(project),
            faqSchema(project.faqs),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
              { name: project.shortName, path: `/projects/${project.slug}` },
            ]),
          ),
        }}
      />

      <AnalyticsProvider projectSlug={project.slug} projectName={project.name} />

      <Header
        nav={nav}
        projectName={project.name}
        projectSlug={project.slug}
        overHero
      />

      <main id="main">
        <ProjectHero project={project} />

        {sections.trustBar && <ProjectStats stats={project.stats} />}
        {sections.overview && <ProjectOverview project={project} />}
        {sections.highlights && <InvestmentHighlights project={project} />}
        {sections.propertyOptions && <PropertyOptions project={project} />}
        {sections.paymentPlan && project.paymentPlan && (
          <PaymentPlan project={project} />
        )}
        {sections.masterPlan && project.masterPlan && (
          <MasterPlanViewer project={project} />
        )}
        {sections.destinations && <Destinations project={project} />}
        {sections.amenities && <Amenities project={project} />}
        {sections.gallery && <ProjectGallery project={project} />}
        {sections.location && <LocationSection project={project} />}
        {sections.progress && <DevelopmentProgress project={project} />}
        {sections.siteVisit && <SiteVisitSection project={project} />}
        {sections.faqs && <Faq project={project} />}
        {sections.leadForm && (
          <AgencyTrust project={project} otherProjects={otherProjects} />
        )}

        <FinalCta
          projectName={project.name}
          projectSlug={project.slug}
          projectShortName={project.shortName}
          media={project.closingMedia}
        />
      </main>

      <Footer />

      <FloatingWhatsApp projectName={project.name} projectSlug={project.slug} />
      <MobileLeadBar projectName={project.name} projectSlug={project.slug} />
    </>
  );
}
