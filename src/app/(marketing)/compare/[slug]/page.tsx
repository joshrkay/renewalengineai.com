import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { ResourceBody } from "@/components/resources/ResourceBody";
import { getComparison, listComparisons } from "@/lib/comparisons";
import { team, personJsonLd, personJsonLdId } from "@/lib/team";

export function generateStaticParams() {
  return listComparisons().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) return { title: "Not found", robots: { index: false } };

  const url = `https://renewalengineai.com/compare/${comparison.slug}`;
  return {
    title: comparison.title,
    description: comparison.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: comparison.title,
      description: comparison.description,
      siteName: "RenewalEngineAI",
      publishedTime: comparison.publishedAt,
      modifiedTime: comparison.updatedAt ?? comparison.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: comparison.title,
      description: comparison.description,
    },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) notFound();

  const url = `https://renewalengineai.com/compare/${comparison.slug}`;
  const author = team[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#Article`,
        articleSection: "Comparison",
        headline: comparison.title,
        description: comparison.description,
        // Article.image resolved via Next.js auto-generated og:image.
        datePublished: comparison.publishedAt,
        dateModified: comparison.updatedAt ?? comparison.publishedAt,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: { "@id": personJsonLdId(author.slug) },
        reviewedBy: { "@id": personJsonLdId(author.slug) },
        publisher: { "@id": "https://renewalengineai.com#Organization" },
        keywords: comparison.primaryKeyword,
        inLanguage: "en-US",
        isAccessibleForFree: true,
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
            name: "Compare",
            item: "https://renewalengineai.com/compare",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `vs. ${comparison.competitor}`,
            item: url,
          },
        ],
      },
    ],
  };

  const related = listComparisons()
    .filter((c) => c.slug !== comparison.slug)
    .slice(0, 2);

  const lastReviewed = new Date(
    comparison.updatedAt ?? comparison.publishedAt
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
              href="/compare"
              className="inline-block text-blue-500 font-semibold mb-8 hover:text-blue-400"
            >
              ← All comparisons
            </Link>

            <div className="mb-12">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-block bg-blue-600/20 text-blue-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  vs. {comparison.competitor}
                </span>
                <span className="text-neutral-500 text-sm">
                  {comparison.readTime} min read · Last reviewed {lastReviewed}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
                {comparison.title}
              </h1>
              <p className="text-xl text-neutral-400 mb-4">
                {comparison.description}
              </p>
              <p className="text-sm text-neutral-500">
                By{" "}
                <Link
                  href={`/team/${author.slug}`}
                  className="text-blue-500 hover:text-blue-400 underline underline-offset-4"
                >
                  {author.name}
                </Link>
                , {author.jobTitle}
              </p>
            </div>

            <article>
              <ResourceBody body={comparison.body} />
            </article>

            {related.length > 0 && (
              <section className="mt-20 pt-12 border-t border-neutral-800">
                <h2 className="text-2xl font-black mb-6">
                  Other comparisons
                </h2>
                <ul className="space-y-4">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/compare/${r.slug}`}
                        className="block bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-blue-600 transition-colors"
                      >
                        <p className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-2">
                          vs. {r.competitor}
                        </p>
                        <p className="text-xl font-bold mb-1">{r.title}</p>
                        <p className="text-neutral-400 text-sm">{r.tagline}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-16 bg-gradient-to-br from-emerald-600/10 to-blue-600/10 border border-emerald-500/30 rounded-2xl p-10">
              <p className="text-emerald-400 font-bold uppercase tracking-wider text-sm mb-3">
                The fastest way to decide
              </p>
              <h2 className="text-3xl font-black mb-3">
                Skip the vendor evaluation. Start with an audit.
              </h2>
              <p className="text-neutral-300 mb-6 leading-relaxed">
                Five days, $1,500, specific to your book. You walk away with
                numbers you can compare to any option &mdash; ours or any
                competitor&rsquo;s.
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
