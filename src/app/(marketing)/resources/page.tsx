import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { listResources } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Insurance AI Automation Guides & Playbooks | Renewals, Leads, AMS",
  description:
    "Practical guides on AI renewal automation, sub-60-second lead response, and AMS integration (Applied Epic, HawkSoft, EZLynx) for independent agencies.",
  alternates: { canonical: "https://renewalengineai.com/resources" },
  openGraph: {
    type: "website",
    url: "https://renewalengineai.com/resources",
    title: "Insurance AI Automation Guides & Playbooks | RenewalEngineAI",
    description:
      "Practical guides on AI renewal automation, sub-60-second lead response, and AMS integration for independent insurance agencies.",
    siteName: "RenewalEngineAI",
  },
};

export default function ResourcesIndexPage() {
  const resources = listResources();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Resources for Insurance Agency Leaders",
        url: "https://renewalengineai.com/resources",
        description:
          "Practical guides on running AI automation inside independent insurance agencies.",
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
            name: "Resources",
            item: "https://renewalengineai.com/resources",
          },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: resources.map((r, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          url: `https://renewalengineai.com/resources/${r.slug}`,
          name: r.title,
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
                Resources
              </p>
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                How to run AI in an independent insurance agency
              </h1>
              <p className="text-xl text-neutral-300">
                Guides from the engagements we run - renewal cadences, instant
                lead response, AMS integration. Written for agency owners and
                operations leads who need to know how this actually works before
                they commit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((r) => (
                <Link
                  key={r.slug}
                  href={`/resources/${r.slug}`}
                  className="block bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-blue-600 transition-colors"
                >
                  <p className="text-blue-500 font-bold uppercase tracking-wider text-xs mb-3">
                    {r.category}
                  </p>
                  <h2 className="text-2xl font-black mb-3">{r.title}</h2>
                  <p className="text-neutral-400 mb-6 leading-relaxed">
                    {r.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">
                      {r.readTime} min read
                    </span>
                    <span className="text-blue-500 font-semibold">Read →</span>
                  </div>
                </Link>
              ))}
            </div>

            {resources.length === 0 && (
              <p className="text-neutral-500">
                New guides are on the way. Check back soon.
              </p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
