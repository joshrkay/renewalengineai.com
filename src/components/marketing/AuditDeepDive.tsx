"use client";
import { FileText, BarChart3, Target, Lightbulb, Presentation, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/marketing/BookingContext";

const deliverables = [
  {
    icon: FileText,
    title: "Complete Book Analysis",
    description: "We pull your policy data and analyze every renewal, lapse, and missed opportunity from the last 12 months. You'll see exactly which policies lapsed, why, and how much revenue walked out the door.",
    detail: "Includes: Lapse rate by line of business, seasonal patterns, producer-level retention, and premium-at-risk breakdown."
  },
  {
    icon: BarChart3,
    title: "Lead Response Audit",
    description: "We measure how fast your agency responds to new leads — web forms, phone calls, referrals. Most agencies discover they're 10-100x slower than the 60-second benchmark that converts.",
    detail: "Includes: Average response time by channel, after-hours lead capture rate, and estimated revenue lost to slow response."
  },
  {
    icon: Target,
    title: "Follow-Up Gap Analysis",
    description: "We trace the journey of every quote from initial request to bind or decline. The drop-off points reveal exactly where your team is losing winnable business.",
    detail: "Includes: Quote-to-bind ratio, average follow-up touches before close, and unquoted leads sitting in your pipeline."
  },
  {
    icon: Lightbulb,
    title: "Cross-Sell Opportunity Map",
    description: "AI scans your book to identify clients with coverage gaps — single-policy households, missing umbrella coverage, life insurance opportunities, and commercial accounts with incomplete programs.",
    detail: "Includes: Top 50 cross-sell prospects ranked by likelihood, estimated additional premium per account."
  },
  {
    icon: Presentation,
    title: "Custom Automation Roadmap",
    description: "Based on your data, we build a prioritized implementation plan: which automations to deploy first, expected impact, and a realistic timeline. This isn't generic — it's built from your actual numbers.",
    detail: "Includes: 90-day implementation plan, expected ROI per automation, and resource requirements."
  },
  {
    icon: Clock,
    title: "Executive ROI Report",
    description: "A clear, presentation-ready report showing total revenue at risk, recovery potential, and the expected return on each automation investment. Built to share with partners and stakeholders.",
    detail: "Includes: Before/after projections, cost-benefit analysis, and payback period for each package tier."
  }
];

const timeline = [
  { day: "Day 1", task: "Kickoff call — we review your current systems, AMS setup, and team structure" },
  { day: "Day 1-2", task: "Data extraction — we pull policy data, lead logs, and follow-up records from your AMS" },
  { day: "Day 2-3", task: "AI analysis — our systems process your data to identify patterns, gaps, and opportunities" },
  { day: "Day 3-4", task: "Roadmap building — we create your custom automation plan with ROI projections" },
  { day: "Day 5", task: "Presentation call — we walk you through every finding and recommendation" },
];

export function AuditDeepDive() {
  const { openBooking } = useBooking();

  return (
    <section id="audit-details" className="py-32 px-6 lg:px-8 bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold mb-6">
            The Audit
          </div>
          <h2 className="text-6xl lg:text-7xl font-black text-black mb-6">
            What Do You Get in the Renewal Leak Audit?
          </h2>
          <p className="text-2xl text-neutral-600 max-w-3xl mx-auto font-medium">
            In 5 days, we analyze your agency's data and deliver a complete picture of where revenue is leaking — and exactly how to fix it with AI automation.
          </p>
        </div>

        {/* Deliverables Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {deliverables.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl border-2 border-neutral-100 hover:border-blue-600 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-black mb-3">{item.title}</h3>
                <p className="text-neutral-600 leading-relaxed mb-4">{item.description}</p>
                <p className="text-sm text-blue-600 font-semibold">{item.detail}</p>
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto mb-16">
          <h3 className="text-4xl font-black text-black mb-10 text-center">
            5-Day Audit Timeline
          </h3>
          <div className="space-y-4">
            {timeline.map((step, index) => (
              <div
                key={index}
                className="flex gap-6 items-start bg-white p-6 rounded-2xl border border-neutral-100"
              >
                <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-black text-sm whitespace-nowrap">
                  {step.day}
                </div>
                <p className="text-lg text-neutral-700">{step.task}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What to Expect */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-4xl font-black mb-6">
            What Should You Expect After the Audit?
          </h3>
          <div className="grid md:grid-cols-3 gap-8 mb-10 max-w-4xl mx-auto">
            <div>
              <div className="text-5xl font-black mb-2">$$$</div>
              <div className="text-blue-100 font-semibold">Exact dollar amount of revenue at risk from lapsing policies and slow lead response</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">90-Day</div>
              <div className="text-blue-100 font-semibold">Prioritized roadmap showing which automations to deploy first for maximum impact</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">Clear ROI</div>
              <div className="text-blue-100 font-semibold">Before/after projections so you know exactly what the investment will return</div>
            </div>
          </div>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Most agencies discover they're leaving $50,000–$200,000+ in recoverable revenue on the table. The audit pays for itself the moment you act on the findings.
          </p>
          <Button
            onClick={openBooking}
            className="bg-white !text-blue-600 hover:bg-blue-50 text-xl px-12 py-8 rounded-full font-black transition-all hover:scale-105"
          >
            Book Your Free Audit Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}
