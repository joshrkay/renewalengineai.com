import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { LeadMagnetForm } from "@/components/marketing/LeadMagnetForm";

export const metadata: Metadata = {
  title: "5 AI Automations Every Insurance Agent Should Set Up This Week",
  description:
    "Free guide: the five AI automations that save independent insurance agents 15+ hours a week and lift retention. Send to your inbox. No spam.",
  alternates: {
    canonical: "https://renewalengineai.com/guides/5-ai-automations",
  },
  openGraph: {
    type: "website",
    url: "https://renewalengineai.com/guides/5-ai-automations",
    title: "5 AI Automations Every Insurance Agent Should Set Up This Week",
    description:
      "Free guide: five AI automations that save independent insurance agents 15+ hours a week.",
    siteName: "RenewalEngineAI",
  },
};

const automations = [
  {
    n: "01",
    title: "Renewal reminder sequences",
    blurb:
      "Trigger personalized outreach 60, 30, 14, and 7 days before each policy's X-date.",
    saves: "5+ hrs / week",
  },
  {
    n: "02",
    title: "Cross-sell opportunity scoring",
    blurb:
      "AI scans your book for single-policy households and coverage gaps, ranked by likelihood.",
    saves: "3+ hrs / week",
  },
  {
    n: "03",
    title: "Instant lead response",
    blurb:
      "Sub-60-second reply on every inbound channel, 24/7. No lead dies in a shared inbox.",
    saves: "8+ hrs / week",
  },
  {
    n: "04",
    title: "Quote follow-up sequences",
    blurb:
      "Multi-touch cadences for every open quote until they bind or decline. Nothing goes cold.",
    saves: "4+ hrs / week",
  },
  {
    n: "05",
    title: "Service request triage",
    blurb:
      "AI-drafted replies to COI requests, endorsements, and billing questions that your team approves in one click.",
    saves: "6+ hrs / week",
  },
];

export default function LeadMagnetPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://renewalengineai.com/guides/5-ai-automations#WebPage",
        url: "https://renewalengineai.com/guides/5-ai-automations",
        name: "5 AI Automations Every Insurance Agent Should Set Up This Week",
        description:
          "Free guide for independent insurance agents on the five AI automations that save 15+ hours per week.",
        isPartOf: { "@id": "https://renewalengineai.com#WebSite" },
        inLanguage: "en-US",
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
            name: "Guides",
            item: "https://renewalengineai.com/resources",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "5 AI Automations",
            item: "https://renewalengineai.com/guides/5-ai-automations",
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
            <div className="grid lg:grid-cols-2 gap-16 mb-20">
              <div>
                <p className="text-emerald-500 font-bold uppercase tracking-wider text-sm mb-4">
                  Free guide
                </p>
                <h1 className="text-5xl md:text-6xl font-black mb-6 leading-[0.98]">
                  5 AI Automations Every Insurance Agent Should Set Up This
                  Week
                </h1>
                <p className="text-xl text-neutral-300 leading-relaxed mb-8">
                  A practical guide for independent P&amp;C agencies. Five
                  automations you can set up without hiring a developer that
                  save 15+ hours a week and stop renewal leaks before they
                  happen.
                </p>

                <ul className="space-y-3 mb-4">
                  {automations.map((a) => (
                    <li
                      key={a.n}
                      className="flex items-start gap-4 text-neutral-300"
                    >
                      <span className="text-emerald-500 font-black mt-0.5">
                        {a.n}
                      </span>
                      <div>
                        <p className="text-white font-bold">{a.title}</p>
                        <p className="text-sm text-neutral-500">
                          {a.blurb}{" "}
                          <span className="text-emerald-400 font-semibold">
                            Saves {a.saves}.
                          </span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 h-fit lg:sticky lg:top-32">
                <p className="text-sm uppercase tracking-wider text-neutral-500 font-semibold mb-3">
                  Get the PDF
                </p>
                <p className="text-2xl font-black text-white mb-6 leading-tight">
                  Enter your email. We&rsquo;ll send it now.
                </p>
                <LeadMagnetForm source="lead_magnet_5ai" />
              </div>
            </div>

            <section className="border-t border-neutral-800 pt-12 mb-12">
              <h2 className="text-3xl font-black mb-6">
                Prefer to skip the DIY?
              </h2>
              <p className="text-lg text-neutral-300 leading-relaxed mb-6 max-w-3xl">
                These five automations are what we install for agency clients
                in the first two weeks of our{" "}
                <Link
                  className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
                  href="/#pricing"
                >
                  Build &amp; Launch engagement
                </Link>
                . The guide shows you how to set them up yourself. If
                you&rsquo;d rather we build and run them for you, the audit
                covers everything in 5 days.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/#pricing"
                  className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full px-8 py-4 transition-colors"
                >
                  See pricing
                </Link>
                <Link
                  href="/resources/ai-renewal-automation-playbook"
                  className="inline-block border-2 border-neutral-700 hover:border-neutral-500 text-white font-bold rounded-full px-8 py-4 transition-colors"
                >
                  Read the renewal playbook
                </Link>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
