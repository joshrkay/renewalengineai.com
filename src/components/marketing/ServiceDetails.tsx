"use client";
import { RefreshCw, Zap, MessageSquare, Brain, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/marketing/BookingContext";

const services = [
  {
    icon: RefreshCw,
    title: "AI-Powered Renewal Campaigns",
    tagline: "Stop losing policies you could have saved",
    gradient: "from-blue-600 to-cyan-600",
    overview: "Our renewal automation starts working 60-90 days before each policy expires, running personalized outreach campaigns that keep your clients from shopping — or bring them back if they do.",
    howItWorks: [
      "We import your renewal book from your AMS and segment policies by risk level, premium size, and retention probability",
      "AI creates personalized outreach sequences for each client — email, text, and call scripts tailored to their policy history and relationship length",
      "Campaigns trigger automatically at 60, 45, 30, 14, and 7 days before expiration, with escalation rules if no response",
      "Clients who respond are routed to your team with full context. Non-responders get additional touchpoints including value-add content about their coverage",
      "Every interaction is tracked in your dashboard with real-time reporting on retention rates by producer, line, and campaign"
    ],
    results: [
      { stat: "15-20%", label: "Improvement in retention rates" },
      { stat: "3-5X", label: "More renewal touchpoints per policy" },
      { stat: "Zero", label: "Policies that slip through uncontacted" }
    ]
  },
  {
    icon: Zap,
    title: "Instant Lead Response System",
    tagline: "Be the first agent to respond — every time",
    gradient: "from-purple-600 to-blue-600",
    overview: "When a prospect fills out a form, calls your number, or sends an inquiry, our AI responds in under 60 seconds — 24 hours a day, 7 days a week. While your competitors check voicemail Monday morning, you've already started the relationship.",
    howItWorks: [
      "New leads from any source (website, referral partners, lead vendors, social media) are captured and processed instantly by AI",
      "Within 60 seconds, the prospect receives a personalized text and email acknowledging their inquiry and providing next steps",
      "For phone inquiries, our AI receptionist answers, gathers information, qualifies the lead, and books them on your team's calendar",
      "All lead data is organized in your dashboard with qualification scores, source tracking, and follow-up status",
      "High-priority leads trigger instant notifications to your producers with one-click call-back from their mobile device"
    ],
    results: [
      { stat: "<60s", label: "Response time for every lead" },
      { stat: "391%", label: "More conversions from speed-to-lead" },
      { stat: "24/7", label: "Coverage including nights and weekends" }
    ]
  },
  {
    icon: MessageSquare,
    title: "Quote Follow-Up Automation",
    tagline: "Turn more quotes into bound policies",
    gradient: "from-pink-600 to-purple-600",
    overview: "The gap between quoting and binding is where most agencies lose winnable business. Our follow-up system runs personalized multi-touch campaigns for every open quote — so no prospect goes cold while your team is busy with other clients.",
    howItWorks: [
      "Every open quote is tracked from the moment it's issued, with AI monitoring time-since-quote and engagement signals",
      "Automated follow-up sequences run at optimized intervals: Day 1, 3, 7, 14, and 21 post-quote with different messaging at each stage",
      "Messages are personalized with the prospect's name, coverage details, premium amount, and specific value propositions relevant to their situation",
      "If a prospect engages (opens email, clicks link, responds to text), the sequence adapts and can escalate to a direct producer call",
      "Prospects who decline get a graceful close-out and enter a long-term nurture sequence for re-quoting at their next renewal"
    ],
    results: [
      { stat: "50%+", label: "Improvement in quote-to-bind ratio" },
      { stat: "5-7", label: "Touchpoints per prospect (vs. 1-2 average)" },
      { stat: "Zero", label: "Quotes that expire without follow-up" }
    ]
  },
  {
    icon: Brain,
    title: "Client Retention & Cross-Sell Intelligence",
    tagline: "Find hidden revenue in your existing book",
    gradient: "from-orange-600 to-pink-600",
    overview: "Your current clients are your most valuable asset — but most agencies never systematically analyze their book for churn risk or cross-sell opportunities. Our AI does this continuously, surfacing the clients who need attention and the revenue opportunities hiding in plain sight.",
    howItWorks: [
      "AI analyzes your entire book to identify single-policy households, coverage gaps, and accounts that match high cross-sell probability patterns",
      "Churn risk scoring uses payment history, communication frequency, claims experience, and market conditions to flag at-risk policies before they lapse",
      "Monthly reports rank your top cross-sell opportunities with specific coverage recommendations for each client",
      "Automated outreach campaigns for cross-sell opportunities are personalized: \"We noticed your home policy but no umbrella — here's why that matters for you\"",
      "Life event triggers (new home purchase, new vehicle, business formation) automatically notify your team of coverage review opportunities"
    ],
    results: [
      { stat: "8X", label: "ROI from cross-sell campaigns" },
      { stat: "Top 50", label: "Prioritized prospects delivered monthly" },
      { stat: "Early", label: "Warning on at-risk policies before lapse" }
    ]
  },
  {
    icon: BarChart3,
    title: "Agency Operations Dashboard",
    tagline: "See everything that matters at a glance",
    gradient: "from-cyan-600 to-blue-600",
    overview: "Stop guessing and start knowing. Our dashboard gives you real-time visibility into every metric that drives your agency's growth — renewal rates, lead conversion, campaign performance, and team productivity — all in one place.",
    howItWorks: [
      "Live metrics update in real-time: policies renewed, leads captured, quotes issued, policies bound, and revenue impact",
      "Producer-level scorecards show individual performance on renewals, lead response time, and follow-up completion",
      "Campaign analytics reveal which messages, channels, and timing work best — so we continuously optimize your results",
      "Weekly email reports summarize key metrics and highlight areas needing attention, delivered to your inbox every Monday morning",
      "Custom alerts notify you of important events: high-value policy at risk, hot lead waiting, or campaign milestone reached"
    ],
    results: [
      { stat: "100%", label: "Visibility into all automation activity" },
      { stat: "Weekly", label: "Performance reports delivered automatically" },
      { stat: "Real-time", label: "Alerts on high-priority items" }
    ]
  }
];

export function ServiceDetails() {
  const { openBooking } = useBooking();

  return (
    <section id="service-details" className="py-32 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold mb-6">
            Deep Dive
          </div>
          <h2 className="text-6xl lg:text-7xl font-black text-black mb-6">
            How Does Each AI Automation Actually Work?
          </h2>
          <p className="text-2xl text-neutral-600 max-w-3xl mx-auto font-medium">
            We don't just give you software and a login. Here's exactly what our team builds, manages, and optimizes for your agency.
          </p>
        </div>

        {/* Service Deep Dives */}
        <div className="space-y-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-neutral-50 to-white rounded-3xl border-2 border-neutral-100 overflow-hidden"
              >
                {/* Service Header */}
                <div className={`bg-gradient-to-r ${service.gradient} p-8 lg:p-12`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl lg:text-4xl font-black text-white">{service.title}</h3>
                      <p className="text-lg text-white/80 font-medium">{service.tagline}</p>
                    </div>
                  </div>
                  <p className="text-xl text-white/90 max-w-3xl leading-relaxed">{service.overview}</p>
                </div>

                {/* How It Works */}
                <div className="p-8 lg:p-12">
                  <h4 className="text-2xl font-black text-black mb-6">How It Works, Step by Step</h4>
                  <div className="space-y-4 mb-10">
                    {service.howItWorks.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex gap-4 items-start">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                          {stepIndex + 1}
                        </div>
                        <p className="text-lg text-neutral-700 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>

                  {/* Results */}
                  <div className="grid md:grid-cols-3 gap-6 pt-8 border-t-2 border-neutral-100">
                    {service.results.map((result, resultIndex) => (
                      <div key={resultIndex} className="text-center">
                        <div className={`text-4xl font-black bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent mb-1`}>
                          {result.stat}
                        </div>
                        <div className="text-neutral-500 font-semibold text-sm">{result.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Button
            onClick={openBooking}
            className="bg-blue-600 hover:bg-blue-700 !text-white text-xl px-12 py-8 rounded-full font-black transition-all hover:scale-105"
          >
            See Which Services Fit Your Agency
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
}
