import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * Section shell and header.
 *
 * Rhythm is a design decision, not a per-section improvisation: sections share
 * one vertical scale and one container set, so the page has a measurable pulse
 * rather than arbitrary gaps.
 */

/**
 * Section tones are semantic, not literal colours. `ink` and `pine` were
 * hard-coded dark bands; they now both resolve to the theme's most-contrasted
 * surface, which is light in the light theme and dark in the dark one. The
 * names are kept so every call site does not have to change at once.
 */
type Tone = "paper" | "paper-alt" | "ink" | "pine";

const TONES: Record<Tone, string> = {
  paper: "bg-surface text-content",
  "paper-alt": "bg-surface-alt text-content",
  ink: "bg-surface-feature text-content",
  pine: "bg-surface-feature text-content",
};

type Width = "content" | "editorial" | "wide" | "full";

const WIDTHS: Record<Width, string> = {
  content: "max-w-content",
  editorial: "max-w-editorial",
  wide: "max-w-wide",
  full: "max-w-none",
};

interface SectionProps {
  id?: string;
  children: ReactNode;
  tone?: Tone;
  className?: string;
  /** Removes the default vertical padding for full-bleed compositions. */
  flush?: boolean;
  compact?: boolean;
  "aria-labelledby"?: string;
  as?: "section" | "div" | "article";
}

export function Section({
  id,
  children,
  tone = "paper",
  className = "",
  flush = false,
  compact = false,
  as: Tag = "section",
  ...rest
}: SectionProps) {
  const padding = flush ? "" : compact ? "py-section-sm" : "py-section";
  return (
    <Tag
      id={id}
      className={`relative ${TONES[tone]} ${padding} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

interface ContainerProps {
  children: ReactNode;
  width?: Width;
  className?: string;
}

export function Container({
  children,
  width = "wide",
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${WIDTHS[width]} px-gutter sm:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Pushes the intro into a second column on wide screens. */
  split?: boolean;
  align?: "left" | "center";
  className?: string;
  /** Heading level. Sections are h2 by default. */
  as?: "h2" | "h3";
  id?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  split = false,
  align = "left",
  className = "",
  as: Heading = "h2",
  id,
}: SectionHeaderProps) {
  // No tone branch: surfaces follow the theme, so one set of tokens is correct
  // on every section.
  const muted = "text-content-muted";
  const rule = "bg-accent/45";
  const eyebrowColor = "text-accent";

  const heading = (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <div
          className={`flex items-center gap-3.5 ${align === "center" ? "justify-center" : ""}`}
        >
          <span className={`h-px w-8 ${rule}`} aria-hidden="true" />
          <span className={`eyebrow ${eyebrowColor}`}>{eyebrow}</span>
        </div>
      )}
      <Heading
        id={id}
        className={`mt-5 text-h2 ${align === "center" ? "" : "optical-left"}`}
      >
        {title}
      </Heading>
    </div>
  );

  const body = intro ? (
    <p
      className={`text-body-lg ${muted} ${
        align === "center" ? "mx-auto text-center" : ""
      } ${split ? "" : "mt-6 max-w-[54ch]"}`}
    >
      {intro}
    </p>
  ) : null;

  if (split && intro) {
    return (
      <Reveal
        className={`grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16 ${className}`}
      >
        <div className="lg:col-span-7">{heading}</div>
        <div className="lg:col-span-5 lg:pb-2">{body}</div>
      </Reveal>
    );
  }

  return (
    <Reveal className={className}>
      {heading}
      {body}
    </Reveal>
  );
}

/** A thin brass rule used to separate editorial blocks. */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-px w-full bg-current opacity-[0.12] ${className}`}
    />
  );
}
