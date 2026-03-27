import { BookingProvider } from "@/components/marketing/BookingContext";
import { CheckoutStatus } from "@/components/marketing/CheckoutStatus";
import { Header } from "@/components/marketing/Header";
import { Hero } from "@/components/marketing/Hero";
import { TrustBar } from "@/components/marketing/TrustBar";
import { PainPoints } from "@/components/marketing/PainPoints";
import { RenewalChallenges } from "@/components/marketing/RenewalChallenges";
import { Features } from "@/components/marketing/Features";
import { ProactiveVsReactive } from "@/components/marketing/ProactiveVsReactive";
import { ServiceDetails } from "@/components/marketing/ServiceDetails";
import { ComparisonTable } from "@/components/marketing/ComparisonTable";
import { Benefits } from "@/components/marketing/Benefits";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { AuditDeepDive } from "@/components/marketing/AuditDeepDive";
import { DetailedTimeline } from "@/components/marketing/DetailedTimeline";
import { ROICalculator } from "@/components/marketing/ROICalculator";
import { Pricing } from "@/components/marketing/Pricing";
import { FAQ } from "@/components/marketing/FAQ";
import { CTA } from "@/components/marketing/CTA";
import { Footer } from "@/components/marketing/Footer";

export default function HomePage() {
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
