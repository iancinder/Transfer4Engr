import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AssessmentForm from "@/components/AssessmentForm";

export const metadata: Metadata = {
  title: "Free Engineering Transfer Assessment | Transfer4Engr",
  description:
    "Find out how competitive you are for an engineering transfer. Free assessment reviewed personally by a recent successful ECE transfer to UT Austin — honest reply by email within 48 hours, no automated scoring.",
};

export default function AssessmentPage() {
  return (
    <>
      <Nav />

      <main className="pt-16">
        <div className="mx-auto max-w-2xl px-4 pb-20 sm:px-6 sm:pb-28">
          {/* Page framing — kept tight; the form is the point. */}
          <header className="pb-10 pt-12 sm:pt-16">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
              Free transfer assessment
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
              Am I competitive?
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              Tell me where you stand and I&apos;ll give you an honest read on
              your chances — free. I&apos;m a recent successful ECE transfer to
              UT Austin, and I review every submission personally; there&apos;s
              no automated scoring. You&apos;ll hear back by email within 48
              hours.
            </p>
          </header>

          <AssessmentForm />
        </div>
      </main>

      <Footer />
    </>
  );
}
