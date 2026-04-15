import { PhoneOff, TrendingDown, Clock, ClipboardList, Search } from "lucide-react";

const painPoints = [
  {
    icon: PhoneOff,
    title: "Unanswered Calls",
    stat: "30% of calls go unanswered",
    description: "Every missed call is a lost policy. Agencies without AI coverage are leaving revenue on the table after hours and during peak times.",
    color: "from-red-600 to-orange-600"
  },
  {
    icon: TrendingDown,
    title: "Lost Renewals",
    stat: "15-20% lapse annually",
    description: "Without proactive outreach, policies lapse silently. Most agencies don't contact clients until it's too late.",
    color: "from-orange-600 to-amber-600"
  },
  {
    icon: Clock,
    title: "Slow Lead Response",
    stat: "78% buy from first responder",
    description: "Leads go cold in minutes, not days. If you're not responding in under 60 seconds, your competitors are.",
    color: "from-amber-600 to-yellow-600"
  },
  {
    icon: ClipboardList,
    title: "Manual Admin Overload",
    stat: "40%+ time on non-revenue tasks",
    description: "Your team spends nearly half their day on data entry, follow-ups, and paperwork instead of selling and serving clients.",
    color: "from-yellow-600 to-orange-600"
  },
  {
    icon: Search,
    title: "No Cross-Sell Intelligence",
    stat: "Hidden revenue goes untapped",
    description: "Opportunities to round out accounts sit buried in your book. Without AI analysis, cross-sell revenue stays invisible.",
    color: "from-orange-600 to-red-600"
  }
];

export function PainPoints() {
  return (
    <section id="problems" className="py-32 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-7xl font-black text-black mb-6">
            Why Are Insurance Agencies Struggling to Grow?
          </h2>
          <p className="text-2xl text-neutral-600 max-w-3xl mx-auto font-medium">
            These five problems cost agencies thousands in lost revenue every month
          </p>
        </div>

        {/* Pain Points Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {painPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className={`group relative bg-gradient-to-br from-neutral-50 to-neutral-100 p-8 rounded-3xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden ${
                  index >= 3 ? "lg:col-span-1" : ""
                }`}
              >
                {/* Gradient Accent */}
                <div className={`absolute inset-0 bg-gradient-to-br ${point.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${point.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-black text-black mb-2">{point.title}</h3>
                  <p className="text-lg text-neutral-800 font-semibold mb-3">{point.stat}</p>
                  <p className="text-neutral-600 leading-relaxed">{point.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Statement */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-black text-white px-12 py-6 rounded-full">
            <p className="text-2xl font-bold">These problems have a solution. It's not more hiring — it's AI automation.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
