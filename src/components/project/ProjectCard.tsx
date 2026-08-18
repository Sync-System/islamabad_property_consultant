import Link from "next/link";
import type { Project } from "@/lib/projects/types";
import { isVerified } from "@/lib/projects/types";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/Icon";

/**
 * Project card for the home page and the directory.
 *
 * The whole card is a single link — a card with a link inside it plus separate
 * hover targets produces duplicate announcements for screen-reader users and an
 * ambiguous click target for everyone else.
 */

export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <Reveal as="li" delay={index * 90} className="group">
      <Link
        href={`/projects/${project.slug}`}
        className="flex h-full flex-col border border-line bg-surface transition-colors duration-500 hover:border-line-strong"
      >
        <div className="relative overflow-hidden">
          <ProjectMedia
            media={project.hero.media}
            ratio="4/3"
            seed={`card-${project.slug}`}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
            className="w-full transition-transform duration-[1000ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.05]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink-950/65 to-transparent"
          />
          <p className="absolute left-5 top-5 border border-paper-50/35 bg-ink-950/45 px-2.5 py-1 text-[0.625rem] font-semibold tracking-[0.12em] text-paper-50 uppercase backdrop-blur-sm">
            {isVerified(project.status) ? project.status.value : "Status to confirm"}
          </p>
        </div>

        <div className="flex flex-1 flex-col p-7">
          <p className="eyebrow text-accent">{project.locationLabel}</p>
          <h3 className="mt-4 font-display text-h3 leading-tight text-content">
            {project.name}
          </h3>
          <p className="mt-4 flex-1 text-body-sm text-content-muted">{project.summary}</p>

          <ul className="mt-6 flex flex-wrap gap-1.5">
            {project.projectType.map((type) => (
              <li
                key={type}
                className="border border-line px-2.5 py-1 text-[0.6875rem] text-content-muted"
              >
                {type}
              </li>
            ))}
          </ul>

          <span className="mt-7 inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-content">
            View project
            <ArrowIcon
              size={17}
              className="transition-transform duration-400 ease-[var(--ease-out-quint)] group-hover:translate-x-1"
            />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
