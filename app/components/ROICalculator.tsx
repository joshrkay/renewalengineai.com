import { useState } from "react";
import { Button } from "./ui/button";
import { Calculator } from "lucide-react";
import { useBooking } from "./BookingContext";

export function ROICalculator() {
  const { openBooking } = useBooking();
  const [policies, setPolicies] = useState(500);
  const [avgPremium, setAvgPremium] = useState(1200);
  const [currentRetention, setCurrentRetention] = useState(82);
  const [leadsPerMonth, setLeadsPerMonth] = useState(50);
  const [showResults, setShowResults] = useState(false);

  // ROI calculations
  const currentLapseRate = (100 - currentRetention) / 100;
  const improvedRetention = Math.min(currentRetention + 15, 97);
  const improvedLapseRate = (100 - improvedRetention) / 100;

  const lapsedPoliciesSaved = Math.round(policies * (currentLapseRate - improvedLapseRate));
  const avgCommission = avgPremium * 0.12; // ~12% avg commission
  const retentionRevenue = Math.round(lapsedPoliciesSaved * avgCommission);

  const currentLeadConversion = 0.15; // 15% baseline
  const improvedLeadConversion = 0.25; // 25% with instant response
  const additionalBinds = Math.round(leadsPerMonth * 12 * (improvedLeadConversion - currentLeadConversion));
  const leadRevenue = Math.round(additionalBinds * avgCommission);

  const totalROI = retentionRevenue + leadRevenue;

  return (
    <section className="py-32 px-6 lg:px-8 bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold mb-6">
            <Calculator className="inline h-4 w-4 mr-2" />
            ROI Calculator
          </div>
          <h2 className="text-6xl lg:text-7xl font-black text-black mb-6">
            What's AI Automation Worth to Your Agency?
          </h2>
          <p className="text-2xl text-neutral-600 max-w-2xl mx-auto font-medium">
            Enter your agency's numbers and see projected revenue impact
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border-2 border-neutral-100 p-10">
          {/* Inputs */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Total Policies in Book
              </label>
              <input
                type="number"
                value={policies}
                onChange={(e) => setPolicies(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-lg font-semibold focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Average Annual Premium ($)
              </label>
              <input
                type="number"
                value={avgPremium}
                onChange={(e) => setAvgPremium(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-lg font-semibold focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Current Retention Rate (%)
              </label>
              <input
                type="number"
                value={currentRetention}
                onChange={(e) => setCurrentRetention(Number(e.target.value))}
                min={50}
                max={99}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-lg font-semibold focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                New Leads Per Month
              </label>
              <input
                type="number"
                value={leadsPerMonth}
                onChange={(e) => setLeadsPerMonth(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-lg font-semibold focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Calculate Button */}
          <div className="text-center mb-10">
            <Button
              onClick={() => setShowResults(true)}
              className="bg-blue-600 hover:bg-blue-700 !text-white text-xl px-12 py-7 rounded-full font-black transition-all hover:scale-105"
            >
              Calculate My ROI
            </Button>
          </div>

          {/* Results */}
          {showResults && (
            <div className="border-t-2 border-neutral-100 pt-10">
              <h3 className="text-2xl font-black text-black mb-8 text-center">
                Projected Annual Revenue Impact
              </h3>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl text-center">
                  <div className="text-4xl font-black text-blue-600 mb-2">
                    ${retentionRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm font-bold text-blue-800">
                    From Improved Retention
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {lapsedPoliciesSaved} policies saved &middot; {currentRetention}% → {improvedRetention}%
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl text-center">
                  <div className="text-4xl font-black text-purple-600 mb-2">
                    ${leadRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm font-bold text-purple-800">
                    From Faster Lead Response
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    {additionalBinds} additional binds/year
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl text-center">
                  <div className="text-4xl font-black text-green-600 mb-2">
                    ${totalROI.toLocaleString()}
                  </div>
                  <div className="text-sm font-bold text-green-800">
                    Total Additional Revenue
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Projected annual impact
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-neutral-500 text-sm mb-4">
                  Based on industry averages: 12% commission rate, 15% baseline lead conversion improving to 25% with instant response, and 15-point retention improvement with AI automation.
                </p>
                <Button
                  onClick={openBooking}
                  className="bg-black !text-white hover:bg-neutral-800 text-lg px-10 py-6 rounded-full font-black transition-all hover:scale-105"
                >
                  Book Free Audit to Get Your Exact Numbers
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
