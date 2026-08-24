import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { BookAuditButton } from "@/components/courses/BookAuditButton";
import { ResourceBody } from "@/components/resources/ResourceBody";
import { getIntegration, listIntegrations } from "@/lib/integrations";
import { team, personJsonLd, personJsonLdId } from "@/lib/team";

export function generateStaticParams() {
  return listIntegrations().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const integration = getIntegration(slug);
  if (!integration) return { title: "Not found", robots: { index: false } };

  const url = `https://renewalengineai.com/integrations/${integration.slug}`;
  return {
    title: integration.title,
    description: integration.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: integration.title,
      description: integration.description,
      siteName: "RenewalEngineAI",
      publishedTime: integration.publishedAt,
      modifiedTime: integration.updatedAt ?? integration.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: integration.title,
      description: integration.description,
    },
  };
}

function FactList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-blue-500 mb-4">
        {title}
      </h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="text-neutral-300 leading-relaxed flex gap-3">
            <span aria-hidden="true" className="text-blue-600 shrink-0">
              ▸
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function IntegrationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const integration = getIntegration(slug);
  if (!integration) notFound();

  const all = listIntegrations();
  const others = all.filter((i) => i.slug !== integration.slug);

  const url = `https://renewalengineai.com/integrations/${integration.slug}`;
  const author = team[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#Article`,
        headline: integration.title,
        description: integration.description,
        datePublished: integration.publishedAt,
        dateModified: integration.updatedAt ?? integration.publishedAt,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: { "@id": personJsonLdId(author.slug) },
        publisher: { "@id": "https://renewalengineai.com#Organization" },
        keywords: integration.primaryKeyword,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        // Naming the AMS as an explicit SoftwareApplication entity is what
        // lets an answer engine resolve "does X work with Applied Epic".
        about: {
          "@type": "SoftwareApplication",
          name: integration.ams,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          ...(integration.vendor
            ? {
                publisher: {
                  "@type": "Organization",
                  name: integration.vendor,
                },
              }
            : {}),
        },
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
            name: "Integrations",
            item: "https://renewalengineai.com/integrations",
          },
          { "@type": "ListItem", position: 3, name: integration.ams, item: url },
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
              href="/integrations"
              className="inline-block text-blue-500 font-semibold mb-8 hover:text-blue-400"
            >
              ← All integrations
            </Link>

            <div className="mb-12">
              <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-3">
                {integration.vendor} · {integration.readTime} min read
              </p>
              <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight">
                {integration.title}
              </h1>
              <p className="text-xl text-neutral-400 mb-4">
                {integration.description}
              </p>
              <p className="text-sm text-neutral-500 mb-8">
                Typical profile: {integration.segment}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <BookAuditButton
                  label={`Book a free ${integration.ams} strategy call`}
                  ctaLocation="integration_hero"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-8 py-3 transition-colors"
                />
                <p className="text-sm text-neutral-500">
                  30 minutes · we look at your {integration.ams} setup together
                </p>
              </div>
            </div>

            <div className="grid gap-5 mb-14">
              <FactList
                title={`How we read ${integration.ams}`}
                items={integration.dataAccess}
              />
              <FactList
                title="What works in your favour"
                items={integration.strengths}
              />
              <FactList
                title="What we plan around"
                items={integration.frictions}
              />
            </div>

            <article>
              <ResourceBody body={integration.body} />
            </article>

            {others.length > 0 && (
              <section className="mt-20 pt-12 border-t border-neutral-800">
                <h2 className="text-2xl font-black mb-6">
                  Other agency management systems
                </h2>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {others.map((i) => (
                    <li key={i.slug}>
                      <Link
                        href={`/integrations/${i.slug}`}
                        className="block h-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-blue-600 transition-colors"
                      >
                        <p className="text-xl font-bold mb-1">{i.ams}</p>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                          {i.segment}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-16 bg-gradient-to-br from-emerald-600/10 to-blue-600/10 border border-emerald-500/30 rounded-2xl p-10">
              <h2 className="text-3xl font-black mb-3">
                Start with your actual data
              </h2>
              <p className="text-neutral-300 mb-6 leading-relaxed">
                The audit pulls your real {integration.ams} book, finds what
                would break automation today, and returns a roadmap with ROI
                projections — before anyone builds anything.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/#pricing"
                  className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-full px-8 py-4 transition-colors"
                >
                  See audit pricing →
                </Link>
                <Link
                  href="/resources/ams-data-export-checklist"
                  className="inline-block border border-neutral-700 hover:border-blue-600 text-white font-black rounded-full px-8 py-4 transition-colors"
                >
                  Data export checklist
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
