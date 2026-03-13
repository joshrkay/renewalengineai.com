import { ImageWithFallback } from "./figma/ImageWithFallback";

const testimonials = [
  {
    quote: "We went from 15% renewal lapses to under 5%. The system handles all the follow-up automatically.",
    author: "David Richardson",
    title: "Agency Principal",
    result: "15% → 4.8%",
    metric: "Renewal Lapse"
  },
  {
    quote: "Our producers manage 750+ policies now versus 400 before. Same team, nearly double the capacity.",
    author: "Sarah Kim",
    title: "Owner",
    result: "400 → 750+",
    metric: "Policies/Producer"
  },
  {
    quote: "We avoided hiring two CSRs. The automation handles routine requests and saves us $120K annually.",
    author: "James Martinez",
    title: "Managing Partner",
    result: "$120K",
    metric: "Annual Savings"
  }
];

export function Benefits() {
  return (
    <section id="results" className="relative py-32 px-6 lg:px-8 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1660854088062-c178a98550cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwc3VjY2VzcyUyMGJ1c2luZXNzJTIwdmljdG9yeXxlbnwxfHx8fDE3NzMzNzY5NDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Team success"
          className="w-full h-full object-cover opacity-5"
        />
      </div>

      {/* Decorative Blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold mb-6">
            Real Results
          </div>
          <h2 className="text-6xl lg:text-7xl font-black text-white mb-6">
            Proven Impact
          </h2>
          <p className="text-2xl text-neutral-400 max-w-3xl mx-auto font-medium">
            Independent agencies growing without adding headcount
          </p>
        </div>

        {/* Testimonials */}
        <div className="space-y-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-neutral-900 to-neutral-800 p-8 lg:p-12 rounded-3xl border border-neutral-700 hover:border-blue-600 transition-all duration-300"
            >
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                {/* Quote */}
                <div className="lg:col-span-8">
                  <div className="text-3xl font-black text-white mb-6 leading-tight">
                    "{testimonial.quote}"
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-xl">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{testimonial.author}</div>
                      <div className="text-neutral-400">{testimonial.title}</div>
                    </div>
                  </div>
                </div>

                {/* Result */}
                <div className="lg:col-span-4">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-2xl text-center">
                    <div className="text-5xl font-black text-white mb-2">{testimonial.result}</div>
                    <div className="text-lg font-bold text-blue-100">{testimonial.metric}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center">
            <div className="text-6xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
              50+
            </div>
            <div className="text-xl text-neutral-400 font-bold">Agencies Using Our System</div>
          </div>
          <div className="text-center">
            <div className="text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              2x
            </div>
            <div className="text-xl text-neutral-400 font-bold">Average Capacity Increase</div>
          </div>
          <div className="text-center">
            <div className="text-6xl font-black bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent mb-3">
              24/7
            </div>
            <div className="text-xl text-neutral-400 font-bold">Lead Response Coverage</div>
          </div>
        </div>
      </div>
    </section>
  );
}