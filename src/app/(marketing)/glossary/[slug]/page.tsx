import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { ResourceBody } from "@/components/resources/ResourceBody";
import { getGlossaryTerm, listGlossaryTerms } from "@/lib/glossary";
import { team, personJsonLd, personJsonLdId } from "@/lib/team";

export function generateStaticParams() {
  return listGlossaryTerms().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getGlossaryTerm(slug);
  if (!entry) return { title: "Not found", robots: { index: false } };

  const url = `https://renewalengineai.com/glossary/${entry.slug}`;
  // Title targets the definitional query shape ("what is an x-date") rather
  // than repeating the bare term, which competes with dictionary results.
  const title = `${entry.term}: Definition for Insurance Agencies`;
  return {
    title,
    description: entry.shortDefinition,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: entry.shortDefinition,
      siteName: "RenewalEngineAI",
      modifiedTime: entry.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: entry.shortDefinition,
    },
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getGlossaryTerm(slug);
  if (!entry) notFound();

  const all = listGlossaryTerms();
  const related = (entry.related ?? [])
    .map((s) => all.find((t) => t.slug === s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const url = `https://renewalengineai.com/glossary/${entry.slug}`;
  const author = team[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        "@id": `${url}#DefinedTerm`,
        name: entry.term,
        description: entry.shortDefinition,
        url,
        termCode: entry.slug,
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          "@id": "https://renewalengineai.com/glossary#DefinedTermSet",
          name: "Insurance & AI Automation Glossary",
          url: "https://renewalengineai.com/glossary",
        },
        ...(entry.aliases?.length ? { alternateName: entry.aliases } : {}),
      },
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: entry.term,
        description: entry.shortDefinition,
        dateModified: entry.updatedAt,
        inLanguage: "en-US",
        isPartOf: { "@id": "https://renewalengineai.com#WebSite" },
        publisher: { "@id": "https://renewalengineai.com#Organization" },
        author: { "@id": personJsonLdId(author.slug) },
        mainEntity: { "@id": `${url}#DefinedTerm` },
        // The lead paragraph is the self-contained definition, which is
        // exactly the passage an answer engine should lift.
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "article p:first-of-type"],
        },
      },
      personJsonLd(author),
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
            name: "Glossary",
            item: "https://renewalengineai.com/glossary",
          },
          { "@type": "ListItem", position: 3, name: entry.term, item: url },
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
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <Link
              href="/glossary"
              className="inline-block text-blue-500 font-semibold mb-8 hover:text-blue-400"
            >
              ← Glossary
            </Link>

            <div className="mb-10">
              <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-3">
                {entry.category}
              </p>
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                {entry.term}
              </h1>
              <p className="text-xl text-neutral-300 leading-relaxed border-l-2 border-blue-600 pl-6">
                {entry.shortDefinition}
              </p>
              {entry.aliases && entry.aliases.length > 0 && (
                <p className="text-sm text-neutral-500 mt-6">
                  Also called: {entry.aliases.join(", ")}
                </p>
              )}
            </div>

            <article>
              <ResourceBody body={entry.body} />
            </article>

            {related.length > 0 && (
              <section className="mt-16 pt-12 border-t border-neutral-800">
                <h2 className="text-2xl font-black mb-6">Related terms</h2>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {related.map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/glossary/${t.slug}`}
                        className="block h-full bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-blue-600 transition-colors"
                      >
                        <p className="font-bold mb-1">{t.term}</p>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                          {t.shortDefinition}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-16 bg-gradient-to-br from-emerald-600/10 to-blue-600/10 border border-emerald-500/30 rounded-2xl p-10">
              <h2 className="text-2xl font-black mb-3">
                See how this works in a real agency
              </h2>
              <p className="text-neutral-300 mb-6 leading-relaxed">
                Our guides walk through the systems behind these terms — built
                on Applied Epic, HawkSoft, and EZLynx books.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/resources"
                  className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-full px-8 py-4 transition-colors"
                >
                  Read the guides →
                </Link>
                <Link
                  href="/#pricing"
                  className="inline-block border border-neutral-700 hover:border-blue-600 text-white font-black rounded-full px-8 py-4 transition-colors"
                >
                  See pricing
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
