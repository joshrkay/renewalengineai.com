import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { PainPoints } from "./components/PainPoints";
import { Features } from "./components/Features";
import { Benefits } from "./components/Benefits";
import { HowItWorks } from "./components/HowItWorks";
import { Pricing } from "./components/Pricing";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <PainPoints />
        <Features />
        <Benefits />
        <HowItWorks />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}