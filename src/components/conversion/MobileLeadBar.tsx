"use client";

import { useEffect, useState } from "react";
import { agencyConfig } from "@/lib/config/agency";
import { telUrl } from "@/lib/whatsapp";
import { getAttribution } from "@/lib/attribution";
import { track } from "@/lib/analytics";
import { CalendarIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icon";
import { WhatsAppLink } from "./WhatsAppLink";

/**
 * Fixed mobile conversion bar: WhatsApp · Call · Site Visit.
 *
 * Most leads for Islamabad property arrive on a phone from a social ad, so this
 * is the single most important conversion surface on the site.
 *
 * Details that matter:
 *  - It only appears after the hero, so it never covers the opening statement.
 *  - `env(safe-area-inset-bottom)` keeps it clear of the iOS home indicator.
 *  - The page carries matching bottom padding (see `pb-[…]` on the layout) so
 *    the bar never sits on top of the footer or the final CTA.
 *  - Every target is at least 48px tall.
 */

interface MobileLeadBarProps {
  projectName?: string;
  projectSlug?: string;
  /** Anchor for the site-visit action. */
  siteVisitHref?: string;
}

export function MobileLeadBar({
  projectName,
  projectSlug,
  siteVisitHref = "#site-visit",
}: MobileLeadBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      } transition-transform duration-500 ease-[var(--ease-out-quint)]`}
    >
      <div className="border-t border-ink-900/10 bg-paper-50/97 pb-safe backdrop-blur-md">
        <div className="grid grid-cols-[1.35fr_1fr_1fr]">
          <WhatsAppLink
            ctaLocation="mobile-sticky"
            projectName={projectName}
            projectSlug={projectSlug}
            bare
            hideIcon
            className="flex min-h-[3.5rem] flex-col items-center justify-center gap-1 bg-wa-600 text-white"
          >
            <span className="flex items-center gap-2">
              <WhatsAppIcon size={19} />
              <span className="text-[0.875rem] font-semibold">WhatsApp</span>
            </span>
          </WhatsAppLink>

          <a
            href={telUrl}
            onClick={() =>
              track("phone_click", { ctaLocation: "mobile-sticky" }, getAttribution())
            }
            aria-label={`Call ${agencyConfig.name}`}
            className="flex min-h-[3.5rem] flex-col items-center justify-center gap-1 border-l border-ink-900/10 text-ink-800"
          >
            <PhoneIcon size={19} />
            <span className="text-[0.6875rem] font-semibold tracking-[0.06em] uppercase">
              Call
            </span>
          </a>

          <a
            href={siteVisitHref}
            onClick={() =>
              track(
                "site_visit_request",
                { ctaLocation: "mobile-sticky", projectSlug, step: "open" },
                getAttribution(),
              )
            }
            className="flex min-h-[3.5rem] flex-col items-center justify-center gap-1 border-l border-ink-900/10 text-ink-800"
          >
            <CalendarIcon size={19} />
            <span className="text-[0.6875rem] font-semibold tracking-[0.06em] uppercase">
              Visit
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
