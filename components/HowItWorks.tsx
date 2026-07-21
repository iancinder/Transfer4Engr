import Reveal from "./Reveal";

const STEPS = [
  {
    title: "Tell me about your current standing",
    body: "Fill out the assessment below - I'll get back to you with an honest take on what's realistic.",
  },
  {
    title: "Pick your package",
    body: "I reply by email with an honest read on your fit and which package (if any) makes sense.",
  },
  {
    title: "Work with me",
    body: "Coursework, extracurriculars, essays, projects - I use my previous experience & connections to get your profile where it needs to be.",
  },
  {
    title: "You submit a stronger application",
    body: "I guarantee that after working with me, your application will not only be technically stronger, it will have what admission committees want.",
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
            A year of effort for the rest of your life.
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
