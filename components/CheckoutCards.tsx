"use client";

import { useState } from "react";
import { PACKAGES } from "@/lib/packages";
import Reveal from "./Reveal";

/**
 * The three service tiers as checkout cards. Clicking a tier asks our own
 * /api/checkout route to create a Stripe Checkout Session, then hands the
 * browser off to Stripe's hosted payment page. Visually a sibling of the
 * marketing <Pricing /> cards, but wired to pay rather than to scroll.
 */
export default function CheckoutCards() {
  // Which tier is mid-request, so we can disable just that button.
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(packageId: string) {
    setError(null);
    setPendingId(packageId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      const data: { url?: string; error?: string } = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed.");
      }

      // Redirect to Stripe's hosted checkout.
      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setPendingId(null);
    }
  }

  return (
    <>
      <div className="grid items-stretch gap-4 lg:grid-cols-3">
        {PACKAGES.map((pkg, i) => {
          const isPending = pendingId === pkg.id;
          const disabled = pendingId !== null;

          return (
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
                      <span aria-hidden="true" className="font-mono text-plum-400">
                        —
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => startCheckout(pkg.id)}
                  disabled={disabled}
                  aria-busy={isPending}
                  className={`mt-8 w-full rounded-sm px-5 py-3 font-mono text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                    pkg.mostPopular
                      ? "bg-plum-600 text-cream-50 hover:bg-plum-500"
                      : "border border-line text-ink-900 hover:border-plum-400 hover:text-plum-600"
                  }`}
                >
                  {isPending ? "Redirecting…" : `Get started — ${pkg.price}`}
                </button>
              </article>
            </Reveal>
          );
        })}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-6 font-mono text-xs text-plum-600"
        >
          {error}
        </p>
      )}

      <p className="mt-8 font-mono text-xs text-ink-400">
        Payments are processed securely by Stripe. You&apos;ll get an email
        receipt, and I&apos;ll reach out within 24 hours to get started.
      </p>
    </>
  );
}
