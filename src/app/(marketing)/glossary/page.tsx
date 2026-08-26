import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { listGlossaryTerms, listGlossaryByCategory } from "@/lib/glossary";

const URL = "https://renewalengineai.com/glossary";

export const metadata: Metadata = {
  title: "Insurance & AI Automation Glossary",
  description:
    "Plain-English definitions of the insurance agency and AI automation terms that matter — AMS, x-date, bind rate, lapse rate, policies per client, RAG, intake classification, and more.",
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: "Insurance & AI Automation Glossary | RenewalEngineAI",
    description:
      "Plain-English definitions of the insurance agency and AI automation terms that matter to independent agencies.",
    siteName: "RenewalEngineAI",
  },
};

export default function GlossaryIndexPage() {
  const terms = listGlossaryTerms();
  const grouped = listGlossaryByCategory();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        // DefinedTermSet + DefinedTerm is the schema type answer engines
        // resolve definitional queries against, so the whole set is declared
        // here and each term repeats its own node on its detail page.
        "@type": "DefinedTermSet",
        "@id": `${URL}#DefinedTermSet`,
        name: "Insurance & AI Automation Glossary",
        url: URL,
        description:
          "Definitions of insurance agency operations and AI automation terms for independent P&C agencies.",
        inLanguage: "en-US",
        publisher: { "@id": "https://renewalengineai.com#Organization" },
        hasDefinedTerm: terms.map((t) => ({
          "@type": "DefinedTerm",
          "@id": `https://renewalengineai.com/glossary/${t.slug}#DefinedTerm`,
          name: t.term,
          description: t.shortDefinition,
          url: `https://renewalengineai.com/glossary/${t.slug}`,
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
          { "@type": "ListItem", position: 2, name: "Glossary", item: URL },
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
            <div className="mb-14 max-w-3xl">
              <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-4">
                Glossary
              </p>
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                Insurance &amp; AI automation, defined
              </h1>
              <p className="text-xl text-neutral-400 leading-relaxed">
                Independent agencies now live at the intersection of two
                jargon-heavy vocabularies. These are the {terms.length} terms
                that come up most often when agency operations meet AI
                automation — each one written to stand on its own.
              </p>
            </div>

            <nav aria-label="Glossary categories" className="mb-16">
              <ul className="flex flex-wrap gap-3">
                {grouped.map((g) => (
                  <li key={g.category}>
                    <a
                      href={`#${g.category.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                      className="inline-block rounded-full border border-neutral-800 px-5 py-2 text-sm font-semibold text-neutral-300 hover:border-blue-600 hover:text-blue-400 transition-colors"
                    >
                      {g.category}{" "}
                      <span className="text-neutral-600">{g.terms.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {grouped.map((g) => (
              <section
                key={g.category}
                id={g.category.toLowerCase().replace(/[^a-z]+/g, "-")}
                className="mb-16 scroll-mt-28"
              >
                <h2 className="text-3xl font-black mb-6">{g.category}</h2>
                <ul className="space-y-4">
                  {g.terms.map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/glossary/${t.slug}`}
                        className="block bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-blue-600 transition-colors"
                      >
                        <p className="text-xl font-bold mb-2">{t.term}</p>
                        <p className="text-neutral-400 leading-relaxed">
                          {t.shortDefinition}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="mt-4 bg-gradient-to-br from-emerald-600/10 to-blue-600/10 border border-emerald-500/30 rounded-2xl p-10">
              <h2 className="text-3xl font-black mb-3">
                Want the systems behind the vocabulary?
              </h2>
              <p className="text-neutral-300 mb-6 leading-relaxed">
                The glossary explains the terms. Our guides and courses show
                how independent agencies actually put them to work.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/resources"
                  className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-full px-8 py-4 transition-colors"
                >
                  Read the guides →
                </Link>
                <Link
                  href="/courses"
                  className="inline-block border border-neutral-700 hover:border-blue-600 text-white font-black rounded-full px-8 py-4 transition-colors"
                >
                  Browse the courses
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
