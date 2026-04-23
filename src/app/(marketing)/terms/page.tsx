import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms that govern your use of renewalengineai.com, our courses, and our AI automation services.",
  alternates: { canonical: "https://renewalengineai.com/terms" },
};

const lastUpdated = "April 23, 2026";

export default function TermsPage() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-black">
        <Header />
        <main className="bg-black text-white min-h-screen pt-32 pb-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              Terms of Service
            </h1>
            <p className="text-sm text-neutral-500 mb-12">
              Last updated: {lastUpdated}
            </p>

            <div className="prose prose-invert max-w-none space-y-8 text-neutral-300 leading-relaxed">
              <section>
                <h2 className="text-2xl font-black text-white mb-3">
                  Acceptance of terms
                </h2>
                <p>
                  By accessing renewalengineai.com or purchasing a
                  RenewalEngineAI product or service, you agree to these Terms.
                  If you&rsquo;re agreeing on behalf of an agency, you represent
                  that you have the authority to bind that agency.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white mb-3">Services</h2>
                <p>
                  We offer audits, build-and-launch engagements, managed
                  operations, and self-paced courses. Scope and deliverables for
                  each are described on the relevant product page or statement
                  of work.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white mb-3">
                  Payment &amp; refunds
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payments are processed by Stripe.</li>
                  <li>
                    One-time fees (Audit, Build &amp; Launch, courses) are due
                    at checkout.
                  </li>
                  <li>
                    Managed Operations is billed monthly and may be cancelled
                    with 30 days&rsquo; notice.
                  </li>
                  <li>
                    Courses include a 30-day money-back guarantee if fewer than
                    50% of lessons have been viewed.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white mb-3">
                  Acceptable use
                </h2>
                <p>
                  You may not reverse engineer, resell, or redistribute course
                  content, prompts, or automations. You agree not to use our
                  services to send unlawful communications or violate
                  jurisdictional consumer-protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white mb-3">
                  Confidentiality
                </h2>
                <p>
                  We treat your agency data, book details, and integration
                  credentials as confidential and use them only to deliver the
                  service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white mb-3">
                  Limitation of liability
                </h2>
                <p>
                  To the extent permitted by law, our aggregate liability is
                  limited to the amounts you paid us in the 12 months preceding
                  the claim. We are not liable for lost profits, lost business,
                  or indirect damages.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white mb-3">Changes</h2>
                <p>
                  We may update these Terms from time to time. Material changes
                  will be announced by email or on this page. Continued use
                  after changes means you accept the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white mb-3">Contact</h2>
                <p>
                  Questions about these Terms? Email{" "}
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
