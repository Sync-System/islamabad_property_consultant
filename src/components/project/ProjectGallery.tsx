"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Media, Project } from "@/lib/projects/types";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { MediaCredit } from "@/components/media/MediaCredit";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { ArrowIcon, CloseIcon, ExpandIcon, InfoIcon } from "@/components/ui/Icon";
import { getAttribution } from "@/lib/attribution";
import { track } from "@/lib/analytics";

/**
 * Gallery with an accessible lightbox.
 *
 * Layout is CSS-column masonry. Each tile keeps the aspect ratio its media
 * declares and reserves that box before anything resolves, so the column
 * rhythm is varied without a single pixel of layout shift.
 *
 * The lightbox is a real dialog: focus moves in, `Tab` is trapped, `Escape`
 * closes, arrow keys and horizontal swipes move between images, and focus
 * returns to the tile that opened it.
 */

export function ProjectGallery({ project }: { project: Project }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const open = useCallback(
    (index: number) => {
      setOpenIndex(index);
      track(
        "gallery_open",
        { ctaLocation: "gallery", projectSlug: project.slug, index },
        getAttribution(),
      );
    },
    [project.slug],
  );

  const close = useCallback(() => {
    const index = openIndex;
    setOpenIndex(null);
    if (index !== null) {
      window.setTimeout(() => triggerRefs.current[index]?.focus(), 0);
    }
  }, [openIndex]);

  // Photography here is of Islamabad and the Margallas, licensed for reuse —
  // it is not photography of the project site, and the page must say so.
  const contextual = project.gallery.some((m) => m.src && m.credit);
  const illustrative = project.gallery.some((m) => !m.src);

  return (
    <Section id="gallery" tone="paper" aria-labelledby="gallery-title">
      <Container>
        <SectionHeader
          eyebrow="Gallery"
          title="The project, read visually"
          intro="Select any image to open it full-size. Use the arrow keys or swipe to move between them."
          id="gallery-title"
          split
        />

        {/* True masonry via CSS columns: tiles keep their own aspect ratios and
            stack without the dead space a fixed grid row would leave under the
            shorter ones. Tab order still follows the DOM. */}
        <ul className="mt-14 columns-2 gap-3 sm:gap-4 lg:columns-3 lg:gap-5">
          {project.gallery.map((media, index) => (
            <Reveal
              as="li"
              key={media.alt}
              delay={(index % 3) * 90}
              variant="mask"
              className="mb-3 break-inside-avoid sm:mb-4 lg:mb-5"
            >
              <button
                ref={(node) => {
                  triggerRefs.current[index] = node;
                }}
                type="button"
                onClick={() => open(index)}
                className="group relative block w-full overflow-hidden text-left"
                aria-label={`Open image ${index + 1} of ${project.gallery.length}: ${media.alt}`}
              >
                <ProjectMedia
                  media={media}
                  seed={`gal-${index}`}
                  sizes="(max-width: 640px) 48vw, (max-width: 1024px) 48vw, 31vw"
                  className="w-full transition-transform duration-[900ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-ink-950/0 transition-colors duration-500 group-hover:bg-ink-950/25"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-3 top-3 grid size-9 place-items-center bg-paper-50/0 text-paper-50 opacity-0 transition-all duration-400 group-hover:bg-ink-950/60 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <ExpandIcon size={17} />
                </span>
                {media.caption && (
                  <span className="mt-2.5 block text-micro text-content-subtle">
                    {media.caption}
                  </span>
                )}
                <MediaCredit media={media} className="mt-1" />
              </button>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={100} className="mt-10">
          <div className="flex flex-col gap-5 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
            {/* The copy lives in its own span: the paragraph is a flex
                container, so an inline element as a direct child would become
                a separate flex item and break the sentence into side-by-side
                columns. */}
            {(contextual || illustrative) && (
              <p className="flex max-w-[62ch] items-start gap-3 text-micro leading-relaxed text-content-subtle">
                <InfoIcon size={16} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  These are photographs of Islamabad and the Margalla Hills,
                  published under Creative Commons licences and credited
                  individually. They show the city and the range the project
                  sits in —{" "}
                  <strong className="font-semibold text-content">
                    they are not photographs of the Margalla Enclave site
                  </strong>
                  . We will publish site photography once we hold the rights to
                  it. Ask us for the developer&rsquo;s current imagery on
                  WhatsApp.
                </span>
              </p>
            )}
            <WhatsAppLink
              ctaLocation="gallery"
              projectName={project.name}
              projectSlug={project.slug}
              propertyPreference="Project imagery and site photographs"
              variant="outline"
              size="md"
              className="shrink-0"
            >
              Request current site photos
            </WhatsAppLink>
          </div>
        </Reveal>
      </Container>

      {openIndex !== null && (
        <Lightbox
          items={project.gallery}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={close}
        />
      )}
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function Lightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: Media[];
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => {
      onIndexChange((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndexChange],
  );

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          go(1);
          break;
        case "ArrowLeft":
          go(-1);
          break;
        case "Tab": {
          const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
            "button:not([disabled])",
          );
          if (!focusable?.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
          break;
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [go, onClose]);

  const media = items[index];

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Gallery image ${index + 1} of ${items.length}`}
      /* Deliberately dark in both themes: a lightbox exists to show photographs,
         and a white full-screen backdrop would wash them out. Everything inside
         therefore uses the fixed `paper-*` ramp, not the semantic tokens. */
      className="fixed inset-0 z-[70] flex flex-col bg-ink-950/97 backdrop-blur-sm"
      onTouchStart={(e) => {
        touchStart.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(delta) > 55) go(delta < 0 ? 1 : -1);
        touchStart.current = null;
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <p className="tabular text-[0.8125rem] text-paper-100/70">
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="grid size-11 place-items-center border border-paper-50/25 text-paper-50 transition-colors hover:bg-paper-50 hover:text-ink-950"
        >
          <CloseIcon size={20} />
          <span className="sr-only">Close gallery</span>
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-2 sm:px-8">
        <figure className="flex max-h-full w-full max-w-5xl flex-col">
          <ProjectMedia
            media={media}
            seed={`lb-${index}`}
            sizes="(max-width: 1024px) 92vw, 70vw"
            className="max-h-[68vh] w-full"
          />
          <figcaption className="mt-4 text-center text-body-sm text-paper-100/70">
            {media.caption ?? media.alt}
            <MediaCredit media={media} tone="dark" className="mt-1.5" />
          </figcaption>
        </figure>
      </div>

      <div className="flex items-center justify-center gap-3 px-4 pb-6 sm:pb-8">
        <button
          type="button"
          onClick={() => go(-1)}
          className="grid size-12 place-items-center border border-paper-50/25 text-paper-50 transition-colors hover:bg-paper-50 hover:text-ink-950"
        >
          <ArrowIcon size={20} className="rotate-180" />
          <span className="sr-only">Previous image</span>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="grid size-12 place-items-center border border-paper-50/25 text-paper-50 transition-colors hover:bg-paper-50 hover:text-ink-950"
        >
          <ArrowIcon size={20} />
          <span className="sr-only">Next image</span>
        </button>
      </div>
    </div>
  );
}
