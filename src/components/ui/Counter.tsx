"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a numeric stat up when it scrolls into view.
 *
 * Values that are not numbers ("Zone 4", "CDA + DHA") are rendered as-is — the
 * component degrades to plain text rather than mangling them. Reduced-motion
 * users see the final value immediately.
 */

interface CounterProps {
  value: string;
  className?: string;
  durationMs?: number;
}

/** Splits "3" / "1,700" / "11" into a number plus any surrounding characters. */
function parse(value: string): { prefix: string; number: number; suffix: string } | null {
  const match = value.match(/^(\D*)([\d,]+)(.*)$/);
  if (!match) return null;
  const numeric = Number(match[2].replace(/,/g, ""));
  if (!Number.isFinite(numeric)) return null;
  return { prefix: match[1], number: numeric, suffix: match[3] };
}

export function Counter({ value, className, durationMs = 1400 }: CounterProps) {
  const parsed = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<number | null>(parsed ? 0 : null);

  useEffect(() => {
    if (!parsed) return;
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        // Reduced motion: jump straight to the final value, no tween.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setDisplay(parsed.number);
          return;
        }

        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          // Quintic ease-out: fast settle, no lingering tail.
          const eased = 1 - Math.pow(1 - t, 5);
          setDisplay(Math.round(parsed.number * eased));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // `value` is the only meaningful input; `parsed` is derived from it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs]);

  if (!parsed) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {/* The true value is always in the accessibility tree, never the tween. */}
      <span aria-hidden="true" className="tabular">
        {parsed.prefix}
        {(display ?? parsed.number).toLocaleString("en-US")}
        {parsed.suffix}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
