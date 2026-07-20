"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  EMAIL_RE,
  WEB3FORMS_KEY,
  RadioGroup,
  SelectField,
  inputClass,
  fieldLabelClass,
  fieldErrorClass,
  makeSlideVariants,
} from "./form-ui";

/* ------------------------------------------------------------------ */
/* Types & constants                                                   */
/* ------------------------------------------------------------------ */

interface Answers {
  firstName: string;
  email: string;
  schoolType: string;
  targetSchools: string;
  major: string;
  cycle: string;
  gpa: string;
  creditHours: string;
  mathProgress: string;
  physicsProgress: string;
  reasoning: string;
  essayRating: string;
  schoolCount: string;
  extracurriculars: string;
}

const EMPTY_ANSWERS: Answers = {
  firstName: "",
  email: "",
  schoolType: "",
  targetSchools: "",
  major: "",
  cycle: "",
  gpa: "",
  creditHours: "",
  mathProgress: "",
  physicsProgress: "",
  reasoning: "",
  essayRating: "",
  schoolCount: "",
  extracurriculars: "",
};

const SCHOOL_TYPE_OPTIONS = [
  "Community college",
  "4-year university",
  "Other",
];

const CYCLE_OPTIONS = ["Spring 2027", "Fall 2027", "Fall 2028", "Not sure yet"];

const MATH_OPTIONS = [
  "Not started calculus",
  "Calc 1",
  "Calc 2",
  "Calc 3 / multivariable",
  "Differential equations or beyond",
];

const PHYSICS_OPTIONS = [
  "Not started",
  "Physics 1",
  "Physics 1 + 2",
  "Beyond intro sequence",
];

/** Refresh-proof draft storage. Session-scoped on purpose (no localStorage). */
const STORAGE_KEY = "t4e-assessment-draft";

type FieldErrors = Partial<Record<keyof Answers, string>>;
type SubmitStatus = "idle" | "submitting" | "success" | "error";

/* ------------------------------------------------------------------ */
/* Step definitions — each validates its own fields and returns        */
/* per-field inline error messages.                                    */
/* ------------------------------------------------------------------ */

interface Step {
  id: string;
  title: string;
  validate: (a: Answers) => FieldErrors;
}

const STEPS: Step[] = [
  {
    id: "about",
    title: "About you",
    validate: (a) => {
      const errors: FieldErrors = {};
      if (!a.firstName.trim()) errors.firstName = "Please enter your first name.";
      if (!EMAIL_RE.test(a.email.trim()))
        errors.email = "Please enter a valid email — it's how Ian will reply.";
      if (!a.schoolType) errors.schoolType = "Pick the closest match.";
      return errors;
    },
  },
  {
    id: "target",
    title: "Your target",
    validate: (a) => {
      const errors: FieldErrors = {};
      if (!a.targetSchools.trim())
        errors.targetSchools = "List at least one target school.";
      if (!a.major.trim())
        errors.major = "Enter your intended major (best guess is fine).";
      if (!a.cycle) errors.cycle = "Pick a cycle — “Not sure yet” is fine.";
      return errors;
    },
  },
  {
    id: "academics",
    title: "Academics",
    validate: (a) => {
      const errors: FieldErrors = {};
      if (!a.gpa.trim()) errors.gpa = "Enter your GPA — an estimate is fine.";
      const hours = Number(a.creditHours);
      if (!a.creditHours.trim() || !Number.isFinite(hours) || hours < 0)
        errors.creditHours = "Enter your expected credit hours as a number.";
      if (!a.mathProgress) errors.mathProgress = "Pick where you are in math.";
      if (!a.physicsProgress)
        errors.physicsProgress = "Pick where you are in physics.";
      return errors;
    },
  },
  {
    id: "context",
    title: "Context",
    validate: (a) => {
      const errors: FieldErrors = {};
      if (!a.reasoning.trim())
        errors.reasoning = "A couple of sentences is plenty.";
      const rating = Number(a.essayRating);
      if (
        !a.essayRating.trim() ||
        !Number.isFinite(rating) ||
        rating < 1 ||
        rating > 10
      )
        errors.essayRating = "Rate your essay(s) from 1 to 10.";
      const count = Number(a.schoolCount);
      if (!a.schoolCount.trim() || !Number.isFinite(count) || count < 1)
        errors.schoolCount = "Enter how many schools (a rough number is fine).";
      return errors;
    },
  },
  {
    id: "ecs",
    title: "Extracurriculars",
    validate: (a) => {
      const errors: FieldErrors = {};
      if (!a.extracurriculars.trim())
        errors.extracurriculars =
          "List whatever you have — “nothing yet” is a valid answer too.";
      return errors;
    },
  },
];

