import type { Stat } from "@/lib/projects/types";
import { Container, Section } from "@/components/ui/Section";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Trust strip.
 *
 * Four verified facts, each with its footnote visible rather than tucked into a
 * tooltip. Nothing here is a vanity metric: no "happy clients", no "years of
 * trust", no invented totals. If a figure could not be sourced, it is not in
 * the data file, so it cannot appear here.
 */

export function ProjectStats({ stats }: { stats: Stat[] }) {
  return (
    <Section tone="ink" compact className="border-b border-line">
      <Container>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-10">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 90}
              className="relative lg:pl-7 lg:first:pl-0"
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -left-3 top-1 hidden h-[calc(100%-0.25rem)] w-px bg-line lg:block"
                />
              )}
              <dt className="eyebrow text-accent">{stat.label}</dt>
              <dd className="mt-3 font-display text-h3 leading-none text-content">
                <Counter value={stat.value} />
              </dd>
              {stat.footnote && (
                <dd className="mt-3 text-micro leading-relaxed text-content-subtle">
                  {stat.footnote}
                </dd>
              )}
            </Reveal>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
