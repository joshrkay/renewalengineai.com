import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { listIntegrations } from "@/lib/integrations";

const URL = "https://renewalengineai.com/integrations";

export const metadata: Metadata = {
  title: "AMS Integrations: Epic, HawkSoft, EZLynx",
  description:
    "How RenewalEngineAI connects to the agency management system you already run — Applied Epic, HawkSoft CMS, or EZLynx. What data we read, how activity is written back, and what rollout looks like on each.",
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: "AMS Integrations | RenewalEngineAI",
    description:
      "AI automation built on the AMS you already run — Applied Epic, HawkSoft CMS, or EZLynx.",
    siteName: "RenewalEngineAI",
  },
};

export default function IntegrationsIndexPage() {
  const integrations = listIntegrations();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": URL,
        name: "AMS Integrations",
        url: URL,
        description:
          "AI automation integrations for the agency management systems independent insurance agencies run on.",
        inLanguage: "en-US",
        isPartOf: { "@id": "https://renewalengineai.com#WebSite" },
      },
      {
        "@type": "ItemList",
        itemListElement: integrations.map((i, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          url: `https://renewalengineai.com/integrations/${i.slug}`,
          name: i.title,
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
          { "@type": "ListItem", position: 2, name: "Integrations", item: URL },
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
            <div className="mb-16 max-w-3xl">
              <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-4">
                Integrations
              </p>
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                Built on the AMS you already run
              </h1>
              <p className="text-xl text-neutral-400 leading-relaxed">
                We don&rsquo;t replace your agency management system and we
                don&rsquo;t ask your team to learn a new one. Automation reads
                from the AMS, writes activity back where your system&rsquo;s
                access allows (real-time via API where licensed, daily
                import-ready files where not), and leaves your system of
                record exactly where it is.
              </p>
            </div>

            <ul className="space-y-6 mb-16">
              {integrations.map((i) => (
                <li key={i.slug}>
                  <Link
                    href={`/integrations/${i.slug}`}
                    className="block bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-blue-600 transition-colors"
                  >
                    <p className="text-blue-500 font-bold uppercase tracking-wider text-xs mb-3">
                      {i.vendor}
                    </p>
                    <p className="text-3xl font-black mb-3">{i.ams}</p>
                    <p className="text-neutral-400 leading-relaxed mb-4">
                      {i.description}
                    </p>
                    <p className="text-sm text-neutral-500">{i.segment}</p>
                  </Link>
                </li>
              ))}
            </ul>

            <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 mb-10">
              <h2 className="text-2xl font-black mb-4">
                Running something else?
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-4">
                These three cover most independent agencies, but they
                aren&rsquo;t the only systems we&rsquo;ve worked with. The
                approach generalizes: if your AMS can produce a scheduled
                export of clients, policies, and expiration dates, the
                automation can be built on it.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                The{" "}
                <Link
                  href="/resources/ams-data-export-checklist"
                  className="text-blue-500 hover:text-blue-400 underline underline-offset-4"
                >
                  AMS data export checklist
                </Link>{" "}
                lists exactly what to pull, whichever platform you&rsquo;re on.
              </p>
            </section>

            <section className="bg-gradient-to-br from-emerald-600/10 to-blue-600/10 border border-emerald-500/30 rounded-2xl p-10">
              <h2 className="text-3xl font-black mb-3">
                Not sure your data is ready?
              </h2>
              <p className="text-neutral-300 mb-6 leading-relaxed">
                That&rsquo;s what the audit is for. Five days, your actual AMS
                data, and a roadmap that says what can be automated now and
                what has to be cleaned up first.
              </p>
              <Link
                href="/#pricing"
                className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-full px-8 py-4 transition-colors"
              >
                See audit pricing →
              </Link>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
