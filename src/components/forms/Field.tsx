"use client";

import { useId, type ReactNode, type SelectHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

/**
 * Form field primitives.
 *
 * Every field wires up its own label, description and error via generated ids,
 * so `aria-describedby` and `aria-invalid` can never drift out of sync with
 * what is rendered. Errors are announced politely rather than assertively —
 * a validation message should not interrupt someone mid-sentence.
 */

interface FieldShellProps {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: (ids: {
    id: string;
    describedBy: string | undefined;
    invalid: boolean;
  }) => ReactNode;
  className?: string;
}

export function Field({
  label,
  error,
  hint,
  optional,
  children,
  className = "",
}: FieldShellProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-3 text-[0.8125rem] font-medium text-ink-800"
      >
        <span>{label}</span>
        {optional && <span className="text-micro text-ink-500">Optional</span>}
      </label>

      {/* Helper text sits under the control, not between label and input:
          a hint on one field would otherwise push its input out of line with
          its neighbour in the same grid row. */}
      <div className="mt-2">{children({ id, describedBy, invalid: Boolean(error) })}</div>

      {hint && (
        <p id={hintId} className="mt-1.5 text-micro text-ink-500">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-micro text-danger-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/** Lets callers tag a control for focus-on-error without loosening the rest. */
interface DataAttrs {
  "data-field"?: string;
}

const CONTROL =
  "w-full min-h-12 border bg-paper-50 px-3.5 py-2.5 text-[0.9375rem] text-ink-900 " +
  "placeholder:text-ink-500 transition-colors duration-200 " +
  "focus:outline-none focus-visible:border-pine-600 focus-visible:ring-2 focus-visible:ring-pine-600/25 " +
  "aria-[invalid=true]:border-danger-500 aria-[invalid=true]:bg-danger-100/40";

export function TextInput({
  invalid,
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & DataAttrs & { invalid?: boolean }) {
  return (
    <input
      {...rest}
      aria-invalid={invalid || undefined}
      className={`${CONTROL} ${invalid ? "border-danger-500" : "border-ink-900/20"} ${className}`}
    />
  );
}

export function TextArea({
  invalid,
  className = "",
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & DataAttrs & { invalid?: boolean }) {
  return (
    <textarea
      {...rest}
      aria-invalid={invalid || undefined}
      className={`${CONTROL} min-h-28 resize-y ${invalid ? "border-danger-500" : "border-ink-900/20"} ${className}`}
    />
  );
}

export function Select({
  invalid,
  className = "",
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & DataAttrs & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select
        {...rest}
        aria-invalid={invalid || undefined}
        className={`${CONTROL} appearance-none pr-10 ${invalid ? "border-danger-500" : "border-ink-900/20"} ${className}`}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/**
 * Honeypot. Visually and semantically hidden from people, reachable by bots.
 * `aria-hidden` plus `tabIndex={-1}` keeps it out of the accessibility tree and
 * the tab order, so it costs a real visitor nothing.
 */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="company-website">Company website</label>
      <input
        id="company-website"
        name="company-website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
