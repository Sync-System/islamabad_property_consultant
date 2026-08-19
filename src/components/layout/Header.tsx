"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NavItem } from "@/lib/config/site";
import { agencyConfig } from "@/lib/config/agency";
import { telUrl } from "@/lib/whatsapp";
import { WhatsAppLink, PhoneLink } from "@/components/conversion/WhatsAppLink";
import { CloseIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icon";
import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./Wordmark";

/**
 * Sticky navigation with scroll-spy and a mobile drawer.
 *
 * Two behaviours worth noting:
 *  - The header is transparent over the hero and gains a solid background once
 *    the hero is behind it. That is one class swap driven by a single scroll
 *    listener, not a per-frame recomputation. Text colour is no longer part of
 *    that swap: the hero scrim follows the theme, so the semantic tokens read
 *    correctly over both states.
 *  - The drawer is a real focus trap with `Escape` handling and background
 *    scroll lock, because a nav a keyboard user cannot leave is not navigation.
 */

interface HeaderProps {
  nav: NavItem[];
  projectName?: string;
  projectSlug?: string;
  /** Sits over a dark hero and starts transparent. */
  overHero?: boolean;
}

export function Header({ nav, projectName, projectSlug, overHero = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(!overHero);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* --- Solid / transparent -------------------------------------------- */
  useEffect(() => {
    if (!overHero) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.65);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  /* --- Scroll spy ------------------------------------------------------ */
  useEffect(() => {
    const ids = nav.map((item) => item.sectionId).filter(Boolean) as string[];
    if (ids.length === 0) return;

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The section occupying the most of the reading band wins.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [nav]);

  /* --- Drawer: scroll lock, Escape, focus trap ------------------------- */
  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Move focus into the drawer once it is on screen.
    const timer = window.setTimeout(() => {
      drawerRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    }, 60);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
    };
  }, [open, close]);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-out-quint)] ${
          solid
            ? "border-b border-line bg-surface/92 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[var(--header-h)] max-w-wide items-center gap-4 px-gutter sm:px-8 lg:px-12">
          <Link
            href="/"
            className="flex min-h-11 shrink-0 items-center"
            aria-label={`${agencyConfig.name} — home`}
          >
            <Wordmark />
          </Link>

          <nav
            aria-label="Section navigation"
            className="ml-auto hidden items-center gap-1 lg:flex"
          >
            {nav.map((item) => {
              const isActive = item.sectionId && active === item.sectionId;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  // `min-h-11` gives a 44px target; the underline is nested
                  // inside the label span so it stays tight to the text instead
                  // of floating at the bottom of the enlarged hit area.
                  className={`inline-flex min-h-11 items-center whitespace-nowrap px-2.5 text-[0.8125rem] font-medium transition-colors duration-300 ${
                    isActive ? "text-content" : "text-content-muted hover:text-content"
                  }`}
                >
                  <span className="relative">
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-400 ease-[var(--ease-out-quint)] ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-4">
            {/* Wrapped rather than classed `hidden`: the button's own `grid`
                and `hidden` are both display utilities in the same layer, so
                the class attribute order would not decide the winner. */}
            <span className="hidden sm:contents">
              <ThemeToggle />
            </span>

            <PhoneLink
              href={telUrl}
              ctaLocation="header"
              bare
              ariaLabel={`Call ${agencyConfig.name} on ${agencyConfig.phoneDisplay}`}
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xs border border-line text-content transition-colors duration-300 hover:border-line-strong sm:inline-flex"
            >
              <PhoneIcon size={18} />
            </PhoneLink>

            {/* Icon-only on small screens: a labelled button collides with the
                menu toggle at 390px. Wrapped rather than classed `hidden`,
                because buttonClass already sets `inline-flex` and the two
                display utilities sit in the same layer. */}
            <span className="shrink-0 sm:hidden">
              <WhatsAppLink
                ctaLocation="header"
                projectName={projectName}
                projectSlug={projectSlug}
                bare
                hideIcon
                ariaLabel="Chat with Islamabad Property Consultant on WhatsApp"
                className="grid size-11 place-items-center rounded-xs bg-wa-600 text-white"
              >
                <WhatsAppIcon size={19} />
              </WhatsAppLink>
            </span>

            <span className="hidden sm:contents">
              <WhatsAppLink
                ctaLocation="header"
                projectName={projectName}
                projectSlug={projectSlug}
                size="sm"
              >
                WhatsApp
              </WhatsAppLink>
            </span>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="nav-drawer"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xs border border-line text-content transition-colors duration-300 lg:hidden"
            >
              {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- Drawer ----------------------------------------------------- */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={close}
          className={`absolute inset-0 bg-ink-950/55 backdrop-blur-[2px] transition-opacity duration-400 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          ref={drawerRef}
          id="nav-drawer"
          role="dialog"
          aria-modal={open || undefined}
          aria-label="Menu"
          className={`absolute inset-x-0 top-0 origin-top bg-surface pt-[var(--header-h)] shadow-float transition-transform duration-500 ease-[var(--ease-out-quint)] ${
            open ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <nav
            aria-label="Menu"
            className="max-h-[calc(100dvh-var(--header-h))] overflow-y-auto px-gutter pb-8 pt-2 sm:px-8"
          >
            <ul className="divide-y divide-line">
              {nav.map((item, index) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={close}
                    className="flex items-baseline gap-4 py-4 text-h4 text-content"
                  >
                    <span className="eyebrow tabular w-6 text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-7 grid gap-2.5">
              <WhatsAppLink
                ctaLocation="nav-drawer"
                projectName={projectName}
                projectSlug={projectSlug}
                size="lg"
              >
                Get Details on WhatsApp
              </WhatsAppLink>
              <PhoneLink href={telUrl} ctaLocation="nav-drawer" variant="outline" size="lg">
                <PhoneIcon size={18} />
                <span>Call {agencyConfig.phoneDisplay}</span>
              </PhoneLink>
            </div>

            {/* The header has no room for this at 390px, so it lives here on
                small screens and in the header from `sm` up. */}
            <div className="mt-6 flex items-center justify-between border-t border-line pt-5 sm:hidden">
              <span className="text-body-sm text-content-muted">Appearance</span>
              <ThemeToggle />
            </div>

            <p className="mt-6 text-micro text-content-subtle">
              {agencyConfig.positioning}
            </p>
          </nav>
        </div>
      </div>
    </>
  );
}
