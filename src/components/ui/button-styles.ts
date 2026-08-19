/**
 * Button styling, expressed once.
 *
 * A plain function rather than a component so server components, client
 * components, `<a>`, `<button>` and `<Link>` can all share it without a
 * wrapper. Variants are named for their role in the conversion hierarchy, not
 * for their colour — `whatsapp` is always the dominant action on any screen.
 *
 * There is no longer an "inverse" variant. Sections follow the theme rather
 * than being hard-coded dark, so `outline` already reads correctly on every
 * surface and a second variant would only be a way to get it wrong.
 */

export type ButtonVariant = "whatsapp" | "solid" | "outline" | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "group inline-flex items-center justify-center gap-2.5 font-sans font-semibold tracking-[0.01em] " +
  "transition-[background-color,color,border-color,transform,box-shadow] duration-300 ease-[var(--ease-out-quint)] " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-55 rounded-xs text-center";

const SIZES: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 text-[0.8125rem]",
  md: "min-h-12 px-6 text-[0.875rem]",
  lg: "min-h-[3.5rem] px-7 text-[0.9375rem] sm:px-9",
};

const VARIANTS: Record<ButtonVariant, string> = {
  // The conversion action. Recognisably WhatsApp, deepened so it sits inside
  // the palette rather than shouting over it.
  whatsapp:
    "bg-wa-600 text-white hover:bg-wa-700 shadow-[0_1px_2px_rgba(8,11,10,0.12)] hover:shadow-raise",
  // `solid` inverts against the page: dark on light, light on dark.
  solid: "bg-content text-surface hover:bg-accent hover:text-surface",
  outline:
    "border border-line-strong text-content hover:border-content hover:bg-content hover:text-surface",
  ghost: "text-content hover:bg-content/8",
};

export function buttonClass(
  variant: ButtonVariant = "solid",
  size: ButtonSize = "md",
  extra = "",
): string {
  return [BASE, SIZES[size], VARIANTS[variant], extra].filter(Boolean).join(" ");
}
