"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects/types";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import {
  AlertIcon,
  CloseIcon,
  ExpandIcon,
  MinusIcon,
  PlusIcon,
} from "@/components/ui/Icon";
import { getAttribution } from "@/lib/attribution";
import { track } from "@/lib/analytics";

/**
 * Master-plan viewer: pan, zoom, and a fullscreen dialog.
 *
 * Pointer Events cover mouse, touch and pen with one code path, so pinch-free
 * drag-to-pan works identically on a phone and a trackpad. Zoom is also on
 * buttons and on `+`/`-` keys, because pinch is not a keyboard gesture and a
 * viewer that only responds to pinch is inaccessible.
 *
 * The plan currently shown is our own indicative diagram, and the note above it
 * says so. We are not passing an illustration off as the developer's sheet.
 */

const MIN_SCALE = 1;
const MAX_SCALE = 4;

export function MasterPlanViewer({ project }: { project: Project }) {
  const masterPlan = project.masterPlan;
  const [fullscreen, setFullscreen] = useState(false);

  if (!masterPlan) return null;

  return (
    <Section id="master-plan" tone="ink" aria-labelledby="master-plan-title">
      <Container>
        <SectionHeader
          eyebrow="Master plan"
          title="Read the site before you choose a block"
          intro="Pan and zoom the plan, or open it fullscreen. Then tell us which part of the scheme interests you and we will confirm what is actually available there."
          id="master-plan-title"
          tone="dark"
          split
        />

        {masterPlan.note && (
          <Reveal delay={80}>
            <p className="mt-8 flex max-w-[70ch] items-start gap-3 border border-brass-400/25 bg-brass-400/8 p-5 text-body-sm text-paper-100/80">
              <AlertIcon size={19} className="mt-0.5 shrink-0 text-brass-300" />
              <span>{masterPlan.note}</span>
            </p>
          </Reveal>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal variant="mask" className="lg:col-span-8">
            <PlanCanvas
              project={project}
              onFullscreen={() => {
                setFullscreen(true);
                track(
                  "master_plan_open",
                  { ctaLocation: "master-plan", projectSlug: project.slug },
                  getAttribution(),
                );
              }}
            />
          </Reveal>

          <Reveal delay={140} className="lg:col-span-4">
            <div className="flex h-full flex-col justify-between gap-8 border border-paper-50/12 p-7">
              <div>
                <h3 className="eyebrow text-brass-300">Legend</h3>
                <ul className="mt-5 space-y-3.5">
                  {masterPlan.legend?.map((entry) => (
                    <li
                      key={entry.label}
                      className="flex items-center gap-3 text-body-sm text-paper-100/75"
                    >
                      <span
                        aria-hidden="true"
                        className="size-3 shrink-0 rounded-xs"
                        style={{ backgroundColor: entry.swatch }}
                      />
                      {entry.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-body-sm text-paper-100/65">
                  Block availability changes with each ballot. Ask us before you
                  commit to a location.
                </p>
                <WhatsAppLink
                  ctaLocation="master-plan"
                  projectName={project.name}
                  projectSlug={project.slug}
                  propertyPreference="Master plan — block availability"
                  size="lg"
                  className="mt-5 w-full"
                >
                  Ask about available locations
                </WhatsAppLink>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>

      {fullscreen && (
        <FullscreenPlan project={project} onClose={() => setFullscreen(false)} />
      )}
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function PlanCanvas({
  project,
  onFullscreen,
  tall = false,
}: {
  project: Project;
  onFullscreen?: () => void;
  tall?: boolean;
}) {
  const masterPlan = project.masterPlan!;
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const clampOffset = useCallback(
    (next: { x: number; y: number }, atScale: number) => {
      const frame = frameRef.current;
      if (!frame) return next;
      // Never let the image pull away from the frame edges.
      const maxX = (frame.clientWidth * (atScale - 1)) / 2;
      const maxY = (frame.clientHeight * (atScale - 1)) / 2;
      return {
        x: Math.max(-maxX, Math.min(maxX, next.x)),
        y: Math.max(-maxY, Math.min(maxY, next.y)),
      };
    },
    [],
  );

  const zoomTo = useCallback(
    (nextScale: number) => {
      const clamped = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
      setScale(clamped);
      setOffset((current) =>
        clamped === 1 ? { x: 0, y: 0 } : clampOffset(current, clamped),
      );
    },
    [clampOffset],
  );

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (scale === 1) return;
    (event.target as Element).setPointerCapture?.(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    setOffset(
      clampOffset(
        { x: drag.ox + (event.clientX - drag.x), y: drag.oy + (event.clientY - drag.y) },
        scale,
      ),
    );
  }

  function endDrag() {
    dragRef.current = null;
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = 40 / scale;
    switch (event.key) {
      case "+":
      case "=":
        event.preventDefault();
        zoomTo(scale + 0.5);
        break;
      case "-":
      case "_":
        event.preventDefault();
        zoomTo(scale - 0.5);
        break;
      case "0":
        event.preventDefault();
        zoomTo(1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        setOffset((o) => clampOffset({ x: o.x + step, y: o.y }, scale));
        break;
      case "ArrowRight":
        event.preventDefault();
        setOffset((o) => clampOffset({ x: o.x - step, y: o.y }, scale));
        break;
      case "ArrowUp":
        event.preventDefault();
        setOffset((o) => clampOffset({ x: o.x, y: o.y + step }, scale));
        break;
      case "ArrowDown":
        event.preventDefault();
        setOffset((o) => clampOffset({ x: o.x, y: o.y - step }, scale));
        break;
    }
  }

  return (
    <div className="relative">
      <div
        ref={frameRef}
        role="group"
        tabIndex={0}
        aria-label={`${project.shortName} master plan. Use plus and minus to zoom, arrow keys to pan, and zero to reset.`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        className={`relative overflow-hidden border border-paper-50/12 bg-ink-900 ${
          tall ? "h-[70vh]" : "aspect-[3/2]"
        } ${scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"} touch-pan-y`}
      >
        <div
          className="h-full w-full transition-transform duration-300 ease-[var(--ease-out-quint)]"
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
          }}
        >
          <ProjectMedia
            media={masterPlan.media}
            seed="master-plan"
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="h-full w-full"
            ratio={undefined}
          />
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
          <PlanButton
            label="Zoom out"
            onClick={() => zoomTo(scale - 0.5)}
            disabled={scale <= MIN_SCALE}
          >
            <MinusIcon size={18} />
          </PlanButton>
          <span className="tabular min-w-11 bg-ink-950/75 px-2 py-2 text-center text-[0.75rem] font-medium text-paper-100 backdrop-blur-sm">
            {scale.toFixed(1)}×
          </span>
          <PlanButton
            label="Zoom in"
            onClick={() => zoomTo(scale + 0.5)}
            disabled={scale >= MAX_SCALE}
          >
            <PlusIcon size={18} />
          </PlanButton>
          {onFullscreen && (
            <PlanButton label="Open fullscreen" onClick={onFullscreen}>
              <ExpandIcon size={18} />
            </PlanButton>
          )}
        </div>
      </div>

      <p className="mt-3 text-micro text-paper-100/50">
        Drag to pan once zoomed. Keyboard: <kbd>+</kbd> / <kbd>−</kbd> to zoom,
        arrow keys to pan, <kbd>0</kbd> to reset.
      </p>
    </div>
  );
}

function PlanButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-10 place-items-center bg-ink-950/75 text-paper-100 backdrop-blur-sm transition-colors hover:bg-ink-950 disabled:opacity-35"
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */

function FullscreenPlan({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.shortName} master plan, fullscreen`}
      className="fixed inset-0 z-[70] flex flex-col bg-ink-950/97 p-4 backdrop-blur-sm sm:p-8"
    >
      <div className="flex items-center justify-between gap-4 pb-4">
        <p className="font-display text-h4 text-paper-50">
          {project.shortName} — master plan
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="grid size-11 place-items-center border border-paper-50/25 text-paper-50 transition-colors hover:bg-paper-50 hover:text-ink-900"
        >
          <CloseIcon size={20} />
          <span className="sr-only">Close fullscreen master plan</span>
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <PlanCanvas project={project} tall />
      </div>
    </div>
  );
}
