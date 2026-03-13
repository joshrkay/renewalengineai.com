import { Zap, RefreshCw, MessageSquare, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Lead Response",
    description: "24/7 automated response to new leads with intelligent routing to your team",
    stat: "5 min",
    label: "Avg Response",
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    icon: RefreshCw,
    title: "Renewal Protection",
    description: "90-day automated campaigns prevent lapses and increase retention",
    stat: "35%",
    label: "Better Retention",
    gradient: "from-purple-600 to-blue-600"
  },
  {
    icon: MessageSquare,
    title: "Quote Follow-Up",
    description: "Every quote gets systematic follow-up until client binds or declines",
    stat: "50%",
    label: "More Conversions",
    gradient: "from-pink-600 to-purple-600"
  },
  {
    icon: BarChart3,
    title: "Full Visibility",
    description: "Real-time dashboard tracks conversions, renewals, and pipeline health",
    stat: "100%",
    label: "Oversight",
    gradient: "from-orange-600 to-pink-600"
  }
];

export function Features() {
  return (
    <section id="solutions" className="py-32 px-6 lg:px-8 bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold mb-6">
            The Solution
          </div>
          <h2 className="text-6xl lg:text-7xl font-black text-black mb-6">
            Automation That Works
          </h2>
          <p className="text-2xl text-neutral-600 max-w-3xl mx-auto font-medium">
            Built, managed, and optimized by our team
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-neutral-100 hover:border-blue-600 overflow-hidden"
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