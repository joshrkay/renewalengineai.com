import Link from 'next/link';

export default function Courses() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-indigo-600 font-semibold">
            ← RenewalEngineAI
          </Link>
          <h1 className="text-2xl font-bold">AI Education for Insurance Agents</h1>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Learn to Use AI to Keep More of Your Book</h2>
          
          {/* Course Overview */}
          <div className="mb-12">
            <p className="text-lg mb-4">
              Self-paced and live courses that teach independent agents how to use AI tools in their day-to-day agency operations.
            </p>
            <p className="text-gray-600">
              No fluff. No jargon. Just actionable strategies you can implement this week.
            </p>
          </div>

          {/* Course Catalog */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4">Our Course Offerings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Flagship Course */}
              <div className="border border-gray-200 rounded-lg p-6">
                <Link href="/ai-retention-course" className="block">
                  <h4 className="font-bold mb-2">AI for Agent Retention</h4>
                  <p className="text-indigo-600 font-semibold mb-3">$297 - $497</p>
                  <p className="text-sm text-gray-600 mb-3">Self-paced video + templates + prompts</p>
                  <p className="text-sm">Our flagship course - build your own AI-powered retention system</p>
                </Link>
              </div>
              
              {/* Bootcamp */}
              <div className="border border-gray-200 rounded-lg p-6 relative opacity-80">
                <div className="block">
                  <span className="inline-block bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-1 rounded mb-2">Coming Soon</span>
                  <h4 className="font-bold mb-2">AI Agency Operations Bootcamp</h4>
                  <p className="text-indigo-600 font-semibold mb-3">$797 - $1,297</p>
                  <p className="text-sm text-gray-600 mb-3">Live cohort or premium self-paced</p>
                  <p className="text-sm">Go deeper into AI for your entire agency operation</p>
                </div>
              </div>

              {/* Mastermind */}
              <div className="border border-gray-200 rounded-lg p-6 relative opacity-80">
                <div className="block">
                  <span className="inline-block bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-1 rounded mb-2">Coming Soon</span>
                  <h4 className="font-bold mb-2">AI Mastermind / Community</h4>
                  <p className="text-indigo-600 font-semibold mb-3">$97 - $197/mo</p>
                  <p className="text-sm text-gray-600 mb-3">Ongoing access: live calls + new content</p>
                  <p className="text-sm">Recurring revenue from course graduates</p>
                </div>
              </div>

              {/* Team Licenses */}
              <div className="border border-gray-200 rounded-lg p-6 relative opacity-80">
                <div className="block">
                  <span className="inline-block bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-1 rounded mb-2">Coming Soon</span>
                  <h4 className="font-bold mb-2">Agency Team Licenses</h4>
                  <p className="text-indigo-600 font-semibold mb-3">Custom pricing</p>
                  <p className="text-sm text-gray-600 mb-3">Multi-seat access</p>
                  <p className="text-sm">Higher ACV, agency owner buys for staff</p>
                </div>
              </div>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4">Course Curriculum: AI for Agent Retention</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2 mr-3">
                  <span className="text-indigo-600">01</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Understanding Your Book of Business</h4>
                  <p className="text-sm text-gray-600">
                    Learn to analyze your AMS data to identify retention patterns and lapse risks
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2 mr-3">
                  <span className="text-indigo-600">02</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">AI-Powered Renewal Outreach Systems</h4>
                  <p className="text-sm text-gray-600">
                    Build automated email and SMS sequences that feel personal and authentic
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2 mr-3">
                  <span className="text-indigo-600">03</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Lapse Risk Scoring Models</h4>
                  <p className="text-sm text-gray-600">
                    Use your agency's data to predict which policies are most likely to lapse
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2 mr-3">
                  <span className="text-indigo-600">04</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Cross-Sell and Round-Out Identification</h4>
                  <p className="text-sm text-gray-600">
                    Use AI to uncover hidden opportunities in your existing book
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4">What Agents Are Saying</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="italic mb-3">
                  "I implemented the renewal outreach system from this course and retained $12K in premium I would have lost last quarter."
                </p>
                <p className="text-sm font-medium text-gray-600"> - Sarah L., Independent Agent, Arizona</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="italic mb-3">
                  "Finally, AI training that speaks my language - book of business, X-dates, commissions. No tech jargon, just actionable steps."
                </p>
                <p className="text-sm font-medium text-gray-600"> - Marcus R., Agency Owner, Texas</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center py-8 bg-indigo-50 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Ready to Future-Proof Your Agency?</h3>
            <p className="mb-6">
              Join 500+ agents who are already using AI to keep more of their book and grow their agencies
            </p>
            <Link
              href="/ai-retention-course"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Enroll in AI for Agent Retention
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}