import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { SocialProof } from "./_components/social-proof";
import { ProblemSolution } from "./_components/problem-solution";
import { Benefits } from "./_components/benefits";
import { Testimonials } from "./_components/testimonials";
import { Faq } from "./_components/faq";
import { Location } from "./_components/location";
import { Contact } from "./_components/contact";
import { FinalCta } from "./_components/final-cta";
import { Footer } from "./_components/footer";

export default function SomaDentalPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <ProblemSolution />
        <Benefits />
        <Testimonials />
        <Faq />
        <Location />
        <Contact />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
