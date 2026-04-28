import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { listCourses, formatPrice } from "@/lib/courses";

export const metadata: Metadata = {
  title: "AI Courses for Insurance Agents — Retention, Ops & Prompting",
  description:
    "Self-paced courses that teach insurance agents how to build AI retention engines, agency-ops automations, and production prompts. Taught by operators who run these systems for real agencies.",
  keywords: [
    "AI courses for insurance agents",
    "insurance agency AI training",
    "insurance renewal automation course",
    "AI for insurance agents online course",
    "insurance agency operations AI",
    "insurance agent prompting course",
    "AI retention course insurance",
    "independent insurance agent AI training",
    "insurance AI certification",
  ],
  alternates: { canonical: "https://renewalengineai.com/courses" },
  openGraph: {
    type: "website",
    url: "https://renewalengineai.com/courses",
    title: "AI Courses for Insurance Agents | RenewalEngineAI",
    description:
      "Self-paced courses on building AI retention engines and agency operations automation. Taught by operators.",
    siteName: "RenewalEngineAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Courses for Insurance Agents | RenewalEngineAI",
    description:
      "Self-paced courses on AI retention, agency ops automation, and prompting for insurance agents.",
  },
};

type CatalogItem = {
  href: string;
  kicker: string;
  title: string;
  tagline: string;
  priceLabel: string;
  priceNote?: string;
  lessonCount?: number;
};

export default function CoursesCatalogPage() {
  const courses = listCourses();

  const courseItems: CatalogItem[] = courses.map((c) => ({
    href: `/courses/${c.slug}`,
    kicker: "Self-paced DIY course",
    title: c.title,
    tagline: c.tagline,
    priceLabel: `${formatPrice(c.price)} one-time`,
    lessonCount: c.modules.reduce((sum, m) => sum + m.lessons.length, 0),
  }));

  const extras: CatalogItem[] = [
    {
      href: "/mastermind",
      kicker: "Ongoing membership",
      title: "AI Mastermind & Community",
      tagline:
        "Monthly live calls, evolving prompt library, and a private community of agents running AI in production.",
      priceLabel: "$97 – $197 / month",
      priceNote: "Cancel anytime",
    },
    {
      href: "/team-licenses",
      kicker: "For multi-person agencies",
      title: "Agency Team Licenses",
      tagline:
        "Multi-seat access to the full course library with bulk enrollment, shared playbooks, and quarterly instructor check-ins.",
      priceLabel: "Custom pricing",
      priceNote: "Based on seat count",
    },
  ];

  const items: CatalogItem[] = [...courseItems, ...extras];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "DIY Courses for Insurance Agents",
        url: "https://renewalengineai.com/courses",
        description:
          "Self-paced courses that teach independent insurance agents how to build their own AI-powered retention and agency operations systems.",
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
            name: "Courses",
            item: "https://renewalengineai.com/courses",
          },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: courseItems.map((item, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          url: `https://renewalengineai.com${item.href}`,
          name: item.title,
        })),
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
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="mb-16 max-w-3xl">
              <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-4">
                Learn by doing
              </p>
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                AI Courses for Independent Insurance Agents
              </h1>
              <p className="text-xl text-neutral-300">
                Short, practical, no-fluff training on how to use AI to keep more
                of your book and run your agency like a 10x operator. Built for
                agents who want to do the work themselves.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-blue-600 transition-colors"
                >
                  <p className="text-blue-500 font-bold uppercase tracking-wider text-xs mb-3">
                    {item.kicker}
                  </p>
                  <h2 className="text-2xl font-black mb-3">{item.title}</h2>
                  <p className="text-neutral-400 mb-6 leading-relaxed">
                    {item.tagline}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-black text-white">
                        {item.priceLabel}
                      </span>
                      {item.priceNote && (
                        <span className="block text-sm text-neutral-500">
                          {item.priceNote}
                        </span>
                      )}
                      {item.lessonCount !== undefined && (
                        <span className="block text-sm text-neutral-500">
                          {item.lessonCount} lessons
                        </span>
                      )}
                    </div>
                    <span className="text-blue-500 font-semibold">View →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
