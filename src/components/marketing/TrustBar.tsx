import { Shield, Clock, Plug, HeadphonesIcon } from "lucide-react";

const trustSignals = [
  {
    icon: Shield,
    label: "Insurance-Specific AI"
  },
  {
    icon: Plug,
    label: "AMS Integrated"
  },
  {
    icon: Clock,
    label: "24/7 AI Coverage"
  },
  {
    icon: HeadphonesIcon,
    label: "Done-For-You Service"
  }
];

export function TrustBar() {
  return (
    <section className="py-12 px-6 lg:px-8 bg-neutral-50 border-y border-neutral-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <p className="text-neutral-500 font-bold text-sm uppercase tracking-wider">
            Trusted by independent agencies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {trustSignals.map((signal, index) => {
              const Icon = signal.icon;
              return (
                <div key={index} className="flex items-center gap-3 text-neutral-600">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-sm">{signal.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
