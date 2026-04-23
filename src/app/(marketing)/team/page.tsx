import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { team } from "@/lib/team";

export const metadata: Metadata = {
  title: "Team",
  description:
    "The people behind RenewalEngineAI - operators building AI automation for independent insurance agencies.",
  alternates: { canonical: "https://renewalengineai.com/team" },
};

export default function TeamIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Team",
        url: "https://renewalengineai.com/team",
        description:
          "The people behind RenewalEngineAI - operators building AI automation for independent insurance agencies.",
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
            name: "Team",
            item: "https://renewalengineai.com/team",
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
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="mb-16 max-w-3xl">
              <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-4">
                Team
              </p>
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                The people building RenewalEngineAI
              </h1>
              <p className="text-xl text-neutral-300">
                Operators who run agency engagements, write the guides, and
                tune the AI inside your book.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {team.map((m) => (
                <Link
                  key={m.slug}
                  href={`/team/${m.slug}`}
                  className="block bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-blue-600 transition-colors"
                >
                  <p className="text-blue-500 font-bold uppercase tracking-wider text-xs mb-2">
                    {m.jobTitle}
                  </p>
                  <h2 className="text-2xl font-black mb-3">{m.name}</h2>
                  <p className="text-neutral-400 leading-relaxed">
                    {m.shortBio}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
