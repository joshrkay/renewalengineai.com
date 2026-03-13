import { AlertCircle, TrendingDown, Clock, Users } from "lucide-react";

const painPoints = [
  {
    icon: Users,
    title: "Hit Capacity",
    stat: "Can't grow without hiring",
    color: "from-red-600 to-orange-600"
  },
  {
    icon: TrendingDown,
    title: "Lost Renewals",
    stat: "15-20% lapse annually",
    color: "from-orange-600 to-amber-600"
  },
  {
    icon: Clock,
    title: "Slow Response",
    stat: "Leads go cold overnight",
    color: "from-amber-600 to-yellow-600"
  },
  {
    icon: AlertCircle,
    title: "Service Backlog",
    stat: "Team buried in requests",
    color: "from-yellow-600 to-orange-600"
  }
];

export function PainPoints() {
  return (
    <section className="py-32 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-7xl font-black text-black mb-6">
            The Problem
          </h2>
          <p className="text-2xl text-neutral-600 max-w-3xl mx-auto font-medium">
            Every agency hits the same growth ceiling
          </p>
        </div>

        {/* Pain Points Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-neutral-50 to-neutral-100 p-8 rounded-3xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Gradient Accent */}
                <div className={`absolute inset-0 bg-gradient-to-br ${point.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${point.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-black mb-3">{point.title}</h3>
                  <p className="text-lg text-neutral-600 font-semibold">{point.stat}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Statement */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-black text-white px-12 py-6 rounded-full">
            <p className="text-2xl font-bold">Sound familiar? There's a better way.</p>
          </div>
        </div>
      </div>
    </section>
  );
}