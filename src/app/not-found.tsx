import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page doesn't exist. Browse our guides, case studies, and courses on AI automation for independent insurance agencies.",
  robots: { index: false, follow: true },
};

// Kept self-contained (no Header/Footer, which need BookingProvider) so the
// 404 renders even when a request falls outside the marketing route group.
// Links give crawlers that land on a dead URL a path back into the site.
const destinations = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/resources", label: "Guides & playbooks" },
  { href: "/case-studies", label: "Case studies" },
  { href: "/compare", label: "Compare" },
  { href: "/courses", label: "Courses" },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full">
        <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-4">
          404
        </p>
        <h1 className="text-5xl md:text-6xl font-black mb-6">
          We couldn&rsquo;t find that page
        </h1>
        <p className="text-neutral-400 text-lg mb-10 leading-relaxed">
          The link may be out of date or mistyped. Here&rsquo;s where most
          people are headed:
        </p>
        <ul className="grid sm:grid-cols-2 gap-3">
          {destinations.map((d) => (
            <li key={d.href}>
              <Link
                href={d.href}
                className="block rounded-lg border border-neutral-800 px-5 py-4 font-semibold hover:border-blue-600 hover:text-blue-400 transition-colors"
              >
                {d.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
