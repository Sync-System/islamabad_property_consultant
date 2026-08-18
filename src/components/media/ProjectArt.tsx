import type { ArtVariant } from "@/lib/projects/types";

/**
 * Original generated artwork.
 *
 * We do not hold commercial rights to the developer's photography, so rather
 * than shipping grey boxes — or worse, someone else's images — every media slot
 * without a licensed file renders one of these compositions. They are pure SVG:
 * no network request, no decode cost, no layout shift, and they scale to any
 * container. Dropping a real photograph into `/public/projects/…` and setting
 * `Media.src` replaces them with zero component changes.
 *
 * The drawings are architectural rather than decorative — ridge lines,
 * contours, site plans, massing studies — so the page reads as a considered
 * graphic system instead of a page waiting for images.
 */

interface ProjectArtProps {
  variant: ArtVariant;
  /** Distinguishes gradient ids when several compositions share a page. */
  seed?: string | number;
  className?: string;
  /** Inverts the palette for use on dark sections. */
  tone?: "light" | "dark";
}

/** One drawing palette. Both tones share this exact shape. */
interface Palette {
  sky0: string;
  sky1: string;
  sky2: string;
  mid: string;
  near: string;
  line: string;
  accent: string;
  water: string;
  field: string;
  /** Ridge layers, far to near. Atmospheric perspective: far is hazier. */
  ridge: [string, string, string, string, string];
  haze: string;
}

// Deep navy and orange, matching the site's own `ink`/`brass` tokens (in turn
// taken from slotta.dev's palette) rather than a literal landscape colour.
// `water` keeps a small blue-grey allowance — the Lake District is an actual
// amenity — but nothing else carries a green or gold cast any more.
const PALETTES: Record<"dark" | "light", Palette> = {
  dark: {
    sky0: "#02071d",
    sky1: "#0b1633",
    sky2: "#1f2d4b",
    mid: "#101c3a",
    near: "#050b1f",
    line: "#f0995b",
    accent: "#e97430",
    water: "#3d5a76",
    field: "#081027",
    ridge: ["#344260", "#243252", "#182440", "#0e1830", "#050b1f"],
    haze: "#505d7a",
  },
  light: {
    sky0: "#f3f4fa",
    sky1: "#e3e6f0",
    sky2: "#c7cce0",
    mid: "#b3b6c9",
    near: "#8891a8",
    line: "#ae4200",
    accent: "#cc5903",
    water: "#7391a0",
    field: "#dee1ec",
    ridge: ["#c3c8dc", "#a7adc6", "#8b92ad", "#707893", "#525a75"],
    haze: "#e9ebf3",
  },
};

export function ProjectArt({
  variant,
  seed = 0,
  className,
  tone = "dark",
}: ProjectArtProps) {
  const id = `${variant}-${seed}`;
  const c = PALETTES[tone];

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.sky0} />
          <stop offset="55%" stopColor={c.sky1} />
          <stop offset="100%" stopColor={c.sky2} />
        </linearGradient>
        <linearGradient id={`fade-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.line} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c.line} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="0.72" cy="0.24" r="0.62">
          <stop offset="0%" stopColor={c.accent} stopOpacity="0.34" />
          <stop offset="100%" stopColor={c.accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="800" fill={`url(#sky-${id})`} />
      <rect width="1200" height="800" fill={`url(#glow-${id})`} />

      {variant === "ridge" && <Ridge c={c} />}
      {variant === "contour" && <Contour c={c} />}
      {variant === "plan" && <Plan c={c} />}
      {variant === "tower" && <Tower c={c} />}
      {variant === "water" && <Water c={c} />}
      {variant === "canopy" && <Canopy c={c} />}
      {variant === "street" && <Street c={c} />}
      {variant === "aerial" && <Aerial c={c} />}
    </svg>
  );
}

interface PartProps {
  c: Palette;
}

/* -------------------------------------------------------------------------- */
/* Margalla ridge — layered silhouettes with atmospheric recession.            */
/* -------------------------------------------------------------------------- */

