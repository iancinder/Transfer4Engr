import Reveal from "./Reveal";

const STEPS = [
  {
    title: "Tell me where you stand",
    body: "Fill out the two-minute assessment — your school, your target programs, your GPA, your story so far.",
  },
  {
    title: "Pick your package",
    body: "I reply by email with an honest read on your fit and which package (if any) makes sense. No pressure, no upsell.",
  },
  {
    title: "I build your strategy",
    body: "Coursework, extracurriculars, positioning, essays — a concrete plan built around what engineering admissions actually rewards.",
  },
  {
    title: "You submit a stronger application",
    body: "You hit submit knowing every piece — transcript narrative, activities, essays — is pulling in the same direction.",
  },
];

/** Four-step overview: flat bordered cards with mono step numbers. */
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
            How it works
          </p>
          <h2 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            From &ldquo;stuck here&rdquo; to acceptance letter, in four steps.
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <li className="h-full rounded-sm border border-line bg-cream-50 p-6 transition-colors hover:border-plum-400">
                <span
                  aria-hidden="true"
                  className="font-mono text-sm text-plum-500"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-semibold text-ink-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {step.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
