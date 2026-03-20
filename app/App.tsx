import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { TrustBar } from "./components/TrustBar";
import { PainPoints } from "./components/PainPoints";
import { Features } from "./components/Features";
import { ComparisonTable } from "./components/ComparisonTable";
import { Benefits } from "./components/Benefits";
import { HowItWorks } from "./components/HowItWorks";
import { ROICalculator } from "./components/ROICalculator";
import { Pricing } from "./components/Pricing";
import { FAQ } from "./components/FAQ";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <PainPoints />
        <Features />
        <ComparisonTable />
        <Benefits />
        <HowItWorks />
        <ROICalculator />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
