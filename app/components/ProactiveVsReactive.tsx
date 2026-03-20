import { ArrowRight } from "lucide-react";

const comparisons = [
  {
    reactive: {
      title: "Client calls to cancel",
      description: "You find out a policy is at risk when the client calls to say they found a cheaper rate. Now you're negotiating from a position of weakness."
    },
    proactive: {
      title: "AI reaches out 60 days early",
      description: "Your client gets a personalized review reminder well before renewal. By the time competitors call, your client already feels taken care of."
    }
  },
  {
    reactive: {
      title: "Lead sits until morning",
      description: "A prospect fills out your website form at 8 PM. Your team sees it at 9 AM. By then, they've already spoken to two other agents."
    },
    proactive: {
      title: "AI responds in 60 seconds",
      description: "The prospect gets an immediate text, email, and option to schedule a call — before they even finish browsing competitors."
    }
  },
  {
    reactive: {
      title: "Quote expires, no follow-up",
      description: "A producer sends a quote. The prospect says they'll think about it. Three weeks later, no one has followed up and the prospect went elsewhere."
    },
    proactive: {
      title: "Automated 21-day sequence",
      description: "AI sends 5-7 personalized touchpoints with different angles — coverage value, risk scenarios, testimonials — until the prospect binds or explicitly declines."
    }
  },
  {
    reactive: {
      title: "Cross-sell discovered by accident",
      description: "During a random conversation, a CSR realizes a client only has auto insurance and no home policy. How many of those conversations never happen?"
    },
    proactive: {
      title: "AI scans your entire book monthly",
      description: "Every month, AI identifies your top 50 cross-sell opportunities ranked by probability and estimated premium. Your producers get a prioritized call list, not guesswork."
    }
  },
  {
    reactive: {
      title: "Hiring when you're already overwhelmed",
      description: "You realize you need help when service quality drops and clients start complaining. Recruiting and training takes months — months you don't have."
    },
    proactive: {
      title: "AI scales with you instantly",
      description: "Automation handles the volume increase immediately. No recruiting, no training, no ramp time. Your team's capacity doubles overnight."
    }
  }
];

export function ProactiveVsReactive() {
  return (
    <section className="py-32 px-6 lg:px-8 bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold mb-6">
            The Shift
          </div>
          <h2 className="text-6xl lg:text-7xl font-black text-black mb-6">
            What Changes When You Go from Reactive to Proactive?
          </h2>
          <p className="text-2xl text-neutral-600 max-w-3xl mx-auto font-medium">
            Most agencies run on a reactive model — putting out fires instead of preventing them. AI automation flips that equation.
          </p>
        </div>

        {/* Comparisons */}
        <div className="space-y-6">
          {comparisons.map((item, index) => (
            <div
              key={index}
              className="grid md:grid-cols-11 gap-4 items-stretch"
            >
              {/* Reactive */}
              <div className="md:col-span-5 bg-red-50 border-2 border-red-100 rounded-2xl p-6">
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Reactive</span>
                <h4 className="text-xl font-black text-red-900 mt-1 mb-2">{item.reactive.title}</h4>
                <p className="text-red-700/80">{item.reactive.description}</p>
              </div>

              {/* Arrow */}
              <div className="md:col-span-1 flex items-center justify-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Proactive */}
              <div className="md:col-span-5 bg-green-50 border-2 border-green-100 rounded-2xl p-6">
                <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Proactive with AI</span>
                <h4 className="text-xl font-black text-green-900 mt-1 mb-2">{item.proactive.title}</h4>
                <p className="text-green-700/80">{item.proactive.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-6 rounded-full">
            <p className="text-2xl font-bold">
              Proactive agencies grow faster, retain more, and spend less.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