function Ridge({ c }: PartProps) {
  // Five ridge lines, far to near. Separate paths rather than one shape at
  // varying opacity, so the value steps stay crisp under a scrim. Peaks are
  // deliberately irregular — evenly spaced zigzags read as a graphic pattern,
  // not as a mountain range.
  const layers = [
    "M0 384 L88 336 L162 372 L268 300 L352 348 L438 318 L534 356 L622 306 L742 350 L836 322 L940 362 L1046 314 L1132 356 L1200 330 L1200 800 L0 800 Z",
    "M0 446 L74 414 L168 442 L246 372 L344 420 L452 386 L536 428 L648 366 L738 418 L858 388 L946 430 L1058 378 L1150 428 L1200 406 L1200 800 L0 800 Z",
    "M0 522 L96 470 L186 512 L296 436 L392 490 L486 454 L594 504 L706 438 L800 492 L912 458 L1024 506 L1122 462 L1200 498 L1200 800 L0 800 Z",
    "M0 602 L108 548 L214 596 L322 502 L446 570 L548 528 L664 586 L790 512 L886 574 L1006 532 L1108 586 L1200 552 L1200 800 L0 800 Z",
    "M0 700 L132 634 L242 696 L378 596 L494 672 L614 620 L730 684 L858 610 L968 678 L1088 626 L1178 686 L1200 672 L1200 800 L0 800 Z",
  ];

  return (
    <g>
      <defs>
        {/* Soft low sun behind the ridge line. A radial gradient rather than a
            drawn disc — a hard circle edge in a landscape reads as a sticker. */}
        <radialGradient id="ridge-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={c.accent} stopOpacity="0.5" />
          <stop offset="38%" stopColor={c.accent} stopOpacity="0.18" />
          <stop offset="100%" stopColor={c.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ridge-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.haze} stopOpacity="0" />
          <stop offset="100%" stopColor={c.haze} stopOpacity="0.32" />
        </linearGradient>
      </defs>

      <rect x="440" y="80" width="700" height="700" fill="url(#ridge-sun)" />

      {layers.map((d, i) => (
        <g key={i}>
          {/* Mist gathering in the valley in front of each ridge. */}
          <rect
            y={318 + i * 66}
            width="1200"
            height="104"
            fill="url(#ridge-mist)"
            opacity={0.85 - i * 0.16}
          />
          <path d={d} fill={c.ridge[i]} />
        </g>
      ))}

      {/* Contour reading across the nearest slope. */}
      <g stroke={c.line} strokeWidth="0.7" fill="none" opacity="0.14">
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M0 ${726 + i * 20} C 220 ${702 + i * 20}, 420 ${748 + i * 20}, 640 ${718 + i * 20} S 1010 ${750 + i * 20}, 1200 ${722 + i * 20}`}
          />
        ))}
      </g>

      {/* A single surveyed edge, catching the light on the fourth ridge. */}
      <path
        d="M0 602 L108 548 L214 596 L322 502 L446 570 L548 528 L664 586 L790 512 L886 574 L1006 532 L1108 586 L1200 552"
        fill="none"
        stroke={c.accent}
        strokeWidth="1.1"
        opacity="0.3"
      />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Topographic contour field.                                                  */
/* -------------------------------------------------------------------------- */

function Contour({ c }: PartProps) {
  const rings = Array.from({ length: 16 }, (_, i) => i);
  return (
    <g>
      <g fill="none" stroke={c.line} strokeWidth="0.8" opacity="0.3">
        {rings.map((i) => {
          const k = i * 26;
          return (
            <path
              key={i}
              d={`M${-60 + k * 0.4} ${740 - k * 0.9}
                  C ${180 + k * 0.3} ${620 - k}, ${360 - k * 0.2} ${780 - k * 1.1}, ${600} ${660 - k}
                  S ${940 + k * 0.2} ${748 - k * 1.05}, ${1260 - k * 0.3} ${600 - k * 0.85}`}
            />
          );
        })}
      </g>
      <g fill="none" stroke={c.accent} strokeWidth="1.1" opacity="0.42">
        <path d="M-60 740 C 180 620, 360 780, 600 660 S 940 748, 1260 600" />
        <path d="M44 506 C 296 386, 436 546, 660 426 S 1000 514, 1338 366" />
      </g>
      {/* Survey markers. */}
      <g fill={c.accent} opacity="0.55">
        {[
          [240, 592],
          [640, 486],
          [928, 552],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="3" />
            <circle cx={x} cy={y} r="11" fill="none" stroke={c.accent} strokeWidth="0.8" />
          </g>
        ))}
      </g>
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Site plan abstraction — blocks, roads, water, green.                        */
/* -------------------------------------------------------------------------- */

function Plan({ c }: PartProps) {
  const blocks: [number, number, number, number][] = [
    [90, 120, 190, 120], [300, 120, 150, 120], [470, 120, 210, 120],
    [90, 262, 140, 150], [250, 262, 200, 150], [470, 262, 120, 150],
    [740, 120, 170, 96], [740, 236, 170, 120],
    [90, 432, 240, 130], [350, 432, 180, 130],
    [740, 470, 200, 120], [960, 470, 150, 120],
    [960, 120, 150, 96], [960, 236, 150, 120],
  ];

  return (
    <g>
      <rect x="60" y="90" width="1080" height="620" fill={c.field} opacity="0.16" />

      {/* Arterial roads. */}
      <g stroke={c.line} strokeWidth="9" opacity="0.16" strokeLinecap="square">
        <path d="M60 250 H1140" />
        <path d="M60 420 H1140" />
        <path d="M700 90 V710" />
        <path d="M340 90 V710" />
      </g>
      <g stroke={c.line} strokeWidth="1" opacity="0.4" strokeDasharray="10 9">
        <path d="M60 250 H1140" />
        <path d="M700 90 V710" />
      </g>

      {/* Plotted blocks. */}
      <g>
        {blocks.map(([x, y, w, h], i) => (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill={c.line}
              opacity={i % 5 === 0 ? 0.13 : 0.07}
            />
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill="none"
              stroke={c.line}
              strokeWidth="0.9"
              opacity="0.42"
            />
            {/* Plot subdivision hatching. */}
            {Array.from({ length: Math.max(2, Math.floor(w / 34)) }, (_, k) => (
              <line
                key={k}
                x1={x + ((k + 1) * w) / Math.max(3, Math.floor(w / 34) + 1)}
                y1={y}
                x2={x + ((k + 1) * w) / Math.max(3, Math.floor(w / 34) + 1)}
                y2={y + h}
                stroke={c.line}
                strokeWidth="0.5"
                opacity="0.22"
              />
            ))}
          </g>
        ))}
      </g>

      {/* Water body. */}
      <path
        d="M770 560 C 830 520, 930 528, 980 566 C 1030 604, 1000 668, 926 682 C 852 696, 782 668, 762 622 Z"
        fill={c.water}
        opacity="0.4"
      />
      <path
        d="M770 560 C 830 520, 930 528, 980 566 C 1030 604, 1000 668, 926 682 C 852 696, 782 668, 762 622 Z"
        fill="none"
        stroke={c.water}
        strokeWidth="1.2"
        opacity="0.75"
      />

      {/* Green belt. */}
      <rect x="90" y="596" width="560" height="86" fill={c.line} opacity="0.14" />
      <g fill={c.line} opacity="0.34">
        {Array.from({ length: 11 }, (_, i) => (
          <circle key={i} cx={122 + i * 52} cy={639} r="12" />
        ))}
      </g>

      {/* Commercial accent. */}
      <rect x="470" y="262" width="120" height="150" fill={c.accent} opacity="0.26" />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Massing / elevation study.                                                  */
/* -------------------------------------------------------------------------- */

function Tower({ c }: PartProps) {
  const bars: [number, number, number][] = [
    [110, 470, 130], [250, 340, 110], [370, 552, 96], [486, 268, 128],
    [624, 430, 104], [738, 356, 122], [870, 512, 98], [978, 396, 140],
  ];
  return (
    <g>
      <g>
        {bars.map(([x, y, w], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={800 - y} fill={c.near} opacity={0.55 + (i % 3) * 0.12} />
            <rect
              x={x}
              y={y}
              width={w}
              height={800 - y}
              fill="none"
              stroke={c.line}
              strokeWidth="0.8"
              opacity="0.35"
            />
            {/* Floor plates. */}
            {Array.from({ length: Math.floor((800 - y) / 34) }, (_, k) => (
              <line
                key={k}
                x1={x}
                y1={y + (k + 1) * 34}
                x2={x + w}
                y2={y + (k + 1) * 34}
                stroke={c.line}
                strokeWidth="0.5"
                opacity="0.22"
              />
            ))}
            {/* Vertical fins. */}
            <line x1={x + w * 0.38} y1={y} x2={x + w * 0.38} y2={800} stroke={c.line} strokeWidth="0.5" opacity="0.22" />
            <line x1={x + w * 0.72} y1={y} x2={x + w * 0.72} y2={800} stroke={c.line} strokeWidth="0.5" opacity="0.22" />
          </g>
        ))}
      </g>
      <line x1="0" y1="700" x2="1200" y2="700" stroke={c.accent} strokeWidth="1" opacity="0.4" />
      <line x1="0" y1="240" x2="1200" y2="240" stroke={c.line} strokeWidth="0.6" opacity="0.2" strokeDasharray="14 10" />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Waterfront.                                                                 */
/* -------------------------------------------------------------------------- */

function Water({ c }: PartProps) {
  return (
    <g>
      <path
        d="M0 452 L150 424 L300 448 L470 410 L620 446 L780 414 L940 450 L1090 420 L1200 444 L1200 500 L0 500 Z"
        fill={c.near}
        opacity="0.75"
      />
      <rect y="500" width="1200" height="300" fill={c.water} opacity="0.5" />
      <g stroke={c.line} strokeWidth="1" opacity="0.3">
        {Array.from({ length: 14 }, (_, i) => {
          const y = 512 + i * 20;
          const inset = 40 + i * 26;
          return <line key={i} x1={inset} y1={y} x2={1200 - inset} y2={y} />;
        })}
      </g>
      {/* Reflection of the far ridge. */}
      <path
        d="M0 548 L150 576 L300 552 L470 590 L620 554 L780 586 L940 550 L1090 580 L1200 556 L1200 500 L0 500 Z"
        fill={c.near}
        opacity="0.18"
      />
      <circle cx="880" cy="236" r="52" fill={c.accent} opacity="0.2" />
      <circle cx="880" cy="236" r="52" fill="none" stroke={c.accent} strokeWidth="0.8" opacity="0.5" />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Tree canopy.                                                                */
/* -------------------------------------------------------------------------- */

function Canopy({ c }: PartProps) {
  // Deterministic pseudo-random placement — stable between server and client.
  const trees = Array.from({ length: 42 }, (_, i) => {
    const x = ((i * 197) % 1240) - 20;
    const y = 300 + ((i * 271) % 460);
    const r = 26 + ((i * 53) % 46);
    return { x, y, r, i };
  });

  return (
    <g>
      <rect y="300" width="1200" height="500" fill={c.near} opacity="0.35" />
      {trees.map(({ x, y, r, i }) => (
        <g key={i} opacity={0.2 + ((i * 7) % 5) * 0.12}>
          <circle cx={x} cy={y} r={r} fill={c.line} opacity="0.3" />
          <circle cx={x} cy={y} r={r} fill="none" stroke={c.line} strokeWidth="0.7" opacity="0.55" />
          <line x1={x} y1={y} x2={x} y2={y + r + 16} stroke={c.line} strokeWidth="0.7" opacity="0.4" />
        </g>
      ))}
      <g stroke={c.accent} strokeWidth="1" opacity="0.35" fill="none">
        <path d="M-40 640 C 240 580, 400 700, 660 620 S 980 690, 1240 596" />
      </g>
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Boulevard — one-point perspective.                                          */
/* -------------------------------------------------------------------------- */

function Street({ c }: PartProps) {
  const vpX = 600;
  const vpY = 430;
  const rows = [0, 1, 2, 3, 4, 5];

  return (
    <g>
      <rect y={vpY} width="1200" height={800 - vpY} fill={c.near} opacity="0.6" />

      {/* Carriageway. */}
      <path d={`M${vpX - 26} ${vpY} L${vpX + 26} ${vpY} L1010 800 L190 800 Z`} fill={c.mid} opacity="0.4" />
      <g stroke={c.accent} strokeWidth="1.4" opacity="0.4" strokeDasharray="26 30">
        <path d={`M${vpX} ${vpY} L600 800`} />
      </g>

      {/* Kerb lines. */}
      <g stroke={c.line} strokeWidth="0.9" opacity="0.42">
        <path d={`M${vpX - 26} ${vpY} L190 800`} />
        <path d={`M${vpX + 26} ${vpY} L1010 800`} />
        <path d={`M${vpX - 70} ${vpY} L-140 800`} />
        <path d={`M${vpX + 70} ${vpY} L1340 800`} />
      </g>

      {/* Receding tree rows. */}
      {rows.map((i) => {
        const t = (i + 1) / (rows.length + 1);
        const y = vpY + (800 - vpY) * t * t;
        const spread = 90 + 520 * t * t;
        const r = 12 + 54 * t * t;
        return (
          <g key={i} opacity={0.3 + t * 0.5}>
            <circle cx={vpX - spread} cy={y - r} r={r} fill={c.line} opacity="0.24" />
            <circle cx={vpX - spread} cy={y - r} r={r} fill="none" stroke={c.line} strokeWidth="0.7" opacity="0.55" />
            <line x1={vpX - spread} y1={y - r} x2={vpX - spread} y2={y + r * 0.6} stroke={c.line} strokeWidth="0.8" opacity="0.45" />
            <circle cx={vpX + spread} cy={y - r} r={r} fill={c.line} opacity="0.24" />
            <circle cx={vpX + spread} cy={y - r} r={r} fill="none" stroke={c.line} strokeWidth="0.7" opacity="0.55" />
            <line x1={vpX + spread} y1={y - r} x2={vpX + spread} y2={y + r * 0.6} stroke={c.line} strokeWidth="0.8" opacity="0.45" />
          </g>
        );
      })}

      {/* Distant ridge above the vanishing point. */}
      <path
        d="M0 400 L160 366 L320 402 L470 356 L600 396 L740 358 L890 400 L1040 364 L1200 398 L1200 430 L0 430 Z"
        fill={c.mid}
        opacity="0.4"
      />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Aerial block layout.                                                        */
/* -------------------------------------------------------------------------- */

function Aerial({ c }: PartProps) {
  const cells = Array.from({ length: 60 }, (_, i) => {
    const col = i % 10;
    const row = Math.floor(i / 10);
    return { col, row, i };
  });

  return (
    <g>
      <g transform="translate(600 400) rotate(-12) translate(-600 -400)">
        {cells.map(({ col, row, i }) => {
          const w = 92;
          const h = 88;
          const x = 40 + col * (w + 22);
          const y = 130 + row * (h + 26);
          const on = (i * 37) % 7 < 5;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={on ? c.line : c.accent}
                opacity={on ? 0.09 : 0.16}
              />
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill="none"
                stroke={c.line}
                strokeWidth="0.8"
                opacity="0.38"
              />
              {Array.from({ length: 3 }, (_, k) => (
                <line
                  key={k}
                  x1={x + ((k + 1) * w) / 4}
                  y1={y}
                  x2={x + ((k + 1) * w) / 4}
                  y2={y + h}
                  stroke={c.line}
                  strokeWidth="0.4"
                  opacity="0.24"
                />
              ))}
            </g>
          );
        })}
        {/* Roads between the bands. */}
        <g stroke={c.line} strokeWidth="10" opacity="0.12">
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <line key={r} x1="-40" y1={118 + r * 114} x2="1240" y2={118 + r * 114} />
          ))}
        </g>
      </g>
    </g>
  );
}
