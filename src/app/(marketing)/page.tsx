import type { Metadata } from "next";
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
import { Testimonials } from "@/components/marketing/Testimonials";
import { Benefits } from "@/components/marketing/Benefits";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { AuditDeepDive } from "@/components/marketing/AuditDeepDive";
import { DetailedTimeline } from "@/components/marketing/DetailedTimeline";
import { ROICalculator } from "@/components/marketing/ROICalculator";
import { LeadMagnet } from "@/components/marketing/LeadMagnet";
import { Pricing } from "@/components/marketing/Pricing";
import { FAQ } from "@/components/marketing/FAQ";
import { CTA } from "@/components/marketing/CTA";
import { Footer } from "@/components/marketing/Footer";
import { faqJsonLd, homeFaqs } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "AI Automation for Insurance Agents | RenewalEngineAI",
  description:
    "RenewalEngineAI builds done-for-you AI automation for independent insurance agencies. Automate renewals, lead response, and quote follow-ups. 15-20% higher retention, 391% more lead conversions, sub-60-second response.",
  alternates: {
    canonical: "https://renewalengineai.com/",
  },
  keywords: [
    "AI automation for insurance agents",
    "insurance renewal automation",
    "done-for-you AI insurance agency",
    "insurance lead response automation",
    "AI for independent insurance agents",
    "insurance agency retention software",
    "Applied Epic AI automation",
    "HawkSoft AI automation",
    "EZLynx AI automation",
    "insurance agency workflow automation",
    "AI renewal campaigns insurance",
    "sub 60 second lead response insurance",
    "insurance renewal retention lift",
  ],
};

export default function HomePage() {
  return (
    <BookingProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(homeFaqs)) }}
      />
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
          <Testimonials />
          <Benefits />
          <HowItWorks />
          <AuditDeepDive />
          <DetailedTimeline />
          <ROICalculator />
          <LeadMagnet />
          <Pricing />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
