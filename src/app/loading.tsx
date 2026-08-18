/**
 * Route loading state.
 *
 * A calm skeleton that mirrors the hero's proportions, so the transition into a
 * loaded page is a fade rather than a jump. No spinner: a spinner tells the
 * visitor nothing except that they are waiting.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[100svh] flex-col justify-end bg-ink-950 px-gutter pb-16 sm:px-8 lg:px-12"
    >
      <span className="sr-only">Loading</span>
      <div className="mx-auto w-full max-w-wide">
        <div className="h-2.5 w-40 bg-paper-50/10" />
        <div className="mt-8 h-16 w-full max-w-2xl bg-paper-50/8 sm:h-24" />
        <div className="mt-6 h-4 w-full max-w-md bg-paper-50/6" />
        <div className="mt-3 h-4 w-full max-w-sm bg-paper-50/6" />
        <div className="mt-10 flex gap-3">
          <div className="h-14 w-56 bg-paper-50/10" />
          <div className="hidden h-14 w-44 bg-paper-50/6 sm:block" />
        </div>
      </div>
    </div>
  );
}
