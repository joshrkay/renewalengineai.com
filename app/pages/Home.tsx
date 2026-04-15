import { Hero } from "../components/Hero";
import { PainPoints } from "../components/PainPoints";
import { Features } from "../components/Features";
import { Benefits } from "../components/Benefits";
import { HowItWorks } from "../components/HowItWorks";
import { Pricing } from "../components/Pricing";
import { CTA } from "../components/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <PainPoints />
      <Features />
      <Benefits />
      <HowItWorks />
      <Pricing />
      <CTA />
    </main>
  );
}
