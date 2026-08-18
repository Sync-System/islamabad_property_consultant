"use client";

import { useEffect } from "react";
import {
  dataLayerAdapter,
  debugAdapter,
  metaPixelAdapter,
  registerAnalyticsAdapter,
  tiktokPixelAdapter,
  track,
} from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";

/**
 * Registers analytics adapters and captures session attribution on first paint.
 *
 * Adapters are all no-ops until the corresponding vendor script is present, so
 * this is safe to mount before any tag manager is installed — registering GTM,
 * Meta and TikTok later requires only adding their script, not editing code.
 */

interface AnalyticsProviderProps {
  /** Fires `project_view` once when a project page mounts. */
  projectSlug?: string;
  projectName?: string;
}

export function AnalyticsProvider({
  projectSlug,
  projectName,
}: AnalyticsProviderProps) {
  useEffect(() => {
    const unsubscribes = [
      registerAnalyticsAdapter(dataLayerAdapter),
      registerAnalyticsAdapter(metaPixelAdapter),
      registerAnalyticsAdapter(tiktokPixelAdapter),
      registerAnalyticsAdapter(debugAdapter),
    ];

    // First touch wins; this call is what persists UTMs for the session.
    const attribution = getAttribution();

    if (projectSlug) {
      track("project_view", { projectSlug, projectName }, attribution);
    }

    return () => unsubscribes.forEach((off) => off());
  }, [projectSlug, projectName]);

  return null;
}
