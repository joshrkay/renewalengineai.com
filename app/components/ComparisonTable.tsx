import { X, Check } from "lucide-react";

const comparisons = [
  {
    metric: "Lead Response Time",
    without: "Hours or next business day",
    with: "Under 60 seconds, 24/7"
  },
  {
    metric: "Renewal Retention",
    without: "80-85% (15-20% lapse)",
    with: "94-97% with proactive outreach"
  },
  {
    metric: "Quote Follow-Up",
    without: "Manual, inconsistent, often missed",
    with: "Automated multi-touch until bind or decline"
  },
  {
    metric: "After-Hours Coverage",
    without: "Voicemail (30% of calls missed)",
    with: "AI receptionist handles every inquiry"
  },
  {
    metric: "Cross-Sell Identification",
    without: "Manual review, rarely done",
    with: "AI scans book automatically for opportunities"
  },
  {
    metric: "Team Capacity",
    without: "400 policies per producer",
    with: "750+ policies per producer"
  }
];

export function ComparisonTable() {
  return (
    <section className="py-32 px-6 lg:px-8 bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-6xl lg:text-7xl font-black text-black mb-6">
            Before vs. After AI Automation
          </h2>
          <p className="text-2xl text-neutral-600 max-w-3xl mx-auto font-medium">
            See the difference AI automation makes for independent insurance agencies
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-neutral-100 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-black text-white">
            <div className="p-6 font-black text-lg"></div>
            <div className="p-6 font-black text-lg text-center">
              <div className="flex items-center justify-center gap-2">
                <X className="h-5 w-5 text-red-400" />
                Without AI
              </div>
            </div>
            <div className="p-6 font-black text-lg text-center">
              <div className="flex items-center justify-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                With RenewalEngineAI
              </div>
            </div>
          </div>

          {/* Table Rows */}
          {comparisons.map((row, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 ${
                index % 2 === 0 ? "bg-white" : "bg-neutral-50"
              } ${index < comparisons.length - 1 ? "border-b border-neutral-100" : ""}`}
            >
              <div className="p-6 font-bold text-black text-lg">{row.metric}</div>
              <div className="p-6 text-neutral-500 text-center">{row.without}</div>
              <div className="p-6 text-blue-600 font-semibold text-center">{row.with}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
