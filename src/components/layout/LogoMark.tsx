/**
 * The agency's pictorial mark.
 *
 * Recreated as SVG from the supplied logo artwork rather than shipped as a
 * raster export: a header/favicon mark gets re-rendered at a dozen sizes
 * (16px favicon up to a 512px touch icon), and a vector stays crisp at every
 * one of them for a few hundred bytes instead of shipping several PNGs.
 *
 * Two overlapping roof forms — a tall gable behind, a house in front — each
 * split gold/ink down the centre, with a four-pane window on the front
 * facade's dark half. Colours are the site's own `brass` and `ink` tokens
 * rather than hard-coded hex, so the mark tracks any future palette tweak.
 */
export function LogoMark({
  className = "",
  title,
}: {
  className?: string;
  /** Omit when the mark sits next to visible text that already names the agency. */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}

      {/* Back gable — taller, thinner, mostly gold with a dark trailing edge. */}
      <polygon points="95,18 28,208 95,208" fill="var(--color-brass-500)" />
      <polygon points="95,18 95,208 118,208" fill="var(--color-ink-900)" />

      {/* Front house — roof and body split down the centre. */}
      <polygon points="150,68 92,150 150,150" fill="var(--color-brass-500)" />
      <polygon points="150,68 150,150 208,150" fill="var(--color-ink-900)" />
      <rect x="92" y="150" width="58" height="80" fill="var(--color-brass-500)" />
      <rect x="150" y="150" width="58" height="80" fill="var(--color-ink-900)" />

      {/* Four-pane window on the front facade's dark half. */}
      <rect
        x="160"
        y="168"
        width="36"
        height="36"
        fill="var(--color-paper-50)"
        stroke="var(--color-brass-400)"
        strokeWidth="2"
      />
      <rect x="176" y="168" width="4" height="36" fill="var(--color-ink-900)" />
      <rect x="160" y="184" width="36" height="4" fill="var(--color-ink-900)" />
    </svg>
  );
}
