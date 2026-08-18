"use client";

import { useEffect } from "react";

/**
 * Smooth scrolling for in-page anchors only.
 *
 * `scroll-behavior: smooth` on `html` cannot be used for this: the App Router
 * resets scroll on every navigation, and a smooth root scroller turns that
 * reset into an animation that races the incoming page's layout. The new page
 * grows taller while the animation is still running, so the browser settles
 * partway down it — which reads as the page auto-scrolling after you select a
 * project.
 *
 * Delegating from `document` keeps route changes instant (what the router
 * expects) while `#overview`, `#site-visit` and the nav links still glide.
 * `scrollIntoView` honours the `scroll-padding-top` on `html`, so targets
 * still clear the sticky header.
 */
export function SmoothAnchors() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Leave modified clicks and anything already handled alone.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;

      const destination = document.getElementById(id);
      if (!destination) return;

      event.preventDefault();

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      destination.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });

      // Keep the URL in step with a normal anchor activation so the position
      // is shareable and Back returns where the visitor expects.
      history.pushState(null, "", `#${id}`);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
