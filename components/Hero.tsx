"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Mono credential chips — real facts, no invented proof. */
const CHIPS = [
  "Transferred into UT Austin ECE",
  "4.00 engineering GPA",
  "One year, start to finish",
];

/**
 * Hero: flat, left-aligned, type-driven opener with the primary CTA and a
 * single squiggle rule as the only ornament.
 */
export default function Hero() {
  const reduceMotion = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.21, 0.65, 0.36, 1] as const },
  });

  return (
    <section id="top" className="bg-cream-50 pt-16">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
        <motion.p
          {...rise(0)}
          className="font-mono text-xs uppercase tracking-[0.18em] text-ink-400"
        >
          Engineering transfer admissions — one-on-one
        </motion.p>

        <motion.h1
          {...rise(0.08)}
          className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-ink-900 sm:text-6xl"
        >
          Get into the engineering program{" "}
          <span className="text-plum-600">you actually want.</span>
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mt-6 max-w-2xl text-base leading-relaxed text-ink-500 sm:text-lg"
        >
          Going from a rejected profile to one that gets accepted to top 5 programs isn&apos;t anywhere
          near easy - but I know from lived experience that it&apos;s possible.
        </motion.p>

        {/* Credential chips, in the style of a spec sheet. */}
        <motion.ul {...rise(0.24)} className="mt-8 flex flex-wrap gap-2.5">
          {CHIPS.map((chip) => (
            <li
              key={chip}
              className="rounded-sm border border-line bg-cream-100 px-3 py-1.5 font-mono text-xs text-ink-700"
            >
              {chip}
            </li>
          ))}
        </motion.ul>

        <motion.div
          {...rise(0.32)}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <a
            href="#assessment"
            className="rounded-sm bg-plum-600 px-6 py-3.5 text-center font-mono text-sm font-medium text-cream-50 transition-colors hover:bg-plum-500"
          >
            Get my free assessment
          </a>
          <a
            href="#how-it-works"
            className="rounded-sm border border-line px-6 py-3.5 text-center font-mono text-sm text-ink-700 transition-colors hover:border-plum-400 hover:text-plum-600"
          >
            See how it works
          </a>
        </motion.div>

        <motion.p {...rise(0.4)} className="mt-6 font-mono text-xs text-ink-400">
          ~2 min assessment. I&apos;ll tell you where I think you actually
          stand, and determine if you&apos;re a good fit to take on as a client.
        </motion.p>
      </div>
    </section>
  );
}
