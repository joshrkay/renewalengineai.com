import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { BookAuditButton } from "@/components/courses/BookAuditButton";

export const metadata: Metadata = {
  title: "How It Works — Audit, Build & Launch, Managed Ops",
  description:
    "The three-phase process we use to get AI automation live inside independent insurance agencies — a 5-day audit, a 2-3 week build & launch, and ongoing managed operations.",
  alternates: { canonical: "https://renewalengineai.com/how-it-works" },
  openGraph: {
    type: "website",
    url: "https://renewalengineai.com/how-it-works",
    title: "How RenewalEngineAI Works | RenewalEngineAI",
    description:
      "The three-phase process we use to get AI automation live inside independent insurance agencies.",
    siteName: "RenewalEngineAI",
  },
};

const phases = [
  {
    number: "01",
    title: "Audit — 5 days",
    kicker: "$1,500 flat. Fully credited if you continue with Build & Launch.",
    body: `A structured 5-day assessment of your renewal pipeline, lead-response workflow, quote follow-up, and AMS data integrity. We don't recommend anything we wouldn't run ourselves.

You walk away with a written roadmap of the exact automations we'd build (ordered by expected revenue impact), ROI projections grounded in your actual book size and commission structure, and a decision-ready proposal.`,
    deliverables: [
      "Renewal pipeline analysis and leak quantification",
      "Lead-response funnel audit across every inbound source",
      "Quote follow-up gap analysis",
      "AMS integration feasibility check (Applied Epic / HawkSoft / EZLynx)",
      "Custom automation roadmap with ROI projections",
      "Proposal tied to your specific retention and growth targets",
    ],
  },
  {
    number: "02",
    title: "Build & Launch — 2-3 weeks",
    kicker: "$6,000 one-time. Audit fee credited toward this.",
    body: `We build the specific automations from the roadmap and go live inside your environment. No generic CRM fill-in-the-blanks — these are workflows tuned to your book, your voice, your carriers.

By the end of week three, your agency is actively running AI renewal campaigns, instant lead response, and quote follow-up automation. Your team is trained on the monitoring dashboard. Your producers have the new call lists.`,
    deliverables: [
      "AI renewal campaign system with four-touch cadence",
      "Sub-60-second lead response across every inbound channel",
      "Quote follow-up sequences with personalization by carrier + coverage",
      "Operations dashboard for renewals, leads, and campaign metrics",
      "Full AMS integration — reads policies, writes activities, enforces opt-outs",
      "Team training (producers, CSRs, agency owner)",
    ],
  },
  {
    number: "03",
    title: "Managed AI Operations — ongoing",
    kicker: "$2,500/month. Month-to-month, cancel with 30 days' notice.",
    body: `AI systems drift. Clients' phones change. Carrier appetites shift. Classifiers degrade. Managed Ops is the ongoing layer that keeps the system working as the world changes around it.

Each week we monitor performance, tune the classifiers and prompts, and surface what the data is telling you about your book. Each month we do a live strategy review with the agency owner.`,
    deliverables: [
      "Weekly performance monitoring and classifier tuning",
      "Continuous prompt optimization as your tone and offers evolve",
      "Monthly strategy reviews with the instructor",
      "Cross-sell and churn-risk reports",
      "Priority support and same-week new-automation requests",
    ],
  },
];

export default function HowItWorksPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        name: "How RenewalEngineAI rolls out AI automation in an independent agency",
        description:
          "The three-phase process we use to go from discovery to live AI automation inside independent insurance agencies.",
        url: "https://renewalengineai.com/how-it-works",
        totalTime: "P4W",
        step: phases.map((p, idx) => ({
          "@type": "HowToStep",
          position: idx + 1,
          name: p.title,
          text: p.body,
          url: `https://renewalengineai.com/how-it-works#phase-${idx + 1}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://renewalengineai.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "How It Works",
            item: "https://renewalengineai.com/how-it-works",
          },
        ],
      },
    ],
  };

  return (
    <BookingProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-black">
        <Header />
        <main className="bg-black text-white min-h-screen pt-32 pb-24">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="mb-20 max-w-3xl">
              <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-4">
                How it works
              </p>
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                Audit. Build &amp; Launch. Managed Ops.
              </h1>
              <p className="text-xl text-neutral-300 leading-relaxed">
                Three phases. No long-term contracts. You can stop after any
                phase. Most agencies run all three because each one pays for
                itself before the next begins.
              </p>
            </div>

            <div className="space-y-16">
              {phases.map((phase, idx) => (
                <section
                  key={phase.number}
                  id={`phase-${idx + 1}`}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 scroll-mt-28"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline gap-6 mb-6">
                    <p className="text-6xl font-black text-blue-600">
                      {phase.number}
                    </p>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black mb-2">
                        {phase.title}
                      </h2>
                      <p className="text-blue-500 font-semibold">
                        {phase.kicker}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg text-neutral-300 leading-relaxed whitespace-pre-line mb-6">
                    {phase.body}
                  </p>
                  <ul className="space-y-2">
                    {phase.deliverables.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-3 text-neutral-300"
                      >
                        <span className="text-blue-500 font-bold mt-1">✓</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <section className="mt-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Start with the audit
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                The $1,500 audit is the fastest way to see whether this will
                actually work for your agency. We either hand you a roadmap
                you&rsquo;re excited to build, or we tell you it doesn&rsquo;t
                fit yet — either way you get clarity in 5 days.
              </p>
              <BookAuditButton
                label="Book a free discovery call"
                ctaLocation="how_it_works_bottom"
                className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-black rounded-full px-10 py-5 text-lg transition-colors"
              />
            </section>

            <section className="mt-16">
              <h2 className="text-2xl font-black mb-4">Dig deeper</h2>
              <ul className="space-y-3 text-neutral-300">
                <li>
                  <Link
                    className="text-blue-500 hover:text-blue-400 underline underline-offset-4"
                    href="/resources/ai-renewal-automation-playbook"
                  >
                    The Insurance Renewal Automation Playbook
                  </Link>{" "}
                  — how the renewal engine is actually structured.
                </li>
                <li>
                  <Link
                    className="text-blue-500 hover:text-blue-400 underline underline-offset-4"
                    href="/resources/instant-lead-response-under-60-seconds"
                  >
                    Instant Lead Response Under 60 Seconds
                  </Link>{" "}
                  — the workflow that rebuilds the top of your funnel.
                </li>
                <li>
                  <Link
                    className="text-blue-500 hover:text-blue-400 underline underline-offset-4"
                    href="/resources/ams-ai-integration-guide"
                  >
                    AMS + AI Integration Guide
                  </Link>{" "}
                  — what integration looks like on Applied Epic, HawkSoft, or
                  EZLynx.
                </li>
              </ul>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
