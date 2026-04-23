import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { BookAuditButton } from "@/components/courses/BookAuditButton";

export const metadata: Metadata = {
  title: "AI Automation for Independent P&C Agencies (Epic, HawkSoft, EZLynx)",
  description:
    "For independent P&C agencies on Applied Epic, HawkSoft, or EZLynx. AI renewal automation and lead response built around your AMS. 15-20% retention lift, sub-60-second lead response.",
  alternates: {
    canonical: "https://renewalengineai.com/for-independent-agencies",
  },
  openGraph: {
    type: "website",
    url: "https://renewalengineai.com/for-independent-agencies",
    title: "AI Automation for Independent P&C Agencies | RenewalEngineAI",
    description:
      "For independent P&C agencies on Applied Epic, HawkSoft, or EZLynx.",
    siteName: "RenewalEngineAI",
  },
};

const reasons = [
  {
    title: "You have 200+ policies and you know you're leaking some of them",
    body: "Most independents lose 8-12% of the book every year. The math only works when you keep the profitable complex renewals - which is exactly the segment reactive workflows lose first.",
  },
  {
    title: "Your producers are at capacity but you're not ready to hire",
    body: "Hiring a CSR is a 3-month commitment at $60-80K fully loaded. AI renewal + lead-response automation gives you the capacity of an additional CSR without the onboarding, the turnover risk, or the W-2.",
  },
  {
    title: "Your AMS has more information than you're using",
    body: "Applied Epic, HawkSoft, and EZLynx all store years of useful context on every client. Most of it sits there unused because no one has the time to pull it into outreach. The AI does that work at scale.",
  },
  {
    title: "Your competitors are getting faster on inbound",
    body: "When agencies start responding in under 60 seconds, the rest of the market loses winnable leads by default. This is the rising-tide problem - even if you keep doing what you're doing, the bar moves.",
  },
];

const notForYou = [
  {
    title: "You have under 100 policies",
    body: "The math doesn't work yet. Focus on direct outreach and referral density first; come back at 200.",
  },
  {
    title: "Your AMS data is broken",
    body: "If client emails are blank on 40%+ of records, fix data hygiene first. We'll tell you that in the audit - don't pay us $6,000 to write on top of broken data.",
  },
  {
    title: "You want a software license you run yourself",
    body: "We're not a CRM. We don't do seat licensing. We build and run the system for you. If you want software, the courses will teach you to build this yourself.",
  },
];

export default function ForIndependentAgenciesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://renewalengineai.com/for-independent-agencies#Service",
        name: "AI automation for independent insurance agencies",
        serviceType: "AI automation for independent insurance agencies",
        provider: { "@id": "https://renewalengineai.com#Organization" },
        areaServed: { "@type": "Country", name: "United States" },
        audience: {
          "@type": "BusinessAudience",
          audienceType: "Independent insurance agencies",
        },
        description:
          "Done-for-you AI automation built specifically for independent P&C agencies running on Applied Epic, HawkSoft, or EZLynx.",
        offers: {
          "@type": "Offer",
          price: "1500.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://renewalengineai.com/#pricing",
        },
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
            name: "For Independent Agencies",
            item: "https://renewalengineai.com/for-independent-agencies",
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
                For independent insurance agencies
              </p>
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                AI Automation for Independent Insurance Agencies
              </h1>
              <p className="text-xl text-neutral-300 leading-relaxed">
                AI that fits your agency, not the other way around. We build
                AI automation specifically for independent P&amp;C agencies
                running on Applied Epic, HawkSoft, or EZLynx. No captive
                agency playbooks. No enterprise-only features you&rsquo;ll
                never use. Done-for-you retention and lead-response systems
                that lift retention 15-20% without adding headcount.
              </p>
            </div>

            <section className="mb-20">
              <h2 className="text-3xl md:text-4xl font-black mb-8">
                This is built for you if…
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reasons.map((r) => (
                  <div
                    key={r.title}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8"
                  >
                    <h3 className="text-xl font-bold mb-3">{r.title}</h3>
                    <p className="text-neutral-400 leading-relaxed">{r.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-20">
              <h2 className="text-3xl md:text-4xl font-black mb-8">
                It&rsquo;s not the right fit if…
              </h2>
              <div className="space-y-4">
                {notForYou.map((n) => (
                  <div
                    key={n.title}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex gap-4"
                  >
                    <span className="text-3xl text-neutral-700">×</span>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{n.title}</h3>
                      <p className="text-neutral-400">{n.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-20">
              <h2 className="text-3xl md:text-4xl font-black mb-8">
                What an engagement actually looks like
              </h2>
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 space-y-4 text-neutral-300 leading-relaxed">
                <p>
                  <strong className="text-white">Week 0 - Audit.</strong>{" "}
                  Five-day deep-dive on your agency. We pull the renewal list,
                  lead-source mix, AMS data quality, and current touch cadence.
                  You get a written roadmap with ROI projections.
                </p>
                <p>
                  <strong className="text-white">
                    Weeks 1-2 - Build & Launch (phase 1).
                  </strong>{" "}
                  We stand up AMS integration, the AI renewal engine, and the
                  instant lead-response stack. By end of week 2, both systems
                  are running against your real book.
                </p>
                <p>
                  <strong className="text-white">
                    Week 3 - Build & Launch (phase 2).
                  </strong>{" "}
                  Quote follow-up automation, cross-sell classifier, and the
                  operations dashboard. Team training. Go-live.
                </p>
                <p>
                  <strong className="text-white">
                    Week 4 onward - Managed Ops.
                  </strong>{" "}
                  We monitor every week, tune classifiers, and surface what the
                  data is telling you about your book. Monthly strategy call
                  with the agency owner.
                </p>
              </div>
            </section>

            <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                See what this looks like for your agency
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Book a 15-minute discovery call. If it&rsquo;s a fit, we scope
                the audit. If it isn&rsquo;t, we tell you why and suggest what
                to do instead.
              </p>
              <BookAuditButton
                label="Book a discovery call"
                ctaLocation="for_independent_agencies"
                className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-black rounded-full px-10 py-5 text-lg transition-colors"
              />
            </section>

            <section className="mt-16">
              <h2 className="text-2xl font-black mb-4">Read first</h2>
              <ul className="space-y-3 text-neutral-300">
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-blue-500 hover:text-blue-400 underline underline-offset-4"
                  >
                    How it works
                  </Link>{" "}
                  - the three phases in detail.
                </li>
                <li>
                  <Link
                    href="/resources/ams-ai-integration-guide"
                    className="text-blue-500 hover:text-blue-400 underline underline-offset-4"
                  >
                    AMS + AI Integration Guide
                  </Link>{" "}
                  - Applied Epic, HawkSoft, EZLynx specifics.
                </li>
                <li>
                  <Link
                    href="/resources/ai-renewal-automation-playbook"
                    className="text-blue-500 hover:text-blue-400 underline underline-offset-4"
                  >
                    The Insurance Renewal Automation Playbook
                  </Link>{" "}
                  - the retention engine we build.
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
