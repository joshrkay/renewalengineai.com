import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { ResourceBody } from "@/components/resources/ResourceBody";
import { team, getTeamMember, personJsonLd } from "@/lib/team";

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) return { title: "Not found", robots: { index: false } };

  const url = `https://renewalengineai.com/team/${member.slug}`;
  return {
    title: `${member.name}, ${member.jobTitle}`,
    description: member.shortBio,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      url,
      title: `${member.name} | RenewalEngineAI`,
      description: member.shortBio,
      siteName: "RenewalEngineAI",
    },
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) notFound();

  const url = `https://renewalengineai.com/team/${member.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      personJsonLd(member),
      {
        "@type": "ProfilePage",
        url,
        mainEntity: { "@id": `${url}#Person` },
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
          {
            "@type": "ListItem",
            position: 3,
            name: member.name,
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
              href="/"
              className="inline-block text-blue-500 font-semibold mb-8 hover:text-blue-400"
            >
              ← renewalengineai.com
            </Link>

            <div className="mb-12">
              <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-3">
                {member.jobTitle}
              </p>
              <h1 className="text-5xl md:text-6xl font-black mb-4">
                {member.name}
              </h1>
              <p className="text-xl text-neutral-300">{member.shortBio}</p>
            </div>

            <article className="mb-12">
              <ResourceBody body={member.longBio} />
            </article>

            <section className="mb-12">
              <h2 className="text-2xl font-black mb-4">Areas of work</h2>
              <div className="flex flex-wrap gap-2">
                {member.knowsAbout.map((topic) => (
                  <span
                    key={topic}
                    className="inline-block bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-sm text-neutral-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </section>

            {member.sameAs.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-black mb-4">Elsewhere</h2>
                <ul className="space-y-2">
                  {member.sameAs.map((url) => (
                    <li key={url}>
                      <a
                        href={url}
                        rel="me noopener"
                        className="text-blue-500 hover:text-blue-400 underline underline-offset-4"
                      >
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center">
              <h2 className="text-2xl font-black mb-3">Want to talk AI for your agency?</h2>
              <p className="text-neutral-400 mb-6">
                The fastest way in is the free audit call.
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
