import { NextResponse } from "next/server";
import {
  hasErrors,
  looksAutomated,
  normaliseLead,
  validateLead,
  type LeadInput,
} from "@/lib/leads";

/**
 * Lead intake.
 *
 * This route is the seam between the frontend and whatever CRM the agency
 * eventually adopts. Today it validates, normalises and hands off to
 * `deliverLead()`; connecting Supabase, Google Sheets, HubSpot or the WhatsApp
 * Business API means editing that one function.
 *
 * The frontend does not depend on this succeeding — the WhatsApp hand-off runs
 * regardless — so a backend outage never costs the agency a conversation.
 */

export const runtime = "nodejs";
/** Lead intake is a write; it must never be cached or prerendered. */
export const dynamic = "force-dynamic";

/** Naive in-memory rate limit. Replace with a shared store behind a CDN. */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived server.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > RATE_LIMIT_MAX;
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function reference(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const noise = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `IPC-${stamp}-${noise}`;
}

/**
 * Delivery adapter.
 *
 * Deliberately a single function with a single responsibility. Add your
 * destination here — everything upstream already speaks `NormalisedLead`.
 */
async function deliverLead(
  lead: ReturnType<typeof normaliseLead> & { reference: string },
): Promise<void> {
  const webhook = process.env.LEAD_WEBHOOK_URL;

  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LEAD_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(lead),
    });
    return;
  }

  // No destination configured yet. Log a redacted line so the deployment shows
  // leads are arriving, without writing a phone number into a log aggregator.
  console.info(
    `[lead] ${lead.reference} kind=${lead.kind} project=${lead.projectSlug ?? "-"} cta=${lead.ctaLocation ?? "-"} source=${lead.attribution?.utm_source ?? "direct"}`,
  );
}

export async function POST(request: Request) {
  if (rateLimited(clientKey(request))) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  let body: Partial<LeadInput>;
  try {
    body = (await request.json()) as Partial<LeadInput>;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Answer bots with a success they cannot distinguish from the real thing.
  if (looksAutomated(body)) {
    return NextResponse.json({ reference: reference() }, { status: 202 });
  }

  const errors = validateLead(body);
  if (hasErrors(errors)) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const lead = { ...normaliseLead(body as LeadInput), reference: reference() };

  try {
    await deliverLead(lead);
  } catch (error) {
    // Never surface delivery internals to the client.
    console.error(
      `[lead] delivery failed for ${lead.reference}:`,
      error instanceof Error ? error.message : "unknown error",
    );
    return NextResponse.json(
      { error: "We could not save your details. Please message us on WhatsApp." },
      { status: 502 },
    );
  }

  return NextResponse.json({ reference: lead.reference }, { status: 201 });
}
