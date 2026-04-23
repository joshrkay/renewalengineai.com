import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How RenewalEngineAI collects, uses, and protects information from visitors and customers.",
  alternates: { canonical: "https://renewalengineai.com/privacy" },
};

const lastUpdated = "April 23, 2026";

export default function PrivacyPage() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-black">
        <Header />
        <main className="bg-black text-white min-h-screen pt-32 pb-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm text-neutral-500 mb-12">
              Last updated: {lastUpdated}
            </p>

            <div className="prose prose-invert max-w-none space-y-8 text-neutral-300 leading-relaxed">
              <section>
                <h2 className="text-2xl font-black text-white mb-3">Overview</h2>
                <p>
                  RenewalEngineAI (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                  &ldquo;our&rdquo;) operates renewalengineai.com and provides
                  AI automation services to independent insurance agencies. This
                  policy explains what information we collect, how we use it,
                  and the choices you have.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white mb-3">
                  Information we collect
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Contact information</strong> you submit through
                    forms (name, email, agency name, phone number).
                  </li>
                  <li>
                    <strong>Account information</strong> when you enroll in a
                    course or service (name, email, billing address, payment
                    details handled by Stripe).
                  </li>
                  <li>
                    <strong>Integration data</strong> you authorize us to access
                    from your AMS, CRM, email, or phone provider, used strictly
                    to operate your automations.
                  </li>
                  <li>
                    <strong>Usage data</strong> such as pages visited and
                    referrers, collected via lightweight analytics.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white mb-3">
                  How we use information
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To deliver the services you&rsquo;ve purchased.</li>
                  <li>
                    To communicate with you about onboarding, updates, and
                    support.
                  </li>
                  <li>
                    To improve our products, measure performance, and prevent
                    abuse.
                  </li>
                  <li>To comply with legal and tax obligations.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white mb-3">Sharing</h2>
                <p>
                  We do not sell personal information. We share data only with
                  vetted processors that help us run the service (e.g., Stripe
                  for payments, our email and hosting providers, and workflow
                  engines such as n8n and LangGraph) under contracts that
                  require appropriate safeguards.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white mb-3">
                  Security &amp; retention
                </h2>
                <p>
                  Integration credentials are encrypted at rest. We retain data
                  for as long as needed to provide the service and meet legal
                  obligations, then delete or anonymize it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white mb-3">
                  Your choices
                </h2>
                <p>
                  You can request access, correction, or deletion of your
                  information at any time by emailing{" "}
                  <a
                    className="text-blue-500 hover:text-blue-400"
                    href="mailto:hello@renewalengineai.com"
                  >
                    hello@renewalengineai.com
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white mb-3">Contact</h2>
                <p>
                  Questions about this policy? Email{" "}
                  <a
                    className="text-blue-500 hover:text-blue-400"
                    href="mailto:hello@renewalengineai.com"
                  >
                    hello@renewalengineai.com
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
