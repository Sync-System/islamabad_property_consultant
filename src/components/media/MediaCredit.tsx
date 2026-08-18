import type { Media } from "@/lib/projects/types";

/**
 * Image credit line.
 *
 * The contextual photography on this site is Creative Commons licensed, which
 * permits commercial use but *requires* attribution. This renders that
 * attribution wherever a photograph appears, so the obligation is met by the
 * component rather than by remembering to do it per page.
 */
export function MediaCredit({
  media,
  tone = "light",
  className = "",
}: {
  media: Media;
  tone?: "light" | "dark";
  className?: string;
}) {
  if (!media.credit) return null;
  return (
    <span
      className={`block text-[0.6875rem] leading-relaxed ${
        tone === "dark" ? "text-paper-100/45" : "text-ink-500/85"
      } ${className}`}
    >
      Photo: {media.credit}
    </span>
  );
}
