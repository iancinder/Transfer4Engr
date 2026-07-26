import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getStripe } from "@/lib/stripe";

/*
 * Neutral title: this route also renders the "couldn't confirm" state, and a
 * static "Payment received" tab title would contradict the page body there.
 */
export const metadata: Metadata = {
  title: "Checkout",
  // A transient confirmation page — keep it out of search results.
  robots: { index: false, follow: false },
};

// Depends on request-time data (the session id), so never statically cached.
export const dynamic = "force-dynamic";

/**
 * Retrieves the Checkout Session named in the redirect and confirms it was
 * actually paid before showing a success message — the query param alone
 * isn't proof of payment.
 */
async function getPaidSession(sessionId: string | undefined) {
  if (!sessionId) return null;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return null;
    return session;
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const session = await getPaidSession(session_id);

  const email = session?.customer_details?.email ?? null;
  const amount =
    session?.amount_total != null
      ? `$${(session.amount_total / 100).toFixed(2)}`
      : null;

  return (
    <>
      <Nav />

      <main className="pt-16">
        <div className="mx-auto max-w-2xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
            {session ? "Payment received" : "Checkout"}
          </p>

          {session ? (
            <>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                You&apos;re all set — thank you.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-ink-500">
                {amount ? <>Your payment of {amount} went through. </> : null}
                I&apos;ll reach out{email ? <> at {email}</> : null} within 24
                hours to kick things off. Keep an eye on your inbox (and your
                spam folder, just in case).
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                We couldn&apos;t confirm this payment.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-ink-500">
                If you were charged, don&apos;t worry — email me at{" "}
                <a
                  href="mailto:iansendelbach@gmail.com"
                  className="text-plum-600 underline underline-offset-4"
                >
                  iansendelbach@gmail.com
                </a>{" "}
                and I&apos;ll sort it out right away. Otherwise you can head back
                and try again.
              </p>
            </>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-sm border border-line px-5 py-3 font-mono text-sm font-medium text-ink-900 transition-colors hover:border-plum-400 hover:text-plum-600"
            >
              Back to home
            </Link>
            {!session && (
              <Link
                href="/pricing"
                className="rounded-sm bg-plum-600 px-5 py-3 font-mono text-sm font-medium text-cream-50 transition-colors hover:bg-plum-500"
              >
                Back to packages
              </Link>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
