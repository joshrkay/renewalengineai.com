import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { listComparisons } from "@/lib/comparisons";

export const metadata: Metadata = {
  title: "Compare RenewalEngineAI to Other Insurance AI Options",
  description:
    "Side-by-side comparisons of RenewalEngineAI versus Strada, Sonant AI, and hiring a CSR. Honest positioning differences, cost-of-ownership models, and decision trees for independent insurance agencies.",
  alternates: { canonical: "https://renewalengineai.com/compare" },
  openGraph: {
    type: "website",
    url: "https://renewalengineai.com/compare",
    title:
      "Compare RenewalEngineAI to Other Insurance AI Options | RenewalEngineAI",
    description:
      "Honest side-by-side comparisons for agencies evaluating AI automation options.",
    siteName: "RenewalEngineAI",
  },
};

export default function CompareIndexPage() {
  const comparisons = listComparisons();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Compare RenewalEngineAI to Other Insurance AI Options",
        url: "https://renewalengineai.com/compare",
        description:
          "Side-by-side comparisons of RenewalEngineAI and alternative approaches to AI automation for independent insurance agencies.",
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
            name: "Compare",
            item: "https://renewalengineai.com/compare",
          },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: comparisons.map((c, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          url: `https://renewalengineai.com/compare/${c.slug}`,
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
              <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-4">
                Compare
              </p>
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                Honest comparisons, not marketing dunks
              </h1>
              <p className="text-xl text-neutral-300 leading-relaxed">
                These pages lay out the positioning differences between
                RenewalEngineAI and the alternatives agencies actually weigh us
                against. We name where each option wins, including the ones
                where we don&rsquo;t. Updated when category positioning shifts.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {comparisons.map((c) => (
                <Link
                  key={c.slug}
                  href={`/compare/${c.slug}`}
                  className="block bg-neutral-900 border border-neutral-800 rounded-2xl p-10 hover:border-blue-600 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="inline-block bg-blue-600/20 text-blue-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      vs. {c.competitor}
                    </span>
                    <span className="text-neutral-500 text-sm">
                      {c.readTime} min read
                    </span>
                  </div>
                  <h2 className="text-3xl font-black mb-3 leading-tight">
                    {c.title}
                  </h2>
                  <p className="text-neutral-400 leading-relaxed mb-6">
                    {c.tagline}
                  </p>
                  <span className="text-blue-500 font-semibold">
                    Read the comparison →
                  </span>
                </Link>
              ))}
            </div>

            {comparisons.length === 0 && (
              <p className="text-neutral-500">
                Comparisons coming soon.
              </p>
            )}

            <section className="mt-20 bg-gradient-to-br from-emerald-600/10 to-blue-600/10 border border-emerald-500/30 rounded-2xl p-10">
              <h2 className="text-3xl font-black mb-3">
                Still not sure which is right?
              </h2>
              <p className="text-neutral-300 mb-6 leading-relaxed">
                The audit surfaces the actual bottleneck in your agency &mdash;
                which is often not the one you think. $1,500, 5 days, fully
                credited toward Build &amp; Launch if you continue.
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
