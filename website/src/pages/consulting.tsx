import Link from 'next/link';

export default function Consulting() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-indigo-600 font-semibold">
            ← RenewalEngineAI
          </Link>
          <h1 className="text-2xl font-bold">AI Consulting for Insurance Agents</h1>
          <Link href="/contact" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">
            Book a Call
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Custom AI Solutions That Keep More of Your Book</h2>
          
          {/* How It Works */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4">How We Work</h3>
            <ol className="list-decimal list-inside space-y-3">
              <li>Retention Audit - We analyze your book data to find leakage points</li>
              <li>Custom Solution - We build AI-powered retention systems tailored to your AMS</li>
              <li>Implementation & Training - We deploy and train your team on the new system</li>
              <li>Ongoing Optimization - We monitor results and continuously improve</li>
            </ol>
          </div>

          {/* Pricing Tiers */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4">Our Consulting Engagements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Retention Audit */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold mb-2">Retention Audit</h4>
                <p className="text-indigo-600 font-semibold mb-3">$1,500 - $2,500</p>
                <ul className="text-sm space-y-2">
                  <li>Analysis of book data and lapse patterns</li>
                  <li>Retention gap identification</li>
                  <li>AI opportunity roadmap</li>
                  <li>Entry point to prove value</li>
                </ul>
              </div>
              
              {/* AI Implementation */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold mb-2">AI Implementation</h4>
                <p className="text-indigo-600 font-semibold mb-3">$5,000 - $15,000</p>
                <ul className="text-sm space-y-2">
                  <li>Custom-built AI retention system</li>
                  <li>Outreach automation and risk scoring</li>
                  <li>Dashboards and workflow automation</li>
                  <li>Turnkey delivery and training</li>
                </ul>
              </div>
              
              {/* Ongoing Optimization */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold mb-2">Ongoing Optimization</h4>
                <p className="text-indigo-600 font-semibold mb-3">$1,000 - $3,000/mo</p>
                <ul className="text-sm space-y-2">
                  <li>Monthly retainer for monitoring</li>
                  <li>System tuning and expansion</li>
                  <li>New workflow additions</li>
                  <li>Recurring revenue stream</li>
                </ul>
              </div>
              
              {/* Agency Transformation */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold mb-2">Agency AI Transformation</h4>
                <p className="text-indigo-600 font-semibold mb-3">$15,000 - $25,000</p>
                <ul className="text-sm space-y-2">
                  <li>Full-scope engagement</li>
                  <li>Retention + cross-sell + prospecting</li>
                  <li>Internal automation</li>
                  <li>Premium offering for larger agencies</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Case Studies */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4">Proven Results</h3>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold mb-2">Texas P&C Agency (800 policies)</h4>
                <p className="mb-2">
                  <strong>Challenge:</strong> 18% annual lapse rate losing $25K in commission
                </p>
                <p className="mb-2">
                  <strong>Solution:</strong> AI-powered renewal outreach system with personalized sequences
                </p>
                <p>
                  <strong>Result:</strong> Retained $47K in premium, reduced lapse to 10%
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold mb-2">Florida Independent Agency (1,200 policies)</h4>
                <p className="mb-2">
                  <strong>Challenge:</strong> Manual renewal tracking causing missed opportunities
                </p>
                <p className="mb-2">
                  <strong>Solution:</strong> Automated renewal tracking dashboard with AI risk scoring
                </p>
                <p>
                  <strong>Result:</strong> Saved 20 hours/week, increased retention from 82% to 91%
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center py-8 bg-indigo-50 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Ready to Stop Losing Commission to Lapse?</h3>
            <p className="mb-6">
              Our clients typically see ROI within 30 days - one saved client often pays for the entire engagement
            </p>
            <Link
              href="/contact"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Book Your Free Retention Audit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}