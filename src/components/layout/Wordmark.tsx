import { agencyConfig, resolved } from "@/lib/config/agency";
import Image from "next/image";
import { LogoMark } from "./LogoMark";

/**
 * Agency wordmark.
 *
 * Renders the real logo mark next to the agency name. If `agencyConfig.logo`
 * is ever set to a raster/vendor file instead, that takes priority — this
 * component only falls back to the drawn `LogoMark` when it is not.
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

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <span className="shrink-0">
        <LogoMark className="size-9 lg:size-10" />
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
