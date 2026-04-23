import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { ResourceBody } from "@/components/resources/ResourceBody";
import { getResource, listResources } from "@/lib/resources";
import { team, personJsonLd, personJsonLdId } from "@/lib/team";

export function generateStaticParams() {
  return listResources().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) return { title: "Not found", robots: { index: false } };

  const url = `https://renewalengineai.com/resources/${resource.slug}`;
  return {
    title: resource.title,
    description: resource.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: resource.title,
      description: resource.description,
      siteName: "RenewalEngineAI",
      publishedTime: resource.publishedAt,
      modifiedTime: resource.updatedAt ?? resource.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: resource.title,
      description: resource.description,
    },
  };
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  const allResources = listResources();
  const relatedResources = (resource.related ?? [])
    .map((relSlug) => allResources.find((r) => r.slug === relSlug))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const url = `https://renewalengineai.com/resources/${resource.slug}`;
  // Author defaults to the founder; a future "byline" frontmatter field
  // can override this per article when we have additional team members.
  const author = team[0];
  // Entity references — AMS platforms mentioned in the article get
  // explicit SoftwareApplication nodes so AI answer engines can resolve
  // "does X work with Applied Epic" queries back to our content.
  const amsMentions = [
    {
      "@type": "SoftwareApplication",
      name: "Applied Epic",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
    },
    {
      "@type": "SoftwareApplication",
      name: "HawkSoft CMS",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
    },
    {
      "@type": "SoftwareApplication",
      name: "EZLynx",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
    },
  ];
  const mentionsAms = /applied epic|hawksoft|ezlynx|ams/i.test(
    resource.body + " " + resource.title
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#Article`,
        headline: resource.title,
        description: resource.description,
        datePublished: resource.publishedAt,
        dateModified: resource.updatedAt ?? resource.publishedAt,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: { "@id": personJsonLdId(author.slug) },
        reviewedBy: { "@id": personJsonLdId(author.slug) },
        publisher: { "@id": "https://renewalengineai.com#Organization" },
        articleSection: resource.category,
        keywords: resource.primaryKeyword,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        ...(mentionsAms ? { mentions: amsMentions } : {}),
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
            name: "Resources",
            item: "https://renewalengineai.com/resources",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: resource.title,
            item: url,
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
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <Link
              href="/resources"
              className="inline-block text-blue-500 font-semibold mb-8 hover:text-blue-400"
            >
              ← All resources
            </Link>

            <div className="mb-12">
              <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-3">
                {resource.category} · {resource.readTime} min read
              </p>
              <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight">
                {resource.title}
              </h1>
              <p className="text-xl text-neutral-400">
                {resource.description}
              </p>
            </div>

            <article>
              <ResourceBody body={resource.body} />
            </article>

            {relatedResources.length > 0 && (
              <section className="mt-20 pt-12 border-t border-neutral-800">
                <h2 className="text-2xl font-black mb-6">Keep reading</h2>
                <ul className="space-y-4">
                  {relatedResources.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/resources/${r.slug}`}
                        className="block bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-blue-600 transition-colors"
                      >
                        <p className="text-blue-500 font-bold uppercase tracking-wider text-xs mb-2">
                          {r.category}
                        </p>
                        <p className="text-xl font-bold mb-1">{r.title}</p>
                        <p className="text-neutral-400 text-sm">
                          {r.description}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-16 bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center">
              <h2 className="text-3xl font-black mb-3">
                Want this running in your agency?
              </h2>
              <p className="text-neutral-400 mb-6">
                Book a free Operations Audit and we&rsquo;ll show you exactly
                where AI can move the number first.
              </p>
              <Link
                href="/#pricing"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-8 py-4 transition-colors"
              >
                See pricing →
              </Link>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
