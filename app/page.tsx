import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import About from "@/components/About";
import Faq from "@/components/Faq";
import Questionnaire from "@/components/Questionnaire";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />

      <main>
        <Hero />
        <HowItWorks />
        <Pricing />
        <About />

        {/*
         * TESTIMONIALS PLACEHOLDER — intentionally renders nothing.
         * Transfer4Engr is new; do not fabricate social proof. When real
         * student outcomes exist, add a <Testimonials /> component here.
         */}

        <Faq />
        <Questionnaire />
      </main>

      <Footer />
    </>
  );
}
