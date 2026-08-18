"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/ui/Icon";

/**
 * Light / dark toggle.
 *
 * Three states matter, not two: "light", "dark", and *unset* — meaning follow
 * the operating system. A visitor who has never touched this control tracks
 * their OS preference, including if they change it mid-session, so the
 * attribute is only written once they actually choose.
 *
 * The theme itself is applied before first paint by an inline script in the
 * root layout. This component reads that decision back and lets the visitor
 * change it. It reads through `useSyncExternalStore` because the source of
 * truth really is external — `localStorage` plus a media query — and that hook
 * is what keeps the server render, hydration and later updates consistent:
 * `getServerSnapshot` returns `null` for both the server pass and the
 * hydrating pass, so there is no mismatch, and the real value arrives on the
 * commit after.
 */

type Choice = "light" | "dark";

const STORAGE_KEY = "ipc.theme";
/** Lets one toggle notify any other mounted instance in the same document. */
const CHANGE_EVENT = "ipc:themechange";

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onStoreChange);
  // `storage` covers the same site open in another tab.
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    media.removeEventListener("change", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function getSnapshot(): Choice {
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Private-mode Safari throws on access; fall through to the OS preference.
  }
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** The server cannot know the visitor's choice, and must not guess. */
function getServerSnapshot(): Choice | null {
  return null;
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const apply = (next: Choice) => {
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not remembered, but still applied for this page view.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  // Reserve the box so the header does not reflow when the icon resolves.
  if (theme === null) {
    return (
      <span aria-hidden="true" className={`inline-block size-11 shrink-0 ${className}`} />
    );
  }

  const next: Choice = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => apply(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`grid size-11 shrink-0 place-items-center rounded-xs border border-line text-content-muted transition-colors duration-300 hover:border-line-strong hover:text-content ${className}`}
    >
      {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
    </button>
  );
}
