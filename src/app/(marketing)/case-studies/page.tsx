import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { listCaseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Insurance Agency AI Case Studies - Real Engagement Outcomes",
  description:
    "Representative case studies from RenewalEngineAI engagements with independent insurance agencies. Retention lift, cross-sell revenue, and lead-response outcomes with specific numbers.",
  alternates: { canonical: "https://renewalengineai.com/case-studies" },
  openGraph: {
    type: "website",
    url: "https://renewalengineai.com/case-studies",
    title:
      "Insurance Agency AI Case Studies - Real Engagement Outcomes | RenewalEngineAI",
    description:
      "Representative case studies from agency AI engagements: retention, cross-sell, and lead-response outcomes.",
    siteName: "RenewalEngineAI",
  },
};

export default function CaseStudiesIndexPage() {
  const caseStudies = listCaseStudies();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Insurance Agency AI Case Studies",
        url: "https://renewalengineai.com/case-studies",
        description:
          "Representative case studies from RenewalEngineAI engagements with independent insurance agencies.",
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
            name: "Case Studies",
            item: "https://renewalengineai.com/case-studies",
          },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: caseStudies.map((c, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          url: `https://renewalengineai.com/case-studies/${c.slug}`,
          name: c.title,
        })),
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
            <div className="mb-16 max-w-3xl">
              <p className="text-emerald-500 font-bold uppercase tracking-wider text-sm mb-4">
                Case studies
              </p>
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                What AI actually does inside an independent insurance agency
              </h1>
              <p className="text-xl text-neutral-300 leading-relaxed mb-4">
                Representative engagements showing retention lift, cross-sell
                revenue, and lead-response outcomes with specific numbers.
                Each study names the AMS, book size, engagement tier, and the
                real delta.
              </p>
              <p className="text-sm text-neutral-500 italic">
                These are composite case studies drawn from multiple agency
                engagements. Numbers are representative, not attributed to a
                single named client. NDA-verified references are available on
                request: hello@renewalengineai.com.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {caseStudies.map((c) => (
                <Link
                  key={c.slug}
                  href={`/case-studies/${c.slug}`}
                  className="block bg-neutral-900 border border-neutral-800 rounded-2xl p-10 hover:border-emerald-600 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-block bg-emerald-600/20 text-emerald-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      {c.lineOfBusiness}
                    </span>
                    <span className="text-neutral-500 text-sm">
                      {c.ams} · {c.bookSizeLabel} book · {c.policyCount}+ policies
                    </span>
                    {c.composite && (
                      <span className="text-neutral-600 text-xs italic">
                        Composite
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-black mb-3 leading-tight">
                    {c.title}
                  </h2>
                  <p className="text-neutral-400 mb-6 leading-relaxed">
                    {c.description}
                  </p>
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    {c.headlineResults.map((r) => (
                      <div
                        key={r.label}
                        className="border-l-4 border-emerald-500 pl-4"
                      >
                        <div className="text-2xl md:text-3xl font-black text-white mb-1">
                          {r.value}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {r.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <span className="text-emerald-500 font-semibold">
                    Read the full case study →
                  </span>
                </Link>
              ))}
            </div>

            {caseStudies.length === 0 && (
              <p className="text-neutral-500">
                New case studies are on the way.
              </p>
            )}

            <section className="mt-20 bg-gradient-to-br from-emerald-600/10 to-blue-600/10 border border-emerald-500/30 rounded-2xl p-10">
              <h2 className="text-3xl font-black mb-3">
                Want numbers specific to your agency?
              </h2>
              <p className="text-neutral-300 mb-6 leading-relaxed">
                The 5-day audit delivers a roadmap grounded in your actual book
                size, retention rate, and AMS data. Fully credited toward
                Build &amp; Launch if you continue.
              </p>
              <Link
                href="/#pricing"
                className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-full px-8 py-4 transition-colors"
              >
                Find My Revenue Leaks →
              </Link>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
