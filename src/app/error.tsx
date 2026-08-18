"use client";

import { useEffect } from "react";
import { agencyConfig } from "@/lib/config/agency";
import { buttonClass } from "@/components/ui/button-styles";
import { WhatsAppIcon } from "@/components/ui/Icon";

/**
 * Route-level error boundary.
 *
 * The one thing that must survive a render failure is the ability to reach a
 * consultant, so the WhatsApp link here is a plain anchor with a static href —
 * no hooks, no attribution lookup, nothing that could fail a second time.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page render failed:", error.message, error.digest ?? "");
  }, [error]);

  return (
    <main
      id="main"
      className="flex min-h-[100svh] items-center justify-center bg-surface-feature px-gutter text-content"
    >
      <div className="max-w-lg text-center">
        <p className="eyebrow text-accent">Something went wrong</p>
        <h1 className="mt-6 text-h2 text-content">
          This page didn&rsquo;t load properly
        </h1>
        <p className="mx-auto mt-5 max-w-[42ch] text-body text-content-muted">
          Try again — and if it keeps happening, message us directly. We would
          rather answer your question on WhatsApp than have you wait on a page.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className={buttonClass("outline", "lg")}>
            Try again
          </button>
          <a
            href={agencyConfig.whatsappBaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("whatsapp", "lg")}
          >
            <WhatsAppIcon size={18} />
            Chat on WhatsApp
          </a>
        </div>

        {error.digest && (
          <p className="tabular mt-8 text-micro text-content-subtle">
            Reference {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
