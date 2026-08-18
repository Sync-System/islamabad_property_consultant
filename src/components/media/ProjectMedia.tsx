import Image from "next/image";
import type { Media } from "@/lib/projects/types";
import { ProjectArt } from "./ProjectArt";

/**
 * The only way media is rendered on this site.
 *
 * When `media.src` is set it renders an optimised <Image>; otherwise it falls
 * back to original generated artwork. Callers never branch on which — they just
 * pass a `Media` object and a sizing hint.
 *
 * `ratio` is always applied to the wrapper, so the box occupies its final
 * dimensions before anything loads. That is what keeps CLS at zero.
 */

interface ProjectMediaProps {
  media: Media;
  /** Tailwind classes for the wrapper. Sizing lives here. */
  className?: string;
  /**
   * Responsive `sizes` hint. Required for anything full-width.
   *
   * Note for full-bleed art: with `object-fit: cover`, a landscape photograph
   * in a portrait box is scaled to match the box *height*, so the source width
   * the browser needs is far larger than the viewport width. Heroes therefore
   * pass a `sizes` well above 100vw on narrow screens.
   */
  sizes?: string;
  /** LCP candidate — set on the hero image only. */
  priority?: boolean;
  tone?: "light" | "dark";
  seed?: string | number;
  /** Overrides `media.ratio`. */
  ratio?: string;
  /** Renders the image at its natural aspect ratio instead of filling. */
  fill?: boolean;
}

export function ProjectMedia({
  media,
  className = "",
  sizes = "100vw",
  priority = false,
  tone = "dark",
  seed = 0,
  ratio,
  fill = true,
}: ProjectMediaProps) {
  const aspect = ratio ?? media.ratio;

  return (
    <div
      className={`relative overflow-hidden bg-ink-900 ${className}`}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      {media.src ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill={fill}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover"
        />
      ) : (
        <ProjectArt
          variant={media.art ?? "contour"}
          seed={seed}
          tone={tone}
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
}

/** True when this slot is still showing generated artwork rather than a photo. */
export function isIllustrative(media: Media): boolean {
  return !media.src;
}
