import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Checkout canceled",
  robots: { index: false, follow: false },
};

/** Where Stripe sends the buyer if they back out of the hosted checkout. */
export default function CheckoutCancelPage() {
  return (
    <>
      <Nav />

      <main className="pt-16">
        <div className="mx-auto max-w-2xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
            Checkout canceled
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            No charge was made.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-500">
            You closed out before finishing, and nothing was billed. Whenever
            you&apos;re ready, the packages are right where you left them — or
            email me at{" "}
            <a
              href="mailto:iansendelbach@gmail.com"
              className="text-plum-600 underline underline-offset-4"
            >
              iansendelbach@gmail.com
            </a>{" "}
            if you have questions first.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="rounded-sm bg-plum-600 px-5 py-3 font-mono text-sm font-medium text-cream-50 transition-colors hover:bg-plum-500"
            >
              Back to packages
            </Link>
            <Link
              href="/"
              className="rounded-sm border border-line px-5 py-3 font-mono text-sm font-medium text-ink-900 transition-colors hover:border-plum-400 hover:text-plum-600"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
