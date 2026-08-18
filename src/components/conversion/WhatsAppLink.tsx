"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { getAttribution, type CtaLocation } from "@/lib/attribution";
import { track } from "@/lib/analytics";
import { defaultWhatsappUrl, whatsappUrl, type WhatsAppContext } from "@/lib/whatsapp";
import { buttonClass, type ButtonSize, type ButtonVariant } from "@/components/ui/button-styles";
import { WhatsAppIcon } from "@/components/ui/Icon";

/**
 * The single WhatsApp entry point used by every CTA on the site.
 *
 * It renders a working `wa.me` link on the server, then upgrades the href on
 * the client once session attribution is available. That ordering matters: the
 * link is clickable before hydration, so a visitor on a slow phone from a
 * Facebook ad can convert immediately rather than tapping a dead element.
 */

interface WhatsAppLinkProps extends Omit<WhatsAppContext, "attribution"> {
  ctaLocation: CtaLocation;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Renders as an unstyled link — caller supplies all classes. */
  bare?: boolean;
  /** Hides the WhatsApp glyph. */
  hideIcon?: boolean;
  /** Overrides the accessible name when children are not descriptive. */
  ariaLabel?: string;
}

export function WhatsAppLink({
  ctaLocation,
  children = "Chat on WhatsApp",
  variant = "whatsapp",
  size = "md",
  className = "",
  bare = false,
  hideIcon = false,
  ariaLabel,
  ...context
}: WhatsAppLinkProps) {
  // Server render and first paint: a valid link with no attribution.
  const fallbackHref = useMemo(
    () =>
      context.projectName || context.propertyPreference
        ? whatsappUrl({ ...context, ctaLocation })
        : defaultWhatsappUrl(ctaLocation),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ctaLocation, context.projectName, context.propertyPreference, context.paymentPlan],
  );

  const ref = useRef<HTMLAnchorElement>(null);

  // Attribution only exists on the client, so the href is upgraded in place
  // after mount. Writing the attribute directly rather than through state keeps
  // this a one-way sync to the DOM instead of a second render pass.
  useEffect(() => {
    ref.current?.setAttribute(
      "href",
      whatsappUrl({ ...context, ctaLocation, attribution: getAttribution() }),
    );
    // Context is a plain object rebuilt each render; depend on its meaningful parts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ctaLocation,
    context.projectName,
    context.projectSlug,
    context.propertyPreference,
    context.paymentPlan,
  ]);

  function handleClick() {
    track(
      "whatsapp_click",
      {
        ctaLocation,
        projectSlug: context.projectSlug,
        projectName: context.projectName,
        propertyPreference: context.propertyPreference,
        paymentPlan: context.paymentPlan,
      },
      getAttribution(),
    );
  }

  return (
    <a
      ref={ref}
      href={fallbackHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={bare ? className : buttonClass(variant, size, className)}
      data-cta={ctaLocation}
    >
      {!hideIcon && <WhatsAppIcon size={18} className="shrink-0" />}
      <span>{children}</span>
    </a>
  );
}

/* -------------------------------------------------------------------------- */

interface PhoneLinkProps {
  ctaLocation: CtaLocation;
  children?: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  bare?: boolean;
  href: string;
  ariaLabel?: string;
}

/** Telephone link with the same analytics contract as WhatsAppLink. */
export function PhoneLink({
  ctaLocation,
  children,
  className = "",
  variant = "outline",
  size = "md",
  bare = false,
  href,
  ariaLabel,
}: PhoneLinkProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      onClick={() => track("phone_click", { ctaLocation }, getAttribution())}
      className={bare ? className : buttonClass(variant, size, className)}
      data-cta={ctaLocation}
    >
      {children}
    </a>
  );
}
