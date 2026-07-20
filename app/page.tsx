import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import About from "@/components/About";
import AssessmentForm from "@/components/AssessmentForm";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

/*
 * Hidden sections — restore by re-importing and dropping back into <main>:
 *   import Pricing from "@/components/Pricing";
 *   import Faq from "@/components/Faq";
 *   import Questionnaire from "@/components/Questionnaire";
 */

export default function Home() {
  return (
    <>
      <Nav />

      <main>
        <Hero />
        <HowItWorks />

        {/* Free assessment — the page's conversion element. */}
        <section
          id="assessment"
          className="border-t border-line bg-cream-100 py-20 sm:py-28"
        >
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
                Free transfer assessment
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                Am I competitive?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-500">
                Tell me where you stand and get an honest read on your chances
                — free, reviewed personally, reply by email within 48 hours. No
                automated scoring.
              </p>
            </Reveal>
            <div className="mt-10">
              <AssessmentForm />
            </div>
          </div>
        </section>

        <About />

        {/*
         * TESTIMONIALS PLACEHOLDER — intentionally renders nothing.
         * Transfer4Engr is new; do not fabricate social proof. When real
         * student outcomes exist, add a <Testimonials /> component here.
         */}
      </main>

      <Footer />
    </>
  );
}
