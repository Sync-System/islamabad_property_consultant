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
  /**
   * `dark` pins the credit to a light colour for use over always-dark media —
   * the lightbox backdrop, a photograph under a dark gradient. Everywhere else
   * the default follows the theme.
   */
  tone?: "light" | "dark";
  className?: string;
}) {
  if (!media.credit) return null;
  return (
    <span
      className={`block text-[0.6875rem] leading-relaxed ${
        tone === "dark" ? "text-paper-100/45" : "text-content-subtle"
      } ${className}`}
    >
      Photo: {media.credit}
    </span>
  );
}
