"use client";
import { Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/marketing/BookingContext";

const phases = [
  {
    phase: "Week 0",
    title: "Free Discovery Call",
    duration: "30 minutes",
    description: "Before you invest a dollar, we jump on a call to understand your agency — size of your book, AMS system, team structure, and biggest pain points. We'll give you an honest assessment of whether AI automation is right for you right now.",
    deliverables: [
      "Preliminary assessment of automation fit",
      "High-level ROI estimate based on your book size",
      "Recommended package and scope",
      "Answers to all your questions — no hard sell"
    ],
    milestone: "Decision point: proceed with the audit or wait",
    color: "blue"
  },
  {
    phase: "Week 1",
    title: "AI-Powered Renewal Audit ($1,500)",
    duration: "5 business days",
    description: "This is where we dig into your data. We connect to your AMS, extract 12 months of policy data, and run it through our analysis systems. By the end of the week, you'll know exactly where revenue is leaking and what it costs you.",
    deliverables: [
      "Complete lapse analysis by line, producer, and season",
      "Lead response time audit across all channels",
      "Quote follow-up gap analysis with drop-off points",
      "Cross-sell opportunity report with top 50 prospects",
      "Custom automation roadmap with ROI projections",
      "Executive presentation for your team/partners"
    ],
    milestone: "You see your numbers and decide which automations to build first",
    color: "purple"
  },
  {
    phase: "Weeks 2-3",
    title: "Build & Launch ($6,000)",
    duration: "10-12 business days",
    description: "Our team builds your custom AI automation systems. Not templates — actual workflows configured to your agency's data, branding, and processes. We test everything before going live.",
    deliverables: [
      "AI renewal campaign system with 60-day sequences",
      "Instant lead response automation (<60 second reply)",
      "Quote follow-up sequences (21-day multi-touch)",
      "Agency operations dashboard with live metrics",
      "AMS integration and data sync",
      "Team training session (recorded for future hires)",
      "Go-live monitoring with real-time oversight"
    ],
    milestone: "Your AI systems are live and running. You'll see first results within days.",
    color: "pink"
  },
  {
    phase: "Month 2+",
    title: "Managed Operations ($2,500/mo)",
    duration: "Ongoing",
    description: "This is where the compounding value kicks in. We monitor your systems weekly, optimize messaging and timing based on performance data, and expand automation as your agency grows. You focus on relationships and growth — we run the systems.",
    deliverables: [
      "Weekly performance monitoring and optimization",
      "Monthly strategy review calls with your team",
      "Continuous A/B testing of messages and timing",
      "Cross-sell intelligence reports (updated monthly)",
      "Quarterly automation expansion planning",
      "Priority support and dedicated automation manager",
      "Ongoing AMS data sync and system maintenance"
    ],
    milestone: "By month 3-6, most agencies see 8X+ ROI on their total investment",
    color: "orange"
  }
];

const expectations = [
  { timeframe: "Week 1", expectation: "You know your exact revenue leak: lapse rate, response gaps, and follow-up holes — with dollar amounts" },
  { timeframe: "Week 3", expectation: "AI systems go live. Renewal campaigns start running. Lead response drops to under 60 seconds." },
  { timeframe: "Month 1", expectation: "First measurable results: leads captured after hours, renewal touchpoints completed, quotes followed up" },
  { timeframe: "Month 3", expectation: "Retention improvement visible in your numbers. Quote-to-bind ratio increasing. Team reporting less busywork." },
  { timeframe: "Month 6", expectation: "Full ROI realization. Most agencies recover the entire investment and see net-positive returns by this point." },
  { timeframe: "Month 12", expectation: "Compounding gains: larger book, higher retention, more new business — all without adding headcount." }
];

export function DetailedTimeline() {
  const { openBooking } = useBooking();

  return (
    <section id="detailed-timeline" className="py-32 px-6 lg:px-8 bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full font-bold mb-6">
            <Calendar className="h-4 w-4" />
            Your Journey
          </div>
          <h2 className="text-6xl lg:text-7xl font-black text-black mb-6">
            What Happens After You Sign Up?
          </h2>
          <p className="text-2xl text-neutral-600 max-w-3xl mx-auto font-medium">
            A clear, week-by-week breakdown of every phase — what you pay, what you get, and when you see results
          </p>
        </div>

        {/* Phases */}
        <div className="space-y-8 mb-20">
          {phases.map((phase, index) => {
            const colorMap: Record<string, string> = {
              blue: "border-l-blue-600",
              purple: "border-l-purple-600",
              pink: "border-l-pink-600",
              orange: "border-l-orange-600"
            };
            const bgMap: Record<string, string> = {
              blue: "bg-blue-600",
              purple: "bg-purple-600",
              pink: "bg-pink-600",
              orange: "bg-orange-600"
            };

            return (
              <div
                key={index}
                className={`bg-white rounded-3xl border-2 border-neutral-100 border-l-8 ${colorMap[phase.color]} overflow-hidden`}
              >
                <div className="p-8 lg:p-10">
                  {/* Phase Header */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`${bgMap[phase.color]} text-white px-4 py-1 rounded-full font-black text-sm`}>
                      {phase.phase}
                    </span>
                    <span className="text-neutral-400 font-semibold text-sm">{phase.duration}</span>
                  </div>

                  <h3 className="text-3xl font-black text-black mb-4">{phase.title}</h3>
                  <p className="text-lg text-neutral-600 leading-relaxed mb-6">{phase.description}</p>

                  {/* Deliverables */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-3">What You Receive</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {phase.deliverables.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-neutral-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestone */}
                  <div className="bg-neutral-50 rounded-xl p-4">
                    <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Milestone: </span>
                    <span className="text-neutral-700">{phase.milestone}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* When to Expect Results */}
        <div className="mb-16">
          <h3 className="text-4xl font-black text-black mb-10 text-center">
            When Will You See Results?
          </h3>
          <div className="space-y-3">
            {expectations.map((item, index) => (
              <div key={index} className="flex gap-4 items-start bg-white p-5 rounded-2xl border border-neutral-100">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap">
                  {item.timeframe}
                </div>
                <p className="text-lg text-neutral-700">{item.expectation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={openBooking}
            className="bg-blue-600 hover:bg-blue-700 !text-white text-xl px-12 py-8 rounded-full font-black transition-all hover:scale-105"
          >
            Start with a Free Discovery Call
          </Button>
          <p className="text-neutral-500 mt-4">
            30 minutes. No commitment. We'll tell you honestly if AI automation is right for your agency right now.
          </p>
        </div>
      </div>
    </section>
  );
}
