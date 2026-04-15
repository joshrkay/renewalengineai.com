import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { BookAuditButton } from "@/components/courses/BookAuditButton";

export const metadata: Metadata = {
  title: "AI Mastermind & Community | RenewalEngineAI",
  description:
    "Ongoing membership for insurance agents running AI in production — monthly live calls, an evolving prompt library, and a private peer community.",
  alternates: { canonical: "https://renewalengineai.com/mastermind" },
};

const features = [
  {
    title: "Monthly live calls",
    body: "Two live working sessions each month with the instructor and a small group of agency owners. Bring your real workflow, get real feedback.",
  },
  {
    title: "Evolving prompt library",
    body: "Every new prompt we develop internally lands in the member library. Classifiers, drafters, extractors, risk flaggers — all tested, all ready to copy.",
  },
  {
    title: "Peer community",
    body: "A private space to ask questions, share wins, and compare notes with other independent agents who are actually running AI in their book.",
  },
  {
    title: "Early access",
    body: "New courses, templates, and playbooks drop to mastermind members weeks before the public gets them.",
  },
];

export default function MastermindPage() {
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
                Ongoing membership
              </p>
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                AI Mastermind &amp; Community
              </h1>
              <p className="text-xl text-neutral-300 mb-8">
                The course ends. The work doesn&apos;t. The Mastermind is where
                agency owners keep sharpening their AI operating system month
                after month, together.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black text-white">
                  $97 – $197 / month
                </span>
                <span className="text-neutral-400 text-sm">Cancel anytime</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8"
                >
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center">
              <h3 className="text-3xl font-black mb-4">Who this is for</h3>
              <p className="text-neutral-300 mb-8 max-w-2xl mx-auto">
                Best fit for agency owners who have completed at least one of
                the DIY courses and want to stay in a room with people doing the
                same work. Not for passive consumption — mastermind members show
                up.
              </p>
              <BookAuditButton
                label="Request an invite"
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
