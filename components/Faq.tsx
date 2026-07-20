"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";

const FAQS = [
  {
    q: "Who is this for?",
    a: "Anyone in the US trying to transfer into an engineering program: community college students planning the jump to a four-year school, freshmen or sophomores at a university that isn't the right fit, and high schoolers already thinking a transfer might be part of their path. If you're aiming at an engineering major and a transfer application stands between you and it, this is for you.",
  },
  {
    q: "Do you work with any engineering major or school?",
    a: "Yes. The strategy behind a strong transfer — GPA narrative, course selection, meaningful extracurriculars, and a specific, honest essay — is the same whether you're aiming at mechanical engineering at a state flagship or computer engineering at a private school. My own transfer was into electrical and computer engineering, so that's where my knowledge runs deepest, but the process transfers (pun intended) to any engineering discipline and any US school.",
  },
  {
    q: "What do you actually deliver?",
    a: "It depends on the package. Essay Review & Revision gets you line-by-line edits on your essay drafts with written reasoning, across two revision rounds. Freshman-Year Transfer Strategy gets you a written semester-by-semester roadmap — courses, extracurriculars, positioning — plus a 1:1 Zoom call to walk through it. The Full Application Package covers everything: multiple review sessions and essay revisions across your entire application until you submit. In every case you get concrete written deliverables, not vague pep talks.",
  },
  {
    q: "How do sessions work — Zoom or async?",
    a: "Both, depending on the work. Strategy conversations happen over Zoom so we can talk through trade-offs in real time. Essay reviews are async — you send a draft, and I return detailed written feedback and edits, usually within a few days. Full Application Package clients get a mix of scheduled calls and async reviews on whatever cadence the deadlines demand.",
  },
  {
    q: "How far in advance should I start?",
    a: "Earlier than you think. If you're a freshman planning to transfer after your first year, the best time is your first semester — course selection and extracurricular choices you make now are the raw material of your application. For essay help specifically, 6–8 weeks before your deadline gives us room for real revision instead of a rushed pass. That said, if your deadline is close, reach out anyway; a focused week can still move an essay a lot.",
  },
  {
    q: "How do payments work?",
    a: "Simple flat rates — the price on the card is the whole price. After the questionnaire, Ian emails you to confirm fit and scope before anything is billed; you'll never be charged just for inquiring. Payment is handled by invoice before work begins. If it turns out you don't actually need a paid package, he'll tell you that too.",
  },
];

/** Accessible accordion: hairline-divided rows, no card chrome. */
export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <section id="faq" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
            FAQ
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            Questions, answered honestly.
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-medium text-ink-900 transition-colors hover:text-plum-600"
                  >
                    {faq.q}
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-mono text-sm text-plum-500"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-button-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.25,
                        ease: [0.21, 0.65, 0.36, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-8 text-sm leading-relaxed text-ink-500">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
