import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { ResourceBody } from "@/components/resources/ResourceBody";
import { ContentCTA } from "@/components/marketing/ContentCTA";
import { getCaseStudy, listCaseStudies } from "@/lib/case-studies";
import { team, personJsonLd, personJsonLdId } from "@/lib/team";

export function generateStaticParams() {
  return listCaseStudies().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) return { title: "Not found", robots: { index: false } };

  const url = `https://renewalengineai.com/case-studies/${caseStudy.slug}`;
  return {
    title: caseStudy.title,
    description: caseStudy.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: caseStudy.title,
      description: caseStudy.description,
      siteName: "RenewalEngineAI",
      publishedTime: caseStudy.publishedAt,
      modifiedTime: caseStudy.updatedAt ?? caseStudy.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: caseStudy.title,
      description: caseStudy.description,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) notFound();

  const url = `https://renewalengineai.com/case-studies/${caseStudy.slug}`;
  const author = team[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#Article`,
        articleSection: "Case study",
        headline: caseStudy.title,
        description: caseStudy.description,
        // Article.image resolved via Next.js auto-generated og:image.
        datePublished: caseStudy.publishedAt,
        dateModified: caseStudy.updatedAt ?? caseStudy.publishedAt,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: { "@id": personJsonLdId(author.slug) },
        reviewedBy: { "@id": personJsonLdId(author.slug) },
        publisher: { "@id": "https://renewalengineai.com#Organization" },
        keywords: caseStudy.primaryKeyword,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "article p:first-of-type"],
        },
        about: {
          "@type": "Service",
          "@id": "https://renewalengineai.com#BuildLaunchService",
          name: "RenewalEngineAI Build & Launch",
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
            name: "Case Studies",
            item: "https://renewalengineai.com/case-studies",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: caseStudy.title,
            item: url,
          },
        ],
      },
    ],
  };

  const related = listCaseStudies()
    .filter((c) => c.slug !== caseStudy.slug)
    .slice(0, 2);

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
              href="/case-studies"
              className="inline-block text-emerald-500 font-semibold mb-8 hover:text-emerald-400"
            >
              ← All case studies
            </Link>

            <div className="mb-12">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-block bg-emerald-600/20 text-emerald-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {caseStudy.lineOfBusiness}
                </span>
                <span className="text-neutral-500 text-sm">
                  {caseStudy.ams} · {caseStudy.bookSizeLabel} book
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
                {caseStudy.title}
              </h1>
              <p className="text-xl text-neutral-400 mb-4">
                {caseStudy.description}
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
                {new Date(caseStudy.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-12 p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
              {caseStudy.headlineResults.map((r) => (
                <div
                  key={r.label}
                  className="border-l-4 border-emerald-500 pl-4"
                >
                  <div className="text-2xl md:text-3xl font-black text-white mb-1">
                    {r.value}
                  </div>
                  <div className="text-xs text-neutral-500">{r.label}</div>
                </div>
              ))}
            </div>

            <article>
              <ResourceBody body={caseStudy.body} />
            </article>

            {related.length > 0 && (
              <section className="mt-20 pt-12 border-t border-neutral-800">
                <h2 className="text-2xl font-black mb-6">Other case studies</h2>
                <ul className="space-y-4">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/case-studies/${r.slug}`}
                        className="block bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-emerald-600 transition-colors"
                      >
                        <p className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-2">
                          {r.lineOfBusiness} · {r.ams}
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
              location="case_study_article"
              eyebrow="Your numbers, not ours"
              headline="Get an audit grounded in your real agency data"
              subcopy="A roadmap with projected retention lift, cross-sell value, and ROI specific to your book. Or start with the free AI playbook."
            />
          </div>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
