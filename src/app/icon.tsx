import { ImageResponse } from "next/og";

/**
 * Favicon, generated from the same mark as `LogoMark`.
 *
 * Colours are hard-coded hex here rather than the `var(--color-brass-500)`
 * tokens `LogoMark` uses: this renders through Satori at request time, fully
 * outside the page's CSS context, so a custom property would resolve to
 * nothing. Keep these in sync with `--color-brass-500` / `--color-ink-900` in
 * globals.css if the palette ever moves.
 */

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

const GOLD = "#e97430";
const INK = "#101c3a";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "transparent",
        }}
      >
        <svg viewBox="0 0 240 240" width="48" height="48">
          <polygon points="95,18 28,208 95,208" fill={GOLD} />
          <polygon points="95,18 95,208 118,208" fill={INK} />
          <polygon points="150,68 92,150 150,150" fill={GOLD} />
          <polygon points="150,68 150,150 208,150" fill={INK} />
          <rect x="92" y="150" width="58" height="80" fill={GOLD} />
          <rect x="150" y="150" width="58" height="80" fill={INK} />
          <rect x="160" y="168" width="36" height="36" fill="#f7f7fd" stroke="#f0995b" strokeWidth="3" />
          <rect x="176" y="168" width="4" height="36" fill={INK} />
          <rect x="160" y="184" width="36" height="4" fill={INK} />
        </svg>
      </div>
    ),
    size,
  );
}
