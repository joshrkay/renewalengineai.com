import { BookingProvider } from "./components/BookingContext";
import { CheckoutStatus } from "./components/CheckoutStatus";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { TrustBar } from "./components/TrustBar";
import { PainPoints } from "./components/PainPoints";
import { RenewalChallenges } from "./components/RenewalChallenges";
import { Features } from "./components/Features";
import { ProactiveVsReactive } from "./components/ProactiveVsReactive";
import { ServiceDetails } from "./components/ServiceDetails";
import { ComparisonTable } from "./components/ComparisonTable";
import { Benefits } from "./components/Benefits";
import { HowItWorks } from "./components/HowItWorks";
import { AuditDeepDive } from "./components/AuditDeepDive";
import { DetailedTimeline } from "./components/DetailedTimeline";
import { ROICalculator } from "./components/ROICalculator";
import { Pricing } from "./components/Pricing";
import { FAQ } from "./components/FAQ";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-white">
        <CheckoutStatus />
        <Header />
        <main>
          <Hero />
          <TrustBar />
          <PainPoints />
          <RenewalChallenges />
          <Features />
          <ProactiveVsReactive />
          <ServiceDetails />
          <ComparisonTable />
          <Benefits />
          <HowItWorks />
          <AuditDeepDive />
          <DetailedTimeline />
          <ROICalculator />
          <Pricing />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
