import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { FreeGuideForm } from "@/components/marketing/FreeGuideForm";
import { Clock, Zap, TrendingUp, Shield, Users, Check } from "lucide-react";

export const metadata: Metadata = {
  title:
    "Free Guide: 5 AI Automations Every Insurance Agent Should Set Up This Week | RenewalEngineAI",
  description:
    "Discover how top insurance agents save 15+ hours weekly with AI automation. Free step-by-step guide: renewal sequences, lead response, quote follow-up, retention intelligence, and cross-sell automation.",
  alternates: { canonical: "https://renewalengineai.com/free-guide" },
  openGraph: {
    type: "website",
    url: "https://renewalengineai.com/free-guide",
    title: "5 AI Automations Every Insurance Agent Should Set Up This Week",
    description:
      "Discover how top insurance agents save 15+ hours weekly with AI automation. Free guide.",
    siteName: "RenewalEngineAI",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const automations = [
  {
    icon: Clock,
    title: "Renewal Outreach Sequences",
    hook: "The 60/30/14/7-day system that runs while you sleep",
    payoff: "Saves 8–10 hrs/wk on manual renewal tracking",
  },
  {
    icon: Zap,
    title: "Instant Lead Response",
    hook: "Respond in under 60 seconds, 24/7",
    payoff: "391% more conversions (78% of buyers pick the first agent to reply)",
  },
  {
    icon: TrendingUp,
    title: "Quote Follow-Up Automation",
    hook: "Every quote gets a personalized 5-touch sequence until bind or decline",
    payoff: "Close 28% more quoted deals",
  },
  {
    icon: Shield,
    title: "Retention Intelligence",
    hook: "Predict which clients will lapse 60 days before they do",
    payoff: "Prevent 90% of non-renewals before they happen",
  },
  {
    icon: Users,
    title: "Cross-Sell & Round-Out",
    hook: "AI finds hidden revenue in your existing book",
    payoff: "Lift revenue per client 15–25%",
  },
];

const proofRows = [
  {
    name: "Mike R. — Austin, TX",
    book: "P&C, 3 agents, 520 policies",
    result: "Added renewal automation — saved 12 hrs/week, retention 84% → 92%",
  },
  {
    name: "Lisa T. — Denver, CO",
    book: "Personal lines, solo producer, 280 policies",
    result: "Lead response 4.2 hrs → 28 min, closed 3 extra bundles in first month",
  },
  {
    name: "Carlos M. — Miami, FL",
    book: "Commercial, 5 agents, 190 accounts",
    result: "Quote follow-up automation → 28% more binds, zero extra outreach time",
  },
];

export default function FreeGuidePage() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-black text-white">
        <Header />

        {/* Hero + form */}
        <main className="pt-28 pb-24">
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-black to-black" />
            <div className="absolute top-20 right-20 w-72 h-72 bg-green-600 rounded-full blur-[120px] opacity-20" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-10" />

            <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-20 grid lg:grid-cols-5 gap-12 items-center">
              {/* Left: pitch */}
              <div className="lg:col-span-3">
                <span
                  className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 text-white"
                  style={{ backgroundColor: "#10b981" }}
                >
                  Free Guide · 12-Minute Read
                </span>
                <h1 className="text-5xl lg:text-7xl font-black leading-[1.03] tracking-tight mb-6">
                  Discover How Top Agents{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                    Save 15+ Hours Weekly
                  </span>{" "}
                  with AI
                </h1>
                <p className="text-xl lg:text-2xl text-neutral-300 mb-8 leading-relaxed">
                  A step-by-step guide for independent P&amp;C agents showing
                  the 5 AI automations that are quietly separating the top 20%
                  of agencies from everyone else. Copy their playbook — no
                  developers, no $50k software, no AI experience required.
                </p>

                <ul className="space-y-3 mb-10">
                  {[
                    "Save 15+ hours weekly on manual renewal & follow-up tasks",
                    "Respond to every lead in under 60 seconds, 24/7",
                    "Improve renewal retention 15–25% without hiring",
                    "Boost quote-to-bind conversion up to 391%",
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
              </div>

              {/* Right: form */}
              <div className="lg:col-span-2">
                <div className="bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-3xl p-8 shadow-2xl">
                  <h2 className="text-2xl font-black mb-2">
                    Get instant access
                  </h2>
                  <p className="text-neutral-400 mb-6 text-sm">
                    Enter your email — we&apos;ll send the guide to your inbox
                    and show it to you immediately on the next page.
                  </p>
                  <FreeGuideForm source="free_guide_hero" />
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
                  The 5 automations, start to finish
                </h2>
                <p className="text-lg text-neutral-400">
                  Each one includes the exact tools, setup steps, prompt
                  examples, and time-saved benchmark so you can implement it
                  this week.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {automations.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div
                      key={a.title}
                      className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 hover:border-green-600/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center"
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
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-500">
                          Automation #{i + 1}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black mb-2">{a.title}</h3>
                      <p className="text-neutral-300 mb-3">{a.hook}</p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "#10b981" }}
                      >
                        → {a.payoff}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Social proof */}
          <section className="py-20 border-t border-neutral-900 bg-gradient-to-b from-black to-neutral-950">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <p
                  className="font-bold uppercase tracking-wider text-sm mb-3"
                  style={{ color: "#10b981" }}
                >
                  Real agents. Real results.
                </p>
                <h2 className="text-4xl lg:text-5xl font-black mb-4">
                  Agents who implemented this guide
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {proofRows.map((row) => (
                  <div
                    key={row.name}
                    className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6"
                  >
                    <div className="text-sm font-black text-white mb-1">
                      {row.name}
                    </div>
                    <div className="text-xs text-neutral-500 mb-4">
                      {row.book}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "#a7f3d0" }}
                    >
                      {row.result}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom form */}
          <section className="py-20 border-t border-neutral-900">
            <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-4xl lg:text-5xl font-black mb-4">
                Grab the guide before your next renewal cycle
              </h2>
              <p className="text-lg text-neutral-400 mb-8">
                If just one of these 5 automations saves you 3 hours a week,
                that&apos;s 150+ hours a year back. Download, implement, renew
                more of your book.
              </p>
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 shadow-2xl text-left">
                <FreeGuideForm source="free_guide_bottom" />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </BookingProvider>
  );
}
