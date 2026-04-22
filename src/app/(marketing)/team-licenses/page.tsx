import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { BookAuditButton } from "@/components/courses/BookAuditButton";

export const metadata: Metadata = {
  title: "Agency Team Licenses | RenewalEngineAI",
  description:
    "Multi-seat access to the full RenewalEngineAI course library for agencies with 3 to 50 seats. Bulk enrollment, shared playbooks, and live onboarding.",
  alternates: { canonical: "https://renewalengineai.com/team-licenses" },
};

const includes = [
  "Multi-seat access to all DIY courses (Retention, Bootcamp, and all future releases)",
  "Bulk enrollment via a single admin dashboard",
  "Shared agency playbook workspace for SOPs, prompts, and templates",
  "One 60-minute onboarding session for your team",
  "Quarterly check-ins with the instructor",
  "Priority access to new mastermind cohorts",
];

export default function TeamLicensesPage() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-black">
        <Header />
        <main className="bg-black text-white min-h-screen pt-32 pb-24">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <Link
              href="/courses"
              className="inline-block text-blue-500 font-semibold mb-8 hover:text-blue-400"
            >
              ← All courses
            </Link>

            <div className="mb-16 max-w-3xl">
              <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-4">
                For multi-person agencies
              </p>
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                Agency Team Licenses
              </h1>
              <p className="text-xl text-neutral-300 mb-8">
                When one person learns AI, one person benefits. When your whole
                team learns AI, your whole agency gets faster. Team licenses
                give every producer and CSR access to the full course library at
                a price that makes sense for agencies with 3 to 50 seats.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black text-white">
                  Custom pricing
                </span>
                <span className="text-neutral-400 text-sm">
                  Based on seat count
                </span>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 mb-12">
              <h2 className="text-2xl font-black mb-6">What&apos;s included</h2>
              <ul className="space-y-4">
                {includes.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 text-neutral-300"
                  >
                    <span className="text-blue-500 font-bold mt-0.5">✓</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center">
              <h3 className="text-3xl font-black mb-4">
                Tell us about your team
              </h3>
              <p className="text-neutral-300 mb-8 max-w-2xl mx-auto">
                Team licenses are priced on seat count, agency size, and whether
                you want live onboarding. Book a 15-minute call and we&apos;ll
                put together a proposal within a day.
              </p>
              <BookAuditButton
                label="Request a team quote"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-8 py-4 transition-colors"
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
