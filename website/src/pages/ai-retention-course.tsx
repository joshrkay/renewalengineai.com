import Link from 'next/link';

export default function AIRetentionCourse() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-indigo-600 font-semibold">
            ← RenewalEngineAI
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
                That's money walking out the door every year - money that could be in your pocket with the right AI systems in place.
              </p>
            </div>
          </section>

          {/* The Solution */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">What You'll Build</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4>
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2-2v12a2 2 0 002 2z" />
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
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4>
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a4 4 0 110-8 4 4 0 010-8 4 4 0 010 8zm4 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-8 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Cross-Sell Identification</h3>
                    <p className="text-gray-600">
                      Use AI to analyze your book and discover which clients need additional lines of business you're not currently offering them
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4>
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 4h12M5 14h12a2 2 0 012 2v6a2 2 0 012-2v-6a2 2 0 012-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">AI-Generated Communications</h3>
                    <p className="text-gray-600">
                      Create personalized policyholder communications in your voice and style at scale - no more generic templates
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4>
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4>
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5a2 2 0 002-2V6a2 2 0 002-2H5a2 2 0 002-2v12a2 2 0 002 2z" />
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
                  <p><strong>Setting Up Your AI Toolkit</strong></p
>Learn to get started with the AI tools you'll use throughout the course</p>
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
                  <p className="text-sm text-gray-600">Use your agency's data to predict which policies are at risk of lapsing</p>
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
                  <p className="text-sm text-gray-600">n8n, Make, Zapier - choosing the right tool for your agency</p>
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
                <p className="text-sm text-gray-600">One-time payment - lifetime access</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold mb-4">What's Included</h3>
                  <ul className="space-y-3">
                    <li>✅ 8+ hours of video training</li>
                    <li>✅ Downloadable templates and scripts</li>
                    <li>✅ AI prompt library for agents</li>
                    <li>✅ Access to private student community</li>
                    <li>✅ Lifetime updates and new content</li>
                    <li>✅ 30-day money-back guarantee</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold mb-4">Bonuses</h3>
                  <ul className="space-y-3">
                    <li>✅ Renewal Outreach Script Swipe File ($97 value)</li>
                    <li>✅ AI Agent Prompt Library ($147 value)</li>
                    <li>✅ 30-Day Implementation Checklist ($47 value)</li>
                    <li>✅ Agency Growth Toolkit ($197 value)</li>
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
                <h3 className="font-bold mb-3">Before & After Results</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4>
                      <span className="text-indigo-600 font-bold">Before</span>
                    </div>
                    <div>
                      <p className="text-sm">18% annual lapse rate</p>
                      <p className="text-sm">$17,280 lost commission/year</p>
                      <p className="text-sm">Manual renewal tracking</p>
                      <p className="text-sm">Reactive approach to renewals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mt-4>
                    <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4>
                      <span className="text-indigo-600 font-bold">After</span>
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
                <div className="space-y-4>
                  <p className="italic mb-3>
                    "I implemented the renewal outreach system from Module 2 and retained $8,400 in premium I would have lost last quarter. The course paid for itself in the first month."
                  </p>
                  <p className="text-sm font-medium text-gray-600> - Jennifer K., Independent Agent, Colorado</p>
                </div>
                
                <p className="italic mb-3>
                  "Finally, AI training that actually gets it. No Silicon Valley jargon - just practical strategies for real insurance agencies."
                </p>
                <p className="text-sm font-medium text-gray-600> - David R., Agency Owner, Florida</p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center py-12 bg-indigo-50>
            <h2 className="text-2xl font-bold mb-6 text-white>Ready to Keep More of Your Book?</h2>
            <p className="text-xl mb-8 text-white/90>
              Join hundreds of agents who are already using AI to reduce lapse and increase retention
            </p>
            <Link
              href="#"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-medium hover:bg-white/90 transition-colors inline-block"
            >
              Enroll Now - $397
            </Link>
          </section>
        </div>
      </section>
    </div>
  );
}