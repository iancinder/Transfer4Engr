"use client";

import { PACKAGES, dispatchPackageSelect } from "@/lib/packages";
import Reveal from "./Reveal";

/**
 * Three service tiers as flat, bordered cards. Each card's CTA scrolls to
 * the questionnaire and pre-selects that package via a custom event the
 * form listens for.
 */
export default function Pricing() {
  const choosePackage = (packageName: string) => {
    dispatchPackageSelect(packageName);
    document
      .getElementById("questionnaire")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
            Services
          </p>
          <h2 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            Pick the help you need. Skip the rest.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-500">
            Flat pricing, no subscriptions, no packages you don&apos;t need.
            Every engagement starts with the same questionnaire so I can
            tell you honestly whether it&apos;s a fit.
          </p>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-3">
          {PACKAGES.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 0.08} className="h-full">
              <article
                className={`flex h-full flex-col rounded-sm border bg-cream-50 p-7 transition-colors ${
                  pkg.mostPopular
                    ? "border-plum-500"
                    : "border-line hover:border-plum-400"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-semibold text-ink-900">
                    {pkg.name}
                  </h3>
                  {pkg.mostPopular && (
                    <span className="shrink-0 rounded-sm bg-plum-600 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-cream-50">
                      Most popular
                    </span>
                  )}
                </div>

                <p className="mt-4 font-mono text-4xl font-medium tracking-tight text-plum-600">
                  {pkg.price}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">
                  {pkg.tagline}
                </p>

                <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6">
                  {pkg.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-sm leading-relaxed text-ink-700"
                    >
                      <span
                        aria-hidden="true"
                        className="font-mono text-plum-400"
                      >
                        —
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => choosePackage(pkg.name)}
                  className={`mt-8 w-full rounded-sm px-5 py-3 font-mono text-sm font-medium transition-colors ${
                    pkg.mostPopular
                      ? "bg-plum-600 text-cream-50 hover:bg-plum-500"
                      : "border border-line text-ink-900 hover:border-plum-400 hover:text-plum-600"
                  }`}
                >
                  Get started — {pkg.price}
                </button>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.16}>
          <p className="mt-8 font-mono text-xs text-ink-400">
            Not sure which fits? Start the questionnaire and pick &ldquo;Not
            sure yet&rdquo; — I&apos;ll recommend one (or tell you that you
            don&apos;t need any of them).
          </p>
        </Reveal>
      </div>
    </section>
  );
}
