import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CheckoutCards from "@/components/CheckoutCards";

const DESCRIPTION =
  "Choose a transfer consulting package — essay and application review, a strategy session, or a full end-to-end application partnership. Secure checkout by Stripe.";

/*
 * Unlisted by design. This page is only ever reached by a link sent directly
 * to someone who already completed the free assessment — it is deliberately
 * absent from the nav, the sitemap, and every internal link.
 *
 * `noindex` is the authoritative signal that keeps it out of search results.
 * Note we intentionally do NOT add a /pricing rule to robots.txt: blocking
 * the crawl would stop Google from ever reading this noindex, which is what
 * actually gets the page dropped if the URL is ever shared publicly.
 */
export const metadata: Metadata = {
  title: "Consulting Packages & Pricing",
  description: DESCRIPTION,
  /* Self-referencing — without this the root layout's "/" canonical leaks in
     and wrongly declares this page a duplicate of the homepage. */
  alternates: {
    canonical: "/pricing",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function PricingPage() {
  return (
    <>
      <Nav />

      <main className="pt-16">
        <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 sm:pb-28">
          <header className="pb-10 pt-12 sm:pt-16">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
              Consulting packages
            </p>
            <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
              Pick the help you need.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-500">
              Flat pricing, no subscriptions. Every tier is one-on-one work with
              a recent successful ECE transfer to UT Austin. Pay securely below
              and I&apos;ll be in touch within 24 hours to begin.
            </p>
          </header>

          <CheckoutCards />
        </div>
      </main>

      <Footer />
    </>
  );
}
