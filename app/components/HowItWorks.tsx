import { Search, Rocket, Gauge, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Audit",
    duration: "5 Days",
    description: "We analyze your workflow and identify where automation will have the biggest impact",
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    icon: Rocket,
    number: "02",
    title: "Build",
    duration: "2 Weeks",
    description: "Our team builds and tests your custom automation systems tailored to your processes",
    gradient: "from-purple-600 to-blue-600"
  },
  {
    icon: Gauge,
    number: "03",
    title: "Launch",
    duration: "Week 3",
    description: "We go live, monitor performance closely, and make any needed adjustments",
    gradient: "from-pink-600 to-purple-600"
  },
  {
    icon: TrendingUp,
    number: "04",
    title: "Optimize",
    duration: "Ongoing",
    description: "Regular reviews and enhancements to keep your automation running at peak performance",
    gradient: "from-orange-600 to-pink-600"
  }
];

export function HowItWorks() {
  return (
    <section className="py-32 px-6 lg:px-8 bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold mb-6">
            The Process
          </div>
          <h2 className="text-6xl lg:text-7xl font-black text-black mb-6">
            How It Works
          </h2>
          <p className="text-2xl text-neutral-600 max-w-3xl mx-auto font-medium">
            From assessment to optimization—we handle everything
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative group"
              >
                {/* Connector Line (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-1 bg-gradient-to-r from-neutral-200 to-transparent"></div>
                )}

                <div className="relative bg-white p-8 rounded-3xl border-2 border-neutral-100 hover:border-blue-600 transition-all duration-300 h-full">
                  {/* Number Badge */}
                  <div className={`absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h3 className="text-3xl font-black text-black mb-2">{step.title}</h3>
                    <div className="inline-block bg-neutral-100 px-4 py-1 rounded-full">
                      <span className="text-sm font-bold text-neutral-600">{step.duration}</span>
                    </div>
                  </div>

                  <p className="text-lg text-neutral-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}