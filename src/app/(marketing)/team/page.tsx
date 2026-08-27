import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { team } from "@/lib/team";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the operators behind RenewalEngineAI. We build, launch, and manage AI automation systems for independent insurance agencies — renewal campaigns, instant lead response, and AMS integration.",
  alternates: { canonical: "https://renewalengineai.com/team" },
  openGraph: {
    type: "website",
    url: "https://renewalengineai.com/team",
    title: "Team | RenewalEngineAI",
    description:
      "The operators behind RenewalEngineAI — building AI automation for independent insurance agencies.",
    siteName: "RenewalEngineAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Team | RenewalEngineAI",
    description:
      "Operators building done-for-you AI automation for independent insurance agencies.",
  },
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

            {/* Who you actually work with. This page was 142 words — the
                thinnest on the site, and the primary trust surface for a
                $6k+ engagement. Everything below restates facts already
                published on /how-it-works, /#pricing and llms.txt. */}
            <section className="mt-20 space-y-12">
              <div>
                <h2 className="text-3xl font-black mb-4">
                  Who runs your engagement
                </h2>
                <p className="text-neutral-300 leading-relaxed mb-4">
                  RenewalEngineAI is deliberately small. The person who runs
                  your operations audit is the person who builds the
                  automations and the person who tunes them at month six.
                  There is no handoff from a salesperson to an implementation
                  team you have not met, and no offshore build shop behind the
                  engagement.
                </p>
                <p className="text-neutral-300 leading-relaxed">
                  That constrains how many agencies we can take on at once. It
                  is also the reason the work happens inside your Applied
                  Epic, HawkSoft, or EZLynx instance rather than in a generic
                  CRM you would have to learn and maintain yourself.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-black mb-4">
                  How the engagement is structured
                </h2>
                <p className="text-neutral-300 leading-relaxed mb-6">
                  Three phases, each with its own exit point. You are not
                  locked into the next one.
                </p>
                <ul className="space-y-4">
                  <li className="border-l-2 border-blue-600 pl-6">
                    <p className="font-bold mb-1">
                      Operations audit — $1,500, about 5 days
                    </p>
                    <p className="text-neutral-400 leading-relaxed">
                      We pull your renewal, lead-response and quote-follow-up
                      data out of the AMS and show you where the book is
                      leaking. You keep the findings whether or not you
                      continue. The fee is credited toward Build &amp; Launch
                      if you do.
                    </p>
                  </li>
                  <li className="border-l-2 border-blue-600 pl-6">
                    <p className="font-bold mb-1">
                      Build &amp; launch — $6,000, 2–3 weeks
                    </p>
                    <p className="text-neutral-400 leading-relaxed">
                      The automations go live inside your AMS: renewal
                      campaigns, sub-60-second lead response, quote follow-up
                      sequences, and the classification logic that decides
                      which client gets a text, an email, or a producer call.
                    </p>
                  </li>
                  <li className="border-l-2 border-blue-600 pl-6">
                    <p className="font-bold mb-1">
                      Managed operations — $2,500/month, no long-term contract
                    </p>
                    <p className="text-neutral-400 leading-relaxed">
                      Someone keeps tuning it. This is the part most vendors
                      and most consultants do not do — a system nobody adjusts
                      degrades quietly as your book, carriers and staffing
                      change.
                    </p>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-black mb-4">
                  Why we publish our own research
                </h2>
                <p className="text-neutral-300 leading-relaxed">
                  Every guide in the{" "}
                  <Link href="/resources" className="text-blue-500 hover:text-blue-400 font-semibold">
                    resource library
                  </Link>
                  , every entry in the{" "}
                  <Link href="/glossary" className="text-blue-500 hover:text-blue-400 font-semibold">
                    glossary
                  </Link>
                  , and every{" "}
                  <Link href="/compare" className="text-blue-500 hover:text-blue-400 font-semibold">
                    vendor comparison
                  </Link>{" "}
                  is written or reviewed by the same person doing the
                  engagements. The comparisons are written to describe fit
                  rather than to argue that every alternative is worse — some
                  agencies genuinely are better served by hiring a CSR, by a
                  point solution, or by doing it themselves, and the{" "}
                  <Link href="/courses" className="text-blue-500 hover:text-blue-400 font-semibold">
                    courses
                  </Link>{" "}
                  exist for that last group.
                </p>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
