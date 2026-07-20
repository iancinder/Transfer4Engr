"use client";

/**
 * Shared form primitives used by both the homepage Questionnaire and the
 * /assessment form, so the two stay visually identical.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
 * Web3Forms access key. Set NEXT_PUBLIC_WEB3FORMS_KEY in .env.local (and
 * in Vercel's environment settings for production). The placeholder below
 * makes it obvious what to swap in if the env var is missing.
 */
export const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "YOUR_WEB3FORMS_ACCESS_KEY_HERE";

export const inputClass =
  "w-full rounded-sm border border-line bg-cream-50 px-4 py-3 text-base text-ink-900 placeholder:text-ink-400/70 focus:border-plum-500";

export const fieldLabelClass = "mb-1.5 block font-mono text-xs text-ink-700";

export const fieldErrorClass = "mt-1.5 font-mono text-xs text-plum-500";

/** Directional slide-in/out used for step transitions. */
export function makeSlideVariants(reduceMotion: boolean) {
  return {
    enter: (dir: number) => ({
      x: reduceMotion ? 0 : dir * 48,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: reduceMotion ? 0 : dir * -48,
      opacity: 0,
    }),
  };
}

/* ------------------------------------------------------------------ */
/* Card-style radio group (native radios for keyboard & a11y)          */
/* ------------------------------------------------------------------ */

export function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="grid gap-2">
      {options.map((option) => {
        const selected = value === option;
        return (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 text-sm transition-colors ${
              selected
                ? "border-plum-500 bg-blossom-50 text-plum-700"
                : "border-line bg-cream-50 text-ink-700 hover:border-plum-400"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={selected}
              onChange={() => onChange(option)}
              className="h-4 w-4 accent-[#96395c]"
            />
            {option}
          </label>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Native select styled to match text inputs                           */
/* ------------------------------------------------------------------ */

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
  placeholder = "Select…",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  placeholder?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${inputClass} appearance-none ${
          value === "" ? "text-ink-400/70" : ""
        } ${error ? "border-plum-500" : ""}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className={fieldErrorClass}>
          {error}
        </p>
      )}
    </div>
  );
}
