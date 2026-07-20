"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  PACKAGE_FORM_OPTIONS,
  PACKAGE_SELECT_EVENT,
} from "@/lib/packages";
import {
  EMAIL_RE,
  WEB3FORMS_KEY,
  RadioGroup,
  inputClass,
  makeSlideVariants,
} from "./form-ui";
import Reveal from "./Reveal";

/* ------------------------------------------------------------------ */
/* Types & constants                                                   */
/* ------------------------------------------------------------------ */

interface Answers {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pkg: string;
  currentSituation: string;
  currentSituationOther: string;
  targetSchools: string;
  major: string;
  gpa: string;
  extracurriculars: string;
  challenge: string;
}

const EMPTY_ANSWERS: Answers = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  pkg: "",
  currentSituation: "",
  currentSituationOther: "",
  targetSchools: "",
  major: "",
  gpa: "",
  extracurriculars: "",
  challenge: "",
};

const SITUATION_OPTIONS = [
  "Community college",
  "A 4-year university",
  "High school",
  "Other",
];

type SubmitStatus = "idle" | "submitting" | "success" | "error";

/* ------------------------------------------------------------------ */
/* Slide definitions                                                   */
/*                                                                     */
/* Each slide validates itself; `validate` returns an error message or */
/* null. The final entry is the review/submit slide.                   */
/* ------------------------------------------------------------------ */

interface Slide {
  id: string;
  eyebrow: string;
  title: string;
  optional?: boolean;
  validate: (a: Answers) => string | null;
}

const SLIDES: Slide[] = [
  {
    id: "name",
    eyebrow: "First things first",
    title: "What's your name?",
    validate: (a) =>
      a.firstName.trim() && a.lastName.trim()
        ? null
        : "Please enter your first and last name.",
  },
  {
    id: "email",
    eyebrow: "Contact",
    title: "What's your email?",
    validate: (a) =>
      EMAIL_RE.test(a.email.trim())
        ? null
        : "Please enter a valid email — it's how I'll reply to you.",
  },
  {
    id: "phone",
    eyebrow: "Contact",
    title: "Phone or preferred contact method?",
    optional: true,
    validate: () => null,
  },
  {
    id: "package",
    eyebrow: "Services",
    title: "Which package are you interested in?",
    validate: (a) => (a.pkg ? null : "Pick one — “Not sure yet” is fine."),
  },
  {
    id: "situation",
    eyebrow: "Your background",
    title: "Where are you right now?",
    validate: (a) => {
      if (!a.currentSituation) return "Pick the closest match.";
      if (a.currentSituation === "Other" && !a.currentSituationOther.trim())
        return "Tell us a little about your situation.";
      return null;
    },
  },
  {
    id: "targets",
    eyebrow: "Your goal",
    title: "Which school(s) do you want to transfer into?",
    validate: (a) =>
      a.targetSchools.trim() ? null : "List at least one target school.",
  },
  {
    id: "major",
    eyebrow: "Your goal",
    title: "What engineering major are you aiming for?",
    validate: (a) =>
      a.major.trim() ? null : "Enter your intended major (best guess is fine).",
  },
  {
    id: "gpa",
    eyebrow: "Your background",
    title: "What's your current GPA?",
    validate: (a) =>
      a.gpa.trim() ? null : "Enter your GPA — an estimate is fine.",
  },
  {
    id: "extracurriculars",
    eyebrow: "Your background",
    title: "What are you involved in outside of class?",
    validate: (a) =>
      a.extracurriculars.trim()
        ? null
        : "A sentence or two is plenty — “nothing yet” is a valid answer too.",
  },
  {
    id: "challenge",
    eyebrow: "Almost done",
    title: "What's your biggest challenge?",
    optional: true,
    validate: () => null,
  },
  {
    id: "review",
    eyebrow: "Review",
    title: "Does everything look right?",
    validate: () => null,
  },
];

