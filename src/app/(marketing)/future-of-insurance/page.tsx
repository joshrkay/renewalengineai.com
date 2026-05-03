import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { FreeGuideForm } from "@/components/marketing/FreeGuideForm";
import {
  BookOpen,
  Clock,
  TrendingUp,
  Shield,
  Building2,
  Heart,
  Briefcase,
  Truck,
  Home,
  Car,
  Cpu,
  Waves,
  Check,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "The Next 30 Years of Insurance — Free 20-Page Field Manual for Independent Agents | RenewalEngineAI",
  description:
    "A practical 20-page guide for independent insurance agents covering how the business changed from 1995–2025, how AI will reshape it through 2055, and what the job looks like across all 15 major lines of insurance.",
  alternates: { canonical: "https://renewalengineai.com/future-of-insurance" },
  openGraph: {
    type: "website",
    url: "https://renewalengineai.com/future-of-insurance",
    title:
      "The Next 30 Years of Insurance — An Independent Agent's Field Manual",
    description:
      "Free 20-page ebook: how insurance changed from 1995–2025, how AI reshapes it through 2055, and what your job looks like across all 15 major lines.",
    siteName: "RenewalEngineAI",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const chapters = [
  {
    icon: Clock,
    title: "Part I — The last 30 years",
    blurb:
      "What actually changed from 1995 to 2025 — comparative raters, direct writers, AMS, online leads, carrier portals — and what your job became.",
  },
  {
    icon: TrendingUp,
    title: "Part II — The next 30 years",
    blurb:
      "The three structural shifts already underway: continuous underwriting, advice-as-product, and the unbundling of distribution from sales.",
  },
  {
    icon: BookOpen,
    title: "Part III — Line by line, 2025 → 2055",
    blurb:
      "All 15 major lines, each with the same template: 1995 → 2025 → 2055 → what your job becomes → one thing to do this year.",
  },
  {
    icon: Shield,
    title: "Part IV — The agent who survives",
    blurb:
      "A 2055 job description for the independent agent — the work AI doesn't do, and how it pays.",
  },
  {
    icon: Briefcase,
    title: "Part V — Your 12-month action plan",
    blurb:
      "Month-by-month: what to take stock of, what to automate, where to move up-market, and how to compound for the next 24 months.",
  },
];

const lines = [
  { icon: Car, label: "Personal Auto" },
  { icon: Home, label: "Homeowners" },
  { icon: Building2, label: "Renters" },
  { icon: Shield, label: "Personal Umbrella" },
  { icon: Heart, label: "Life" },
  { icon: Heart, label: "Health & Medicare" },
  { icon: Briefcase, label: "Disability" },
  { icon: Truck, label: "Commercial Auto" },
  { icon: Building2, label: "Commercial Property" },
  { icon: Briefcase, label: "CGL" },
  { icon: Briefcase, label: "Workers' Comp" },
  { icon: Briefcase, label: "E&O / Pro Liability" },
  { icon: Cpu, label: "Cyber" },
  { icon: Building2, label: "BOP" },
  { icon: Waves, label: "Flood" },
];

export default function FutureOfInsurancePage() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-black text-white">
        <Header />

        <main className="pt-28 pb-24">
          {/* Hero + form */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-black to-black" />
            <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-600 rounded-full blur-[120px] opacity-20" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-15" />

            <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-20 grid lg:grid-cols-5 gap-12 items-center">
              <div className="lg:col-span-3">
                <span
                  className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 text-white"
                  style={{ backgroundColor: "#10b981" }}
                >
                  Free 20-Page Field Manual
                </span>
                <h1 className="text-5xl lg:text-7xl font-black leading-[1.03] tracking-tight mb-6">
                  The Next 30 Years of{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                    Insurance
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-neutral-300 mb-8 leading-relaxed">
                  An independent agent&apos;s field manual for the AI era. How
                  the business changed from 1995 to 2025, how it changes again
                  by 2055, and exactly what your job looks like across all 15
                  major lines of insurance.
                </p>

                <ul className="space-y-3 mb-10">
                  {[
                    "All 15 lines of business — from Personal Auto to Cyber to Flood",
                    "Same template every line: 1995 → 2025 → 2055 → your job → one action this year",
                    "A 2055 job description for the agent who survives",
                    "12-month, month-by-month action plan you can run starting Monday",
                  ].map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: "#10b981" }}
                      >
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-lg text-neutral-200">{bullet}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-neutral-500">
                  Written for independent P&amp;C agents and agency owners. No
                  fluff, no AI hype — just where the business is going and what
                  to do about it.
                </p>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-3xl p-8 shadow-2xl">
                  <h2 className="text-2xl font-black mb-2">
                    Get the field manual
                  </h2>
                  <p className="text-neutral-400 mb-6 text-sm">
                    Enter your email — we&apos;ll send the 20-page PDF to your
                    inbox and show you the full manual on the next page.
                  </p>
                  <FreeGuideForm
                    source="future_of_insurance_hero"
                    ctaLabel="Send Me the Field Manual"
                    redirectPath="/future-of-insurance/read"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* What's inside */}
          <section className="py-20 border-t border-neutral-900">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <div className="max-w-2xl mb-12">
                <p
                  className="font-bold uppercase tracking-wider text-sm mb-3"
                  style={{ color: "#10b981" }}
                >
                  What&apos;s inside
                </p>
                <h2 className="text-4xl lg:text-5xl font-black mb-4">
                  Five parts. Twenty pages. Built for actual agents.
                </h2>
                <p className="text-lg text-neutral-400">
                  No vendor fluff, no AI doom-mongering. Just a clear-eyed
                  walk-through of what changed, what&apos;s changing, and what
                  to do about it.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapters.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div
                      key={c.title}
                      className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 hover:border-emerald-600/50 transition-colors"
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                        style={{
                          backgroundColor: "rgba(16,185,129,0.15)",
                          border: "1px solid rgba(16,185,129,0.35)",
                        }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: "#10b981" }}
                        />
                      </div>
                      <h3 className="text-xl font-black mb-2">{c.title}</h3>
                      <p className="text-neutral-300 text-sm leading-relaxed">
                        {c.blurb}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* All 15 lines */}
          <section className="py-20 border-t border-neutral-900 bg-gradient-to-b from-black to-neutral-950">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <p
                  className="font-bold uppercase tracking-wider text-sm mb-3"
                  style={{ color: "#10b981" }}
                >
                  Every line you write
                </p>
                <h2 className="text-4xl lg:text-5xl font-black mb-4">
                  All 15 lines of business, broken down line by line
                </h2>
                <p className="text-lg text-neutral-400">
                  Each one gets the same five-point treatment so you can flip
                  to your line, see where it&apos;s going, and know exactly
                  what to do this quarter.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {lines.map((l) => {
                  const Icon = l.icon;
                  return (
                    <div
                      key={l.label}
                      className="bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-5 flex flex-col items-center text-center gap-3 hover:border-emerald-600/50 transition-colors"
                    >
                      <Icon
                        className="h-6 w-6"
                        style={{ color: "#10b981" }}
                      />
                      <span className="text-sm font-bold text-neutral-200">
                        {l.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Who this is for */}
          <section className="py-20 border-t border-neutral-900">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <p
                    className="font-bold uppercase tracking-wider text-sm mb-3"
                    style={{ color: "#10b981" }}
                  >
                    Who this is for
                  </p>
                  <h3 className="text-2xl font-black mb-4">
                    Independent agents who want to stay independent.
                  </h3>
                  <ul className="space-y-3 text-neutral-300">
                    <li className="flex items-start gap-2">
                      <Check
                        className="h-5 w-5 mt-0.5 flex-shrink-0"
                        style={{ color: "#10b981" }}
                      />
                      <span>
                        Agency owners planning the next 5–10 years of the book
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check
                        className="h-5 w-5 mt-0.5 flex-shrink-0"
                        style={{ color: "#10b981" }}
                      />
                      <span>
                        Producers who want to move up-market and stop chasing
                        $400 BOPs
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check
                        className="h-5 w-5 mt-0.5 flex-shrink-0"
                        style={{ color: "#10b981" }}
                      />
                      <span>
                        CSRs and ops leads thinking about where their role goes
                        next
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p
                    className="font-bold uppercase tracking-wider text-sm mb-3 text-neutral-500"
                  >
                    Who this is NOT for
                  </p>
                  <h3 className="text-2xl font-black mb-4">
                    People looking for an AI hype piece.
                  </h3>
                  <ul className="space-y-3 text-neutral-400">
                    <li>
                      → No &quot;AI will replace all agents in 5 years&quot;
                      doom
                    </li>
                    <li>
                      → No vendor pitch slide deck disguised as an ebook
                    </li>
                    <li>
                      → No generic productivity advice you&apos;ve read in 100
                      LinkedIn posts
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom form */}
          <section className="py-20 border-t border-neutral-900">
            <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-4xl lg:text-5xl font-black mb-4">
                Free download. Read in one sitting.
              </h2>
              <p className="text-lg text-neutral-400 mb-8">
                One email, one PDF, zero spam. The agencies that figure this
                out in the next 24 months will own the next 24 years.
              </p>
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 shadow-2xl text-left">
                <FreeGuideForm
                  source="future_of_insurance_bottom"
                  ctaLabel="Send Me the Field Manual"
                  redirectPath="/future-of-insurance/read"
                />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </BookingProvider>
  );
}
