"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Scroll-triggered entrance.
 *
 * The animation itself is pure CSS (see `[data-reveal]` in globals.css). This
 * component's only job is to flip one attribute when the element enters the
 * viewport, then disconnect. No animation library, no per-frame JS, no work on
 * the main thread during scroll.
 *
 * The `mask` variant animates an inner element rather than the observed one.
 * That is not stylistic: `clip-path` reduces an element's intersection rect to
 * nothing, so an IntersectionObserver watching a clipped element reports it as
 * never intersecting and the content stays permanently hidden. Observing the
 * unclipped wrapper breaks that deadlock.
 *
 * `prefers-reduced-motion` is handled in CSS, so reduced-motion users get the
 * final state immediately without this component knowing or caring.
 */

type RevealVariant = "rise" | "mask";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Stagger, in milliseconds. */
  delay?: number;
  variant?: RevealVariant;
  /** Vertical travel distance for the "rise" variant. */
  distance?: string;
  /** Fraction of the element that must be visible before revealing. */
  threshold?: number;
  id?: string;
}

export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  variant = "rise",
  distance = "1.25rem",
  threshold = 0.12,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // The element carrying the animation: the node itself for "rise", its
    // single child for "mask".
    const target = (node.querySelector<HTMLElement>(":scope > [data-reveal]") ??
      node) as HTMLElement;

    // Anything already on screen at mount reveals immediately — no flash of
    // hidden content above the fold.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            target.setAttribute("data-reveal-state", "in");
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const motionStyle = {
    "--reveal-delay": `${delay}ms`,
    "--reveal-y": distance,
  } as React.CSSProperties;

  if (variant === "mask") {
    return (
      <Tag ref={ref} id={id} className={className}>
        <span data-reveal="mask" style={motionStyle} className="block">
          {children}
        </span>
      </Tag>
    );
  }

  return (
    <Tag ref={ref} id={id} className={className} data-reveal="" style={motionStyle}>
      {children}
    </Tag>
  );
}
