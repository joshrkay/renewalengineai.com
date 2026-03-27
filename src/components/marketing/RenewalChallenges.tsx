import { AlertTriangle } from "lucide-react";

const challenges = [
  {
    title: "The Renewal Blind Spot",
    problem: "Most agencies don't know a policy is at risk until the client calls to cancel — or worse, just lets it lapse without a word.",
    reality: "By the time you notice a renewal gap, the client has already gotten 3 quotes from competitors. The window to retain them closed weeks ago.",
    impact: "Average agency loses 15-20% of their book annually. On a $2M book, that's $300,000-$400,000 in premium walking out the door every year.",
    stat: "$300K+",
    statLabel: "Lost annually on a $2M book"
  },
  {
    title: "The Lead Response Death Spiral",
    problem: "A new lead comes in at 6:47 PM on a Tuesday. Your team left at 5. The lead fills out three more forms that night. By Wednesday morning, they've already talked to two other agents.",
    reality: "78% of insurance consumers buy from the first agent to respond. The average agency takes 47 hours to respond to a web lead. That's not a gap — it's a canyon.",
    impact: "For every 100 leads you generate, you're losing 30-50 of them to response time alone — regardless of how good your rates or service are.",
    stat: "47 hrs",
    statLabel: "Average agency response time"
  },
  {
    title: "The Follow-Up Falloff",
    problem: "Your producer quotes a prospect. They say they need to \"think about it.\" A week goes by. Then two. Then the prospect goes to someone who followed up.",
    reality: "80% of sales require 5+ follow-up touches, but most insurance agents stop after 1-2. It's not laziness — it's capacity. When you're juggling 400+ policies, manual follow-up is the first thing that falls off.",
    impact: "The average agency's quote-to-bind ratio is 25-35%. With systematic follow-up, top agencies hit 50%+. That's double the new business from the same leads.",
    stat: "50%",
    statLabel: "Of quotes never get followed up"
  },
  {
    title: "The Service Trap",
    problem: "Your CSRs spend their entire day on certificate requests, endorsements, payment questions, and policy changes. Important work — but it's keeping them from revenue-generating activities.",
    reality: "Insurance agency staff spend 40%+ of their time on administrative tasks that don't directly generate revenue. That's 2+ days per week per employee lost to busywork.",
    impact: "A CSR costs $45,000-$65,000/year. If 40% of their time goes to automatable tasks, that's $18,000-$26,000 per employee in wasted capacity — every year.",
    stat: "40%+",
    statLabel: "Time spent on non-revenue tasks"
  },
  {
    title: "The Growth Ceiling",
    problem: "You want to grow your book by 20% this year. But your team is already at capacity. The math is simple: grow by hiring, or don't grow at all.",
    reality: "Every new producer needs 6-12 months to ramp. Every new CSR needs 3-6 months of training. Recruiting takes months. And one bad hire sets you back $50K+.",
    impact: "Most agencies plateau at 500-800 policies per producer because the manual workload creates a hard ceiling. AI automation breaks through that ceiling without adding headcount.",
    stat: "2X",
    statLabel: "Capacity gain without hiring"
  }
];

export function RenewalChallenges() {
  return (
    <section className="py-32 px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-full font-bold mb-6">
            <AlertTriangle className="h-4 w-4" />
            The Real Cost of Manual Processes
          </div>
          <h2 className="text-6xl lg:text-7xl font-black text-white mb-6">
            Why Do Insurance Agencies Lose Revenue Every Day?
          </h2>
          <p className="text-2xl text-neutral-400 max-w-3xl mx-auto font-medium">
            These five challenges cost the average independent agency hundreds of thousands in lost revenue, missed opportunities, and wasted capacity
          </p>
        </div>

        {/* Challenges */}
        <div className="space-y-8">
          {challenges.map((challenge, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl border border-neutral-700 overflow-hidden"
            >
              <div className="grid lg:grid-cols-12 gap-0">
                {/* Content */}
                <div className="lg:col-span-9 p-8 lg:p-12">
                  <h3 className="text-3xl font-black text-white mb-4">
                    {challenge.title}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-bold text-red-400 uppercase tracking-wider">The Problem</span>
                      <p className="text-lg text-neutral-300 mt-1">{challenge.problem}</p>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-amber-400 uppercase tracking-wider">The Reality</span>
                      <p className="text-lg text-neutral-300 mt-1">{challenge.reality}</p>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">The Impact</span>
                      <p className="text-lg text-neutral-300 mt-1">{challenge.impact}</p>
                    </div>
                  </div>
                </div>

                {/* Stat */}
                <div className="lg:col-span-3 bg-gradient-to-br from-red-600/20 to-orange-600/20 flex items-center justify-center p-8 lg:p-12">
                  <div className="text-center">
                    <div className="text-5xl lg:text-6xl font-black text-white mb-2">
                      {challenge.stat}
                    </div>
                    <div className="text-neutral-400 font-semibold">
                      {challenge.statLabel}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="mt-16 text-center">
          <p className="text-3xl font-black text-white mb-4">
            Every one of these problems has the same solution.
          </p>
          <p className="text-xl text-neutral-400">
            AI automation that runs proactively — not reactively — so revenue stops leaking while you focus on growing.
          </p>
        </div>
      </div>
    </section>
  );
}
