"use client";
import { Star, Quote, ShieldCheck, TrendingUp, Clock } from "lucide-react";

const guarantee = {
  headline: "The 30-Day Results Guarantee",
  body: "We deploy your first AI automation within 14 days or you don\u2019t pay setup. If you don\u2019t see measurable improvement in lead response time or renewal outreach volume within 30 days, we work free until you do.",
};

const credibilityPoints = [
  {
    icon: TrendingUp,
    stat: "391%",
    label: "avg. lift in lead-to-contact rate when response time drops below 60 seconds",
    source: "InsideSales / HBR research",
  },
  {
    icon: Clock,
    stat: "14 days",
    label: "average time from signed agreement to live AI automation for our clients",
    source: "RenewalEngineAI deployment data",
  },
  {
    icon: ShieldCheck,
    stat: "100%",
    label: "insurance-specific\u2014we only build automations for independent agencies and brokers",
    source: "Our focus, our promise",
  },
];

const earlyAdopterQuotes = [
  {
    quote:
      "The renewal follow-up automation alone would have saved me 6 hours a week. The fact that it also recovers policies I would\u2019ve lost\u2014that\u2019s pure profit.",
    name: "Independent Agency Owner",
    agency: "Personal Lines, Southwest",
    result: "Pilot participant",
  },
  {
    quote:
      "I\u2019ve tried three different CRM tools to automate my follow-ups. None of them understood insurance workflows. RenewalEngineAI built exactly what I needed in two weeks.",
    name: "Commercial Lines Broker",
    agency: "15-person agency, Mountain West",
    result: "Pilot participant",
  },
  {
    quote:
      "My biggest fear was the setup being complicated. They handled everything\u2014AMS integration, email sequences, the whole workflow. I just approved it.",
    name: "Agency Principal",
    agency: "Multi-line independent, Pacific Northwest",
    result: "Pilot participant",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold mb-6 text-sm uppercase tracking-wider">
            Agencies Using RenewalEngineAI See Results in 30 Days
          </div>
          <h2 className="text-5xl lg:text-6xl font-black text-black mb-4">
            Built for Agencies Who Are Done Leaving Money on the Table
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            We only work with independent agencies and brokers. Every automation we build is tested against real insurance workflows.
          </p>
        </div>

        {/* Credibility Stats Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {credibilityPoints.map((point, i) => {
            const Icon = point.icon;
            return (
              <div key={i} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-8">
                <Icon className="h-8 w-8 text-blue-600 mb-4" />
                <div className="text-4xl font-black text-black mb-2">{point.stat}</div>
                <p className="text-neutral-700 font-medium mb-2">{point.label}</p>
                <p className="text-xs text-neutral-400 uppercase tracking-wider">{point.source}</p>
              </div>
            );
          })}
        </div>

        {/* Early Adopter Quotes */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {earlyAdopterQuotes.map((quote, i) => (
            <div key={i} className="bg-gradient-to-br from-neutral-900 to-black rounded-2xl p-8 relative">
              <Quote className="h-8 w-8 text-blue-500 mb-4 opacity-60" />
              <p className="text-white text-lg leading-relaxed mb-6 font-medium">
                &ldquo;{quote.quote}&rdquo;
              </p>
              <div className="border-t border-neutral-700 pt-4">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white font-bold text-sm">{quote.name}</p>
                <p className="text-neutral-400 text-sm">{quote.agency}</p>
                <span className="inline-block mt-2 bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full font-semibold">
                  {quote.result}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 30-Day Results Guarantee */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white mb-2">{guarantee.headline}</h3>
            <p className="text-blue-100 text-lg leading-relaxed">{guarantee.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
