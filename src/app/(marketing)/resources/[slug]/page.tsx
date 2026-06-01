import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { ResourceBody } from "@/components/resources/ResourceBody";
import { ContentCTA } from "@/components/marketing/ContentCTA";
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
        // Article.image is populated via Next.js auto-generated og:image
        // meta tag (from opengraph-image.tsx in this route). Hardcoding
        // the URL here would 404 because Next.js embeds a content hash
        // in the OG image path segment. Google falls back to og:image.
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
        // speakable targets h1 + the lead paragraph so voice assistants
        // and AI answer engines pull the most authoritative summary.
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "article p:first-of-type", "blockquote"],
        },
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
              <p className="text-xl text-neutral-400 mb-4">
                {resource.description}
              </p>
              <p className="text-sm text-neutral-500">
                By{" "}
                <Link
                  href={`/team/${author.slug}`}
                  className="text-blue-500 hover:text-blue-400 underline underline-offset-4"
                >
                  {author.name}
                </Link>
                , {author.jobTitle} · Published{" "}
                {new Date(resource.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
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

            <ContentCTA
              location="resource_article"
              eyebrow="Put this to work"
              headline="Want this built for your agency?"
              subcopy="Book a free 30-minute renewal audit to see where your book is leaking, or grab the playbook and start on your own this week."
            />
          </div>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
