import { agencyConfig, resolved } from "@/lib/config/agency";
import Image from "next/image";

/**
 * Agency wordmark.
 *
 * `agencyConfig.logo` is still `[AGENCY_LOGO]`, so rather than reserving an
 * empty box we ship a typographic mark that can stand in indefinitely: a ridge
 * glyph drawn from the Margalla silhouette, set against the agency name. Once a
 * real logo file lands in the config, this component renders that instead
 * without any other change.
 */

interface WordmarkProps {
  tone?: "dark" | "light";
  /** Hides the wordmark text, leaving only the glyph. */
  compact?: boolean;
  className?: string;
}

export function Wordmark({
  tone = "dark",
  compact = false,
  className = "",
}: WordmarkProps) {
  const logo = resolved(agencyConfig.logo);

  if (logo) {
    return (
      <Image
        src={logo}
        alt={agencyConfig.name}
        width={168}
        height={44}
        priority
        className={`h-9 w-auto lg:h-11 ${className}`}
      />
    );
  }

  const ink = tone === "dark" ? "text-ink-900" : "text-paper-50";
  const muted = tone === "dark" ? "text-ink-500" : "text-paper-100/65";
  const rule = tone === "dark" ? "border-ink-900/25" : "border-paper-50/30";

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <span
        className={`grid size-9 shrink-0 place-items-center border ${rule} lg:size-10`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none">
          <path
            d="M2 17.5 7.2 10l3.4 4.6L15.6 6l6.4 11.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ink}
          />
          <path
            d="M2 20.6h20"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            className="text-brass-500"
          />
        </svg>
      </span>

      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-display text-[1.0625rem] tracking-[-0.01em] ${ink} lg:text-[1.1875rem]`}
          >
            Islamabad
          </span>
          <span className={`eyebrow mt-1 text-[0.5625rem] ${muted} lg:text-[0.625rem]`}>
            Property Consultant
          </span>
        </span>
      )}
      <span className="sr-only">{agencyConfig.name}</span>
    </span>
  );
}
