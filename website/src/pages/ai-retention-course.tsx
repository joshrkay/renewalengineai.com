import Link from 'next/link';

export default function AIRetentionCourse() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-indigo-600 font-semibold">
            &larr; RenewalEngineAI
          </Link>
          <h1 className="text-2xl font-bold">AI for Agent Retention</h1>
          <Link href="#pricing" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">
            Enroll Now
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold mb-6">
              Build Your Own AI-Powered Renewal System
            </h1>
            <p className="text-xl mb-6">
              Keep more of your book through proven AI strategies built specifically for independent insurance agents
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#curriculum"
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                See Curriculum
              </Link>
              <Link
                href="#pricing"
                className="flex-1 bg-white border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* The Problem */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">The Renewal Problem Every Agent Faces</h2>
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">15%</div>
                  <p className="text-sm text-gray-600">Average annual lapse rate</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">$17,280</div>
                  <p className="text-sm text-gray-600">Lost commission per year (800 policies)</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">82%</div>
                  <p className="text-sm text-gray-600">Typical retention rate</p>
                </div>
              </div>
              <p className="mt-6 text-center">
                That&apos;s money walking out the door every year &mdash; money that could be in your pocket with the right AI systems in place.
              </p>
            </div>
          </section>

          {/* The Solution */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">What You&apos;ll Build</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Automated Renewal Outreach</h3>
                    <p className="text-gray-600">
                      Build personalized email and SMS sequences that trigger based on X-dates, feeling like they came from you personally
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Lapse Risk Scoring</h3>
                    <p className="text-gray-600">
                      Create models that predict which clients are most likely to not renew, so you can focus your efforts where they matter most
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Cross-Sell Identification</h3>
                    <p className="text-gray-600">
                      Use AI to analyze your book and discover which clients need additional lines of business you&apos;re not currently offering them
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">AI-Generated Communications</h3>
                    <p className="text-gray-600">
                      Create personalized policyholder communications in your voice and style at scale &mdash; no more generic templates
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Retention Tracking Dashboard</h3>
                    <p className="text-gray-600">
                      Build a simple dashboard that shows your retention metrics in real-time so you know exactly where you stand
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Remarketing Workflows</h3>
                    <p className="text-gray-600">
                      Create automated follow-up sequences for non-responsive policyholders that actually get responses
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Curriculum */}
          <section id="curriculum" className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold mb-3">Module 1: Foundation</h3>
                <div className="space-y-2">
                  <p><strong>Understanding Your Book of Business</strong></p>
                  <p className="text-sm text-gray-600">Learn to export and analyze your AMS data to identify retention patterns</p>
                </div>
                <div className="space-y-2">
                  <p><strong>The ROI of Retention</strong></p>
                  <p className="text-sm text-gray-600">Master the math that shows exactly how much lapse is costing your agency</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Setting Up Your AI Toolkit</strong></p>
                  <p className="text-sm text-gray-600">Learn to get started with the AI tools you&apos;ll use throughout the course</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold mb-3">Module 2: Renewal Outreach Systems</h3>
                <div className="space-y-2">
                  <p><strong>Building Personalized Sequences</strong></p>
                  <p className="text-sm text-gray-600">Create email and SMS sequences that feel like they came from you personally</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Timing and Triggers</strong></p>
                  <p className="text-sm text-gray-600">Learn to set up sequences that trigger based on X-dates and behavior</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Testing and Optimization</strong></p>
                  <p className="text-sm text-gray-600">A/B test your sequences to maximize response rates</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold mb-3">Module 3: AI-Powered Analytics</h3>
                <div className="space-y-2">
                  <p><strong>Lapse Risk Modeling</strong></p>
                  <p className="text-sm text-gray-600">Use your agency&apos;s data to predict which policies are at risk of lapsing</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Cross-Sell Opportunity Identification</strong></p>
                  <p className="text-sm text-gray-600">Uncover hidden revenue in your existing book with AI analysis</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Building Simple Dashboards</strong></p>
                  <p className="text-sm text-gray-600">Create visualizations that show your retention metrics at a glance</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold mb-3">Module 4: Implementation and Scale</h3>
                <div className="space-y-2">
                  <p><strong>Putting It All Together</strong></p>
                  <p className="text-sm text-gray-600">Integrate your AI systems into your existing workflow</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Automation Tools Overview</strong></p>
                  <p className="text-sm text-gray-600">n8n, Make, Zapier &mdash; choosing the right tool for your agency</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Scaling Your Systems</strong></p>
                  <p className="text-sm text-gray-600">From manual processes to fully automated retention engine</p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section id="pricing" className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Investment</h2>
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="text-center mb-6">
                <h3 className="font-bold mb-2">AI for Agent Retention</h3>
                <p className="text-lg text-indigo-600 font-semibold">$397</p>
                <p className="text-sm text-gray-600">One-time payment &mdash; lifetime access</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold mb-4">What&apos;s Included</h3>
                  <ul className="space-y-3">
                    <li>&#10003; 8+ hours of video training</li>
                    <li>&#10003; Downloadable templates and scripts</li>
                    <li>&#10003; AI prompt library for agents</li>
                    <li>&#10003; Access to private student community</li>
                    <li>&#10003; Lifetime updates and new content</li>
                    <li>&#10003; 30-day money-back guarantee</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold mb-4">Bonuses</h3>
                  <ul className="space-y-3">
                    <li>&#10003; Renewal Outreach Script Swipe File ($97 value)</li>
                    <li>&#10003; AI Agent Prompt Library ($147 value)</li>
                    <li>&#10003; 30-Day Implementation Checklist ($47 value)</li>
                    <li>&#10003; Agency Growth Toolkit ($197 value)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Social Proof */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Results from Real Agents</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold mb-3">Before &amp; After Results</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-red-100 rounded-full p-3 mr-4">
                      <span className="text-red-600 font-bold text-sm">Before</span>
                    </div>
                    <div>
                      <p className="text-sm">18% annual lapse rate</p>
                      <p className="text-sm">$17,280 lost commission/year</p>
                      <p className="text-sm">Manual renewal tracking</p>
                      <p className="text-sm">Reactive approach to renewals</p>
                    </div>
                  </div>

                  <div className="flex items-start mt-4">
                    <div className="flex-shrink-0 bg-green-100 rounded-full p-3 mr-4">
                      <span className="text-green-600 font-bold text-sm">After</span>
                    </div>
                    <div>
                      <p className="text-sm">10% annual lapse rate</p>
                      <p className="text-sm">$5,760 retained commission/year</p>
                      <p className="text-sm">Automated renewal sequences</p>
                      <p className="text-sm">Proactive retention system</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold mb-3">Student Testimonials</h3>
                <div className="space-y-4">
                  <div>
                    <p className="italic mb-3">
                      &ldquo;I implemented the renewal outreach system from Module 2 and retained $8,400 in premium I would have lost last quarter. The course paid for itself in the first month.&rdquo;
                    </p>
                    <p className="text-sm font-medium text-gray-600">&mdash; Jennifer K., Independent Agent, Colorado</p>
                  </div>

                  <div>
                    <p className="italic mb-3">
                      &ldquo;Finally, AI training that actually gets it. No Silicon Valley jargon &mdash; just practical strategies for real insurance agencies.&rdquo;
                    </p>
                    <p className="text-sm font-medium text-gray-600">&mdash; David R., Agency Owner, Florida</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center py-12 bg-indigo-600 rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Ready to Keep More of Your Book?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join hundreds of agents who are already using AI to reduce lapse and increase retention
            </p>
            <Link
              href="#pricing"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
            >
              Enroll Now &mdash; $397
            </Link>
          </section>
        </div>
      </section>
    </div>
  );
}
