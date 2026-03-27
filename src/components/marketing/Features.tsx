import { RefreshCw, Zap, MessageSquare, Brain, BarChart3 } from "lucide-react";

const features = [
  {
    icon: RefreshCw,
    title: "AI-Powered Renewal Campaigns",
    description: "Proactive 60-day outreach sequences contact clients via email, text, and voice before renewal dates. Personalized to each client's policy details and history.",
    stat: "95%+",
    label: "Retention Rate",
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    icon: Zap,
    title: "Instant Lead Response System",
    description: "AI receptionist answers calls and messages 24/7. New leads get a response in under 60 seconds via text, email, or AI-powered call-back. Never miss a prospect again.",
    stat: "<60s",
    label: "Response Time",
    gradient: "from-purple-600 to-blue-600"
  },
  {
    icon: MessageSquare,
    title: "Quote Follow-Up Automation",
    description: "Every quoted prospect receives a personalized multi-touch sequence until they bind or decline. No lead falls through the cracks.",
    stat: "50%+",
    label: "More Binds",
    gradient: "from-pink-600 to-purple-600"
  },
  {
    icon: Brain,
    title: "Client Retention & Cross-Sell Intelligence",
    description: "AI analyzes your book to predict churn risk and identify cross-sell opportunities. Surface hidden revenue in your existing client base automatically.",
    stat: "8X",
    label: "ROI Potential",
    gradient: "from-orange-600 to-pink-600"
  },
  {
    icon: BarChart3,
    title: "Agency Operations Dashboard",
    description: "Real-time visibility into renewal pipelines, lead response metrics, campaign performance, and team productivity. Weekly reports delivered to your inbox.",
    stat: "100%",
    label: "Visibility",
    gradient: "from-cyan-600 to-blue-600"
  }
];

export function Features() {
  return (
    <section id="solutions" className="py-32 px-6 lg:px-8 bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold mb-6">
            AI Automation Services
          </div>
          <h2 className="text-6xl lg:text-7xl font-black text-black mb-6">
            How Does AI Automation Work for Insurance Agencies?
          </h2>
          <p className="text-2xl text-neutral-600 max-w-3xl mx-auto font-medium">
            Five done-for-you AI systems built, managed, and optimized by our team — specifically for independent insurance agencies
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-neutral-100 hover:border-blue-600 overflow-hidden ${
                  index === 4 ? "md:col-span-2 md:max-w-xl md:mx-auto" : ""
                }`}
              >
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                <div className="relative">
                  {/* Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-3xl font-black text-black mb-4">{feature.title}</h3>
                  <p className="text-xl text-neutral-600 mb-8 leading-relaxed">{feature.description}</p>

                  {/* Stat */}
                  <div className="flex items-end gap-3 pt-6 border-t-2 border-neutral-100">
                    <div className={`text-5xl font-black bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                      {feature.stat}
                    </div>
                    <div className="text-lg font-bold text-neutral-500 pb-1">{feature.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
