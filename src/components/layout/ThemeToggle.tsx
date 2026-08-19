"use client";

import { MoonIcon, SunIcon } from "@/components/ui/Icon";

/**
 * Light / dark toggle.
 *
 * Three states matter, not two: "light", "dark", and *unset* — meaning follow
 * the operating system. A visitor who has never touched this control tracks
 * their OS preference, including if they change it mid-session, so the
 * attribute is only written once they actually choose.
 *
 * Both icons are rendered and CSS shows the right one (see `.theme-icon-*` in
 * globals.css, keyed off the same selectors that set the palette). That is what
 * lets this button be fully server-rendered: it needs no knowledge of
 * `localStorage`, so there is no placeholder, no hydration mismatch, and
 * nothing pops into the header a moment after load. The click handler reads the
 * currently applied theme back out of the DOM rather than holding its own copy
 * of state that could drift from what is painted.
 */

const STORAGE_KEY = "ipc.theme";

function currentTheme(): "light" | "dark" {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private-mode Safari throws on write. The theme still applies for this
      // page view, it just will not be remembered.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      // A static label, because the icon already communicates the current
      // state and a label that changes under the pointer is disorienting.
      aria-label="Switch between light and dark theme"
      title="Switch between light and dark theme"
      className={`grid size-11 shrink-0 place-items-center rounded-xs border border-line text-content-muted transition-colors duration-300 hover:border-line-strong hover:text-content ${className}`}
    >
      <SunIcon size={18} className="theme-icon-sun" />
      <MoonIcon size={18} className="theme-icon-moon" />
    </button>
  );
}
