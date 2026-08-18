import { ImageResponse } from "next/og";

/**
 * Apple touch icon. iOS composites this without transparency, so unlike
 * `icon.tsx` it sits on a solid dark ground rather than a transparent one.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const GOLD = "#e97430";
const INK = "#101c3a";
const PAPER = "#f7f7fd";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: INK,
        }}
      >
        <svg viewBox="0 0 240 240" width="128" height="128">
          <polygon points="95,18 28,208 95,208" fill={GOLD} />
          <polygon points="95,18 95,208 118,208" fill={PAPER} />
          <polygon points="150,68 92,150 150,150" fill={GOLD} />
          <polygon points="150,68 150,150 208,150" fill={PAPER} />
          <rect x="92" y="150" width="58" height="80" fill={GOLD} />
          <rect x="150" y="150" width="58" height="80" fill={PAPER} />
          <rect x="160" y="168" width="36" height="36" fill={INK} stroke={GOLD} strokeWidth="3" />
          <rect x="176" y="168" width="4" height="36" fill={PAPER} />
          <rect x="160" y="184" width="36" height="4" fill={PAPER} />
        </svg>
      </div>
    ),
    size,
  );
}
