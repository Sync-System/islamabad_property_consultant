"use client";

import { useEffect, useState } from "react";
import { WhatsAppLink } from "./WhatsAppLink";

/**
 * Persistent WhatsApp affordance for desktop and tablet.
 *
 * It appears only after the visitor has scrolled past the hero. The brief is
 * explicit that we must not push people to WhatsApp on arrival — the button
 * earns its place once they have read something. On phones the fixed conversion
 * bar covers this role, so the floating button is hidden below `md`.
 */

interface FloatingWhatsAppProps {
  projectName?: string;
  projectSlug?: string;
}

export function FloatingWhatsApp({ projectName, projectSlug }: FloatingWhatsAppProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-7 right-7 z-40 hidden transition-all duration-500 ease-[var(--ease-out-quint)] md:block ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <WhatsAppLink
        ctaLocation="floating-whatsapp"
        projectName={projectName}
        projectSlug={projectSlug}
        bare
        hideIcon
        ariaLabel="Chat with Islamabad Property Consultant on WhatsApp"
        className="group flex h-14 items-center gap-0 overflow-hidden rounded-pill bg-wa-500 pl-[1.05rem] pr-[1.05rem] text-white shadow-float transition-[padding,background-color] duration-400 ease-[var(--ease-out-quint)] hover:bg-wa-600 hover:pr-6"
      >
        <span className="flex items-center gap-3">
          <WhatsAppGlyph />
          <span className="grid max-w-0 grid-cols-[0fr] overflow-hidden text-[0.875rem] font-semibold transition-[max-width,grid-template-columns] duration-400 ease-[var(--ease-out-quint)] group-hover:max-w-[12rem] group-hover:grid-cols-[1fr] group-focus-visible:max-w-[12rem] group-focus-visible:grid-cols-[1fr]">
            <span className="overflow-hidden whitespace-nowrap">Chat with us</span>
          </span>
        </span>
      </WhatsAppLink>
    </div>
  );
}

function WhatsAppGlyph() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.55 13.53c-.23.65-1.36 1.24-1.87 1.29-.5.05-.97.23-3.27-.68-2.75-1.08-4.49-3.9-4.63-4.08-.13-.18-1.1-1.46-1.1-2.79 0-1.33.7-1.98.94-2.25.25-.27.54-.34.72-.34h.52c.17 0 .4-.06.62.48.23.56.79 1.93.86 2.07.07.14.11.3.02.48-.09.18-.14.29-.27.45-.14.16-.29.36-.41.48-.14.14-.28.29-.12.57.16.27.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.21 1.36.27.14.43.11.59-.07.16-.18.68-.79.86-1.07.18-.27.36-.22.61-.13.25.09 1.6.75 1.87.89.27.14.45.2.52.32.07.11.07.65-.16 1.29Z" />
    </svg>
  );
}