const LAST_INDEX = STEPS.length - 1;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function AssessmentForm() {
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  /** Honeypot — real users never fill this. */
  const [botcheck, setBotcheck] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const reduceMotion = useReducedMotion();
  const slideRegionRef = useRef<HTMLDivElement>(null);

  /* ---- sessionStorage persistence (survives refresh, not tabs) ---- */

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { answers?: Answers; step?: number };
        if (saved.answers)
          setAnswers({ ...EMPTY_ANSWERS, ...saved.answers });
        if (typeof saved.step === "number")
          setStep(Math.min(Math.max(saved.step, 0), LAST_INDEX));
      }
    } catch {
      // Corrupt draft — start fresh.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step }));
    } catch {
      // Storage full/unavailable — the form still works without drafts.
    }
  }, [answers, step, hydrated]);

  /* ---------------- Navigation ----------------------------------- */

  const set = useCallback(
    <K extends keyof Answers>(key: K, value: Answers[K]) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  const goTo = (next: number, dir: number) => {
    setDirection(dir);
    setStep(next);
    setErrors({});
    // Move focus to the slide region so keyboard/screen-reader users
    // land on the new step.
    requestAnimationFrame(() => slideRegionRef.current?.focus());
  };

  /** Validate the current step; returns true when it's OK to move on. */
  const validateStep = () => {
    const found = STEPS[step].validate(answers);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      // Focus the first offending field so the error is impossible to miss.
      requestAnimationFrame(() =>
        document.getElementById(`assessment-${firstInvalid}`)?.focus()
      );
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < LAST_INDEX) goTo(step + 1, 1);
  };

  const handleBack = () => {
    if (step > 0) goTo(step - 1, -1);
  };

  /* ---------------- Submission (Web3Forms) ----------------------- */

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setStatus("submitting");

    // Human-readable keys so the delivered email is easy to scan; the
    // subject prefix keeps assessments distinguishable from inquiries.
    const payload = {
      access_key: WEB3FORMS_KEY,
      subject: `ASSESSMENT: ${answers.firstName.trim()} → ${answers.targetSchools.trim()} (${answers.cycle})`,
      from_name: "Transfer4Engr Assessment",
      botcheck,
      "First name": answers.firstName.trim(),
      "Email": answers.email.trim(),
      "Current school type": answers.schoolType,
      "Target school(s)": answers.targetSchools.trim(),
      "Intended major": answers.major.trim(),
      "Application cycle": answers.cycle,
      "College GPA": answers.gpa.trim(),
      "Credit hours by application time": answers.creditHours.trim(),
      "Math progress": answers.mathProgress,
      "Physics progress": answers.physicsProgress,
      "Reason for transferring": answers.reasoning.trim(),
      "Self-rated essay (1-10)": answers.essayRating.trim(),
      "Number of schools applying to": answers.schoolCount.trim(),
      "Extracurriculars": answers.extracurriculars.trim(),
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          // Non-fatal.
        }
      } else {
        throw new Error(data.message ?? "Submission failed");
      }
    } catch {
      // Answers stay in state (and sessionStorage), so retry is painless.
      setStatus("error");
    }
  };

  /* Enter advances (except in textareas/selects where Enter has a job). */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "TEXTAREA" || tag === "BUTTON" || tag === "SELECT") return;
    e.preventDefault();
    if (step === LAST_INDEX) handleSubmit();
    else handleNext();
  };

  const progress = ((step + 1) / STEPS.length) * 100;
  const current = STEPS[step];
  const slideVariants = makeSlideVariants(!!reduceMotion);

  /* ---------------- Success state --------------------------------- */

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-sm border border-line bg-cream-50 p-10 text-center sm:p-14"
      >
        <p aria-hidden="true" className="font-mono text-2xl text-plum-500">
          ✓
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink-900">
          Thanks for your time, I&apos;ll get back to you
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-500">
          I review every submission myself — there&apos;s no automated scoring
          here. You&apos;ll hear back at{" "}
          <strong className="font-mono text-sm font-medium text-plum-600">
            {answers.email.trim()}
          </strong>{" "}
          within 48 hours with an honest read on where you stand.
        </p>
      </motion.div>
    );
  }

  /* ---------------- Main form ------------------------------------ */

  return (
    <div
      className="overflow-hidden rounded-sm border border-line bg-cream-50"
      onKeyDown={onKeyDown}
    >
      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
        aria-label={`Step ${step + 1} of ${STEPS.length}`}
        className="h-1 w-full bg-line"
      >
        <motion.div
          className="h-full bg-plum-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.35 }}
        />
      </div>

      <div className="p-6 sm:p-10">
        <p className="font-mono text-xs text-ink-400">
          {String(step + 1).padStart(2, "0")} / {STEPS.length}
        </p>

        {/* Slide viewport */}
        <div className="relative mt-4">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={current.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
            >
              <div ref={slideRegionRef} tabIndex={-1} className="outline-none">
                <h2 className="text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl">
                  {current.title}
                </h2>
                <div className="mt-6">
                  <StepFields
                    stepId={current.id}
                    answers={answers}
                    errors={errors}
                    set={set}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Honeypot: hidden from real users, tempting to bots. */}
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px"
          checked={botcheck !== ""}
          onChange={(e) => setBotcheck(e.target.checked ? "1" : "")}
        />

        {/* Submission error messaging (field errors render inline above) */}
        <div aria-live="polite" className="mt-6 min-h-[1.5rem]">
          {status === "error" && (
            <p className="font-mono text-xs text-plum-500">
              Something went wrong sending your answers — they&apos;re still
              saved here. Please try submitting again, or email{" "}
              <a href="mailto:iansendelbach@gmail.com" className="underline">
                iansendelbach@gmail.com
              </a>{" "}
              directly.
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0 || status === "submitting"}
            className="inline-flex items-center gap-2 rounded-sm border border-line px-5 py-2.5 font-mono text-sm text-ink-700 transition-colors hover:border-plum-400 hover:text-plum-600 disabled:pointer-events-none disabled:opacity-40"
          >
            <span aria-hidden="true">←</span> Back
          </button>

          {step < LAST_INDEX ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-sm bg-plum-600 px-6 py-2.5 font-mono text-sm font-medium text-cream-50 transition-colors hover:bg-plum-500"
            >
              Next <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={status === "submitting"}
              className="inline-flex items-center gap-2 rounded-sm bg-plum-600 px-6 py-2.5 font-mono text-sm font-medium text-cream-50 transition-colors hover:bg-plum-500 disabled:pointer-events-none disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Get my assessment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Field helpers                                                       */
/* ------------------------------------------------------------------ */

/** Text/number/textarea field with label + inline error wiring. */
function Field({
  name,
  label,
  error,
  hint,
  textarea,
  rows = 5,
  ...inputProps
}: {
  name: keyof Answers;
  label: string;
  error?: string;
  hint?: string;
  textarea?: boolean;
  rows?: number;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = `assessment-${name}`;
  const errorId = `${id}-error`;
  const shared = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: `${inputClass} ${textarea ? "resize-none" : ""} ${
      error ? "border-plum-500" : ""
    }`,
  };

  return (
    <div>
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      {textarea ? (
        <textarea rows={rows} {...shared} {...inputProps} />
      ) : (
        <input {...shared} {...inputProps} />
      )}
      {hint && !error && (
        <p className="mt-1.5 font-mono text-xs text-ink-400">{hint}</p>
      )}
      {error && (
        <p id={errorId} className={fieldErrorClass}>
          {error}
        </p>
      )}
    </div>
  );
}

function StepFields({
  stepId,
  answers,
  errors,
  set,
}: {
  stepId: string;
  answers: Answers;
  errors: FieldErrors;
  set: <K extends keyof Answers>(key: K, value: Answers[K]) => void;
}) {
  switch (stepId) {
    case "about":
      return (
        <div className="space-y-5">
          <Field
            name="firstName"
            label="First name"
            type="text"
            autoComplete="given-name"
            value={answers.firstName}
            onChange={(e) => set("firstName", e.currentTarget.value)}
            placeholder="Alex"
            error={errors.firstName}
          />
          <Field
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            value={answers.email}
            onChange={(e) => set("email", e.currentTarget.value)}
            placeholder="you@example.com"
            hint="This is where the assessment reply goes — double-check the spelling."
            error={errors.email}
          />
          <div>
            <p id="assessment-schoolType-label" className={fieldLabelClass}>
              Current school type
            </p>
            {/* id lets failed validation focus land on the group */}
            <div id="assessment-schoolType" tabIndex={-1} className="outline-none">
              <RadioGroup
                name="schoolType"
                options={SCHOOL_TYPE_OPTIONS}
                value={answers.schoolType}
                onChange={(v) => set("schoolType", v)}
              />
            </div>
            {errors.schoolType && (
              <p className={fieldErrorClass}>{errors.schoolType}</p>
            )}
          </div>
        </div>
      );

    case "target":
      return (
        <div className="space-y-5">
          <Field
            name="targetSchools"
            label="Target school(s)"
            type="text"
            value={answers.targetSchools}
            onChange={(e) => set("targetSchools", e.currentTarget.value)}
            placeholder="e.g., UT Austin"
            error={errors.targetSchools}
          />
          <Field
            name="major"
            label="Intended major"
            type="text"
            value={answers.major}
            onChange={(e) => set("major", e.currentTarget.value)}
            placeholder="e.g., Electrical & Computer Engineering"
            error={errors.major}
          />
          <SelectField
            id="assessment-cycle"
            label="Application cycle"
            value={answers.cycle}
            onChange={(v) => set("cycle", v)}
            options={CYCLE_OPTIONS}
            error={errors.cycle}
          />
        </div>
      );

    case "academics":
      return (
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              name="gpa"
              label="College GPA"
              type="text"
              inputMode="decimal"
              value={answers.gpa}
              onChange={(e) => set("gpa", e.currentTarget.value)}
              placeholder="e.g., 3.85"
              error={errors.gpa}
            />
            <Field
              name="creditHours"
              label="Credit hours by application time"
              type="number"
              min={0}
              inputMode="numeric"
              value={answers.creditHours}
              onChange={(e) => set("creditHours", e.currentTarget.value)}
              placeholder="e.g., 30"
              error={errors.creditHours}
            />
          </div>
          <SelectField
            id="assessment-mathProgress"
            label="Math progress"
            value={answers.mathProgress}
            onChange={(v) => set("mathProgress", v)}
            options={MATH_OPTIONS}
            error={errors.mathProgress}
          />
          <SelectField
            id="assessment-physicsProgress"
            label="Physics progress"
            value={answers.physicsProgress}
            onChange={(v) => set("physicsProgress", v)}
            options={PHYSICS_OPTIONS}
            error={errors.physicsProgress}
          />
        </div>
      );

    case "context":
      return (
        <div className="space-y-5">
          <Field
            name="reasoning"
            label="What's your reasoning for transferring?"
            textarea
            rows={4}
            value={answers.reasoning}
            onChange={(e) => set("reasoning", e.currentTarget.value)}
            placeholder="Wrong program fit, cost, opportunities you're missing…"
            error={errors.reasoning}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              name="essayRating"
              label="How good would you rate your essay(s), 1–10?"
              type="number"
              min={1}
              max={10}
              inputMode="numeric"
              value={answers.essayRating}
              onChange={(e) => set("essayRating", e.currentTarget.value)}
              placeholder="e.g., 6"
              error={errors.essayRating}
            />
            <Field
              name="schoolCount"
              label="How many schools are you applying to?"
              type="number"
              min={1}
              inputMode="numeric"
              value={answers.schoolCount}
              onChange={(e) => set("schoolCount", e.currentTarget.value)}
              placeholder="e.g., 4"
              error={errors.schoolCount}
            />
          </div>
        </div>
      );

    case "ecs":
      return (
        <Field
          name="extracurriculars"
          label="List your extracurriculars, with a short description of each"
          textarea
          rows={8}
          value={answers.extracurriculars}
          onChange={(e) => set("extracurriculars", e.currentTarget.value)}
          placeholder={
            "e.g.\nIEEE member — attend weekly meetings, helping with the spring project\nCampus job — 12 hrs/week at the library\nPersonal project — building a line-following robot"
          }
          error={errors.extracurriculars}
        />
      );

    default:
      return null;
  }
}