const REVIEW_INDEX = SLIDES.length - 1;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function Questionnaire() {
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  /** Honeypot — real users never fill this. */
  const [botcheck, setBotcheck] = useState("");
  const reduceMotion = useReducedMotion();
  const slideRegionRef = useRef<HTMLDivElement>(null);

  const set = useCallback(
    <K extends keyof Answers>(key: K, value: Answers[K]) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
      setError(null);
    },
    []
  );

  /* Pre-select a package when a pricing card is clicked. */
  useEffect(() => {
    const onSelect = (e: Event) => {
      const name = (e as CustomEvent<string>).detail;
      setAnswers((prev) => ({ ...prev, pkg: name }));
    };
    window.addEventListener(PACKAGE_SELECT_EVENT, onSelect);
    return () => window.removeEventListener(PACKAGE_SELECT_EVENT, onSelect);
  }, []);

  const goTo = (next: number, dir: number) => {
    setDirection(dir);
    setStep(next);
    setError(null);
    // Move focus to the slide region so keyboard/screen-reader users
    // land on the new question.
    requestAnimationFrame(() => slideRegionRef.current?.focus());
  };

  const handleNext = () => {
    const message = SLIDES[step].validate(answers);
    if (message) {
      setError(message);
      return;
    }
    if (step < REVIEW_INDEX) goTo(step + 1, 1);
  };

  const handleBack = () => {
    if (step > 0) goTo(step - 1, -1);
  };

  /* ---------------- Submission (Web3Forms) ----------------------- */

  const handleSubmit = async () => {
    setStatus("submitting");
    setError(null);

    const situation =
      answers.currentSituation === "Other"
        ? `Other — ${answers.currentSituationOther.trim()}`
        : answers.currentSituation;

    const fullName = `${answers.firstName.trim()} ${answers.lastName.trim()}`;

    // Human-readable keys so the delivered email is easy to scan.
    const payload = {
      access_key: WEB3FORMS_KEY,
      subject: `New Transfer4Engr inquiry from ${fullName}`,
      from_name: "Transfer4Engr Website",
      botcheck,
      "Name": fullName,
      "Email": answers.email.trim(),
      "Phone / preferred contact": answers.phone.trim() || "(not provided)",
      "Package interested in": answers.pkg,
      "Current situation": situation,
      "Target school(s)": answers.targetSchools.trim(),
      "Intended engineering major": answers.major.trim(),
      "Current GPA": answers.gpa.trim(),
      "Extracurriculars / experience": answers.extracurriculars.trim(),
      "Biggest challenge / notes": answers.challenge.trim() || "(not provided)",
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
      } else {
        throw new Error(data.message ?? "Submission failed");
      }
    } catch {
      // Answers stay in state, so the user can simply retry.
      setStatus("error");
    }
  };

  /* Enter advances (except inside textareas, where Enter = newline). */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "TEXTAREA" || tag === "BUTTON") return;
    e.preventDefault();
    if (step === REVIEW_INDEX) handleSubmit();
    else handleNext();
  };

  const progress = ((step + 1) / SLIDES.length) * 100;
  const slide = SLIDES[step];

  const slideVariants = makeSlideVariants(!!reduceMotion);

  /* ---------------- Success / final states ----------------------- */

  if (status === "success") {
    return (
      <SectionShell>
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-xl rounded-sm border border-line bg-cream-50 p-10 text-center sm:p-14"
        >
          <p aria-hidden="true" className="font-mono text-2xl text-plum-500">
            ✓
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink-900">
            You&apos;re in the queue.
          </h3>
          <p className="mt-4 text-base leading-relaxed text-ink-500">
            Thanks, {answers.firstName.trim()} — I&apos;ll email you back at{" "}
            <strong className="font-mono text-sm font-medium text-plum-600">
              {answers.email.trim()}
            </strong>{" "}
            within a day or two with an honest read on your situation.
          </p>
        </motion.div>
      </SectionShell>
    );
  }

  /* ---------------- Main form ------------------------------------ */

  return (
    <SectionShell>
      <div
        className="mx-auto max-w-2xl overflow-hidden rounded-sm border border-line bg-cream-50"
        onKeyDown={onKeyDown}
      >
        {/* Progress bar */}
        <div
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={SLIDES.length}
          aria-label={`Question ${step + 1} of ${SLIDES.length}`}
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
            {String(step + 1).padStart(2, "0")} / {SLIDES.length}
            {slide.optional && (
              <span className="ml-3 rounded-sm border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-400">
                Optional
              </span>
            )}
          </p>

          {/* Slide viewport */}
          <div className="relative mt-4 min-h-[21rem]">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
              >
                <div ref={slideRegionRef} tabIndex={-1} className="outline-none">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-400">
                    {slide.eyebrow}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl">
                    {slide.title}
                  </h3>

                  <div className="mt-6">
                    <SlideFields
                      slideId={slide.id}
                      answers={answers}
                      set={set}
                      goToStep={(i) => goTo(i, i > step ? 1 : -1)}
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

          {/* Error / status messaging */}
          <div aria-live="polite" className="min-h-[1.5rem]">
            {error && (
              <p className="font-mono text-xs text-plum-500">{error}</p>
            )}
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

            {step < REVIEW_INDEX ? (
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
                {status === "submitting" ? "Sending…" : "Submit application"}
              </button>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

/* ------------------------------------------------------------------ */
/* Section wrapper (heading + background)                              */
/* ------------------------------------------------------------------ */

function SectionShell({ children }: { children: ReactNode }) {
  return (
    <section
      id="questionnaire"
      className="border-t border-line bg-cream-100 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <p className="text-center font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
            Start here
          </p>
          <h2 className="mt-4 text-center text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            Take this questionnaire to get started - I'll personally read it and give you an honest assessment.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-ink-500">
            About two minutes, one question at a time. I personally read
            every submission and reply via email.
          </p>
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Per-slide fields                                                    */
/* ------------------------------------------------------------------ */

function SlideFields({
  slideId,
  answers,
  set,
  goToStep,
}: {
  slideId: string;
  answers: Answers;
  set: <K extends keyof Answers>(key: K, value: Answers[K]) => void;
  goToStep: (index: number) => void;
}) {
  switch (slideId) {
    case "name":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block font-mono text-xs text-ink-700">
              First name
            </span>
            <input
              type="text"
              autoComplete="given-name"
              autoFocus
              value={answers.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              className={inputClass}
              placeholder="Alex"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-xs text-ink-700">
              Last name
            </span>
            <input
              type="text"
              autoComplete="family-name"
              value={answers.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              className={inputClass}
              placeholder="Rivera"
            />
          </label>
        </div>
      );

    case "email":
      return (
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs text-ink-700">
            Email address
          </span>
          <input
            type="email"
            autoComplete="email"
            autoFocus
            value={answers.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
          <span className="mt-2 block font-mono text-xs text-ink-400">
            This is where I&apos;ll reply — double-check the spelling.
          </span>
        </label>
      );

    case "phone":
      return (
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs text-ink-700">
            Phone number or preferred contact method
          </span>
          <input
            type="text"
            autoComplete="tel"
            autoFocus
            value={answers.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={inputClass}
            placeholder="(555) 123-4567, or “email is fine”"
          />
        </label>
      );

    case "package":
      return (
        <RadioGroup
          name="package"
          options={PACKAGE_FORM_OPTIONS}
          value={answers.pkg}
          onChange={(v) => set("pkg", v)}
        />
      );

    case "situation":
      return (
        <div className="space-y-4">
          <RadioGroup
            name="situation"
            options={SITUATION_OPTIONS}
            value={answers.currentSituation}
            onChange={(v) => set("currentSituation", v)}
          />
          {answers.currentSituation === "Other" && (
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs text-ink-700">
                Tell us more
              </span>
              <input
                type="text"
                autoFocus
                value={answers.currentSituationOther}
                onChange={(e) => set("currentSituationOther", e.target.value)}
                className={inputClass}
                placeholder="e.g. gap year, military, working full-time…"
              />
            </label>
          )}
        </div>
      );

    case "targets":
      return (
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs text-ink-700">
            Target school(s)
          </span>
          <input
            type="text"
            autoFocus
            value={answers.targetSchools}
            onChange={(e) => set("targetSchools", e.target.value)}
            className={inputClass}
            placeholder="e.g. UT Austin, Georgia Tech, Purdue"
          />
        </label>
      );

    case "major":
      return (
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs text-ink-700">
            Intended engineering major
          </span>
          <input
            type="text"
            autoFocus
            value={answers.major}
            onChange={(e) => set("major", e.target.value)}
            className={inputClass}
            placeholder="e.g. Electrical & Computer Engineering"
          />
        </label>
      );

    case "gpa":
      return (
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs text-ink-700">
            Current GPA
          </span>
          <input
            type="text"
            inputMode="decimal"
            autoFocus
            value={answers.gpa}
            onChange={(e) => set("gpa", e.target.value)}
            className={inputClass}
            placeholder="e.g. 3.85 (estimates are fine)"
          />
        </label>
      );

    case "extracurriculars":
      return (
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs text-ink-700">
            Extracurriculars &amp; experience — research, clubs, work, projects
          </span>
          <textarea
            rows={5}
            autoFocus
            value={answers.extracurriculars}
            onChange={(e) => set("extracurriculars", e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Whatever you've got — even “nothing yet, that's why I'm here” is useful."
          />
        </label>
      );

    case "challenge":
      return (
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs text-ink-700">
            Biggest challenge, or anything else I should know
          </span>
          <textarea
            rows={5}
            autoFocus
            value={answers.challenge}
            onChange={(e) => set("challenge", e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Deadlines you're worried about, a rough first semester, a story you're not sure how to tell…"
          />
        </label>
      );

    case "review": {
      const situation =
        answers.currentSituation === "Other"
          ? `Other — ${answers.currentSituationOther}`
          : answers.currentSituation;
      const rows: { label: string; value: string; slideIndex: number }[] = [
        {
          label: "Name",
          value: `${answers.firstName} ${answers.lastName}`,
          slideIndex: 0,
        },
        { label: "Email", value: answers.email, slideIndex: 1 },
        {
          label: "Phone / contact",
          value: answers.phone || "—",
          slideIndex: 2,
        },
        { label: "Package", value: answers.pkg, slideIndex: 3 },
        { label: "Current situation", value: situation, slideIndex: 4 },
        { label: "Target school(s)", value: answers.targetSchools, slideIndex: 5 },
        { label: "Intended major", value: answers.major, slideIndex: 6 },
        { label: "GPA", value: answers.gpa, slideIndex: 7 },
        {
          label: "Extracurriculars",
          value: answers.extracurriculars,
          slideIndex: 8,
        },
        {
          label: "Biggest challenge",
          value: answers.challenge || "—",
          slideIndex: 9,
        },
      ];
      return (
        <dl className="max-h-72 divide-y divide-line overflow-y-auto border border-line rounded-sm">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-start justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-400">
                  {row.label}
                </dt>
                <dd className="mt-0.5 whitespace-pre-wrap break-words text-sm text-ink-900">
                  {row.value}
                </dd>
              </div>
              <button
                type="button"
                onClick={() => goToStep(row.slideIndex)}
                className="shrink-0 font-mono text-xs text-plum-500 underline-offset-2 hover:underline"
                aria-label={`Edit ${row.label}`}
              >
                Edit
              </button>
            </div>
          ))}
        </dl>
      );
    }

    default:
      return null;
  }
}
