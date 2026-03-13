import { useState } from "react";
import { Button } from "./ui/button";
import { Check, Sparkles } from "lucide-react";

const offers = [
  {
    key: "audit",
    name: "Operations Audit",
    price: "1,500",
    description: "Identify your biggest automation opportunities",
    features: [
      "5-day workflow assessment",
      "Renewal and pipeline analysis",
      "Custom automation roadmap",
      "ROI projections",
      "Executive presentation"
    ],
    cta: "Start Audit",
    popular: false,
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    key: "sprint",
    name: "Build & Launch",
    price: "6,000",
    description: "Get live in 2 weeks with full automation",
    features: [
      "Everything in Audit, plus:",
      "Complete automation setup",
      "Renewal tracking system",
      "Quote follow-up sequences",
      "Lead response management",
      "Performance dashboard",
      "Team training"
    ],
    cta: "Get Started",
    popular: true,
    gradient: "from-purple-600 to-pink-600"
  },
  {
    key: "managed",
    name: "Managed Ops",
    price: "2,500",
    priceSuffix: "/mo",
    description: "Ongoing management & optimization",
    features: [
      "All Build & Launch systems, plus:",
      "Weekly performance monitoring",
      "Continuous improvements",
      "Monthly reviews",
      "Priority support",
      "Quarterly planning"
    ],
    cta: "Schedule Call",
    popular: false,
    gradient: "from-orange-600 to-pink-600"
  }
];

export function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const startCheckout = async (plan: string) => {
    try {
      setLoadingPlan(plan);
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
    } catch (e) {
      // fallback below
    } finally {
      setLoadingPlan(null);
    }

    window.location.href = '/book';
  };

  return (
    <section id="pricing" className="py-32 px-6 lg:px-8 bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold mb-6">
            Pricing
          </div>
          <h2 className="text-6xl lg:text-7xl font-black text-black mb-6">
            Simple, Clear Pricing
          </h2>
          <p className="text-2xl text-neutral-600 max-w-3xl mx-auto font-medium">
            No software licenses. No per-seat fees. Just results.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl p-10 transition-all duration-300 ${
                offer.popular
                  ? "border-4 border-blue-600 shadow-2xl scale-105"
                  : "border-2 border-neutral-100 hover:border-blue-600 shadow-lg"
              }`}
            >
              {/* Popular Badge */}
              {offer.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-black text-sm">MOST POPULAR</span>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="mb-8">
                <h3 className="text-3xl font-black text-black mb-3">{offer.name}</h3>
                <p className="text-lg text-neutral-600 mb-6">{offer.description}</p>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-6xl font-black text-black">${offer.price}</span>
                  {offer.priceSuffix && <span className="text-2xl font-bold text-neutral-500">{offer.priceSuffix}</span>}
                </div>

                <Button
                  onClick={() => startCheckout(offer.key)}
                  disabled={loadingPlan === offer.key}
                  className={`w-full text-lg py-7 rounded-full font-black transition-all ${
                    offer.popular
                      ? `bg-gradient-to-r ${offer.gradient} !text-white hover:scale-105 shadow-xl`
                      : "bg-black !text-white hover:bg-neutral-800"
                  }`}
                >
                  {loadingPlan === offer.key ? 'Redirecting…' : offer.cta}
                </Button>
              </div>

              {/* Features */}
              <ul className="space-y-4">
                {offer.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      feature.includes("Everything") || feature.includes("All")
                        ? `bg-gradient-to-br ${offer.gradient}`
                        : "bg-neutral-100"
                    }`}>
                      <Check className={`h-4 w-4 ${
                        feature.includes("Everything") || feature.includes("All") ? "text-white" : "text-neutral-600"
                      }`} />
                    </div>
                    <span className={`text-lg ${
                      feature.includes("Everything") || feature.includes("All")
                        ? "font-black text-black"
                        : "text-neutral-700"
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-black to-neutral-800 p-12 rounded-3xl">
            <p className="text-3xl font-black text-white mb-6">
              Not sure which package fits your agency?
            </p>
            <Button className="bg-white !text-black hover:bg-neutral-100 text-xl px-12 py-8 rounded-full font-black transition-all hover:scale-105">
              Schedule Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}