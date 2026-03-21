import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl font-bold mb-6">
            AI-Powered Retention for Independent Insurance Agents
          </h1>
          <p className="text-xl mb-8">
            We help insurance agencies retain more of their book through custom AI solutions and education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consulting"
              className="flex-1 bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              We'll Build It For You
            </Link>
            <Link
              href="/courses"
              className="flex-1 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium border border-white/20 hover:border-white transition-colors"
            >
              Learn to Build It Yourself
            </Link>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8">
            See How Much Lapse Is Costing Your Agency
          </h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Number of Policies</label>
                <input
                  type="number"
                  defaultValue="800"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Average Annual Premium ($)</label>
                <input
                  type="number"
                  defaultValue="1200"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Calculate ROI
              </button>
            </form>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-lg font-semibold" id="roi-result">
                Your agency could save up to $5,760 in annual commission with just a 5-point improvement in retention rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-8">Trusted by Insurance Agents Nationwide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-bold mb-4">Agency in Texas</h3>
              <p className="text-gray-600">
                Retained $47K in premium that would have been lost last renewal season
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-bold mb-4">Agency in Florida</h3>
              <p className="text-gray-600">
                Increased retention rate from 82% to 91% in 90 days
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-bold mb-4">Agency in California</h3>
              <p className="text-gray-600">
                Saved 15 hours per week on renewal follow-up tasks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to Keep More of Your Book?</h2>
          <p className="text-lg mb-8">
            Start with a free retention audit or enroll in our flagship course
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consulting"
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Book a Consultation
            </Link>
            <Link
              href="/courses"
              className="flex-1 bg-white border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              View Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}