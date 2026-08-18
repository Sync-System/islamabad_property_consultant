"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Restrained hero parallax.
 *
 * The backdrop drifts at 18% of scroll speed while the hero is on screen, which
 * is enough to give the composition depth and little enough that it never reads
 * as a gimmick. Work is confined to a rAF callback that writes a single
 * transform, and stops entirely once the hero leaves the viewport.
 */

export function HeroBackdrop({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let active = true;

    const update = () => {
      frame = 0;
      if (!active) return;
      const offset = Math.min(window.scrollY, window.innerHeight) * 0.18;
      node.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    // Stop doing any work once the hero is behind us.
    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) update();
      },
      { threshold: 0 },
    );
    observer.observe(node.parentElement ?? node);

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 will-change-transform">
      {children}
    </div>
  );
}
