"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, AlertCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// Map the capture API's machine codes to copy a visitor should see.
const ERROR_COPY: Record<string, string> = {
  invalid_email: "Please enter a valid email address.",
  submission_failed: "Something went wrong. Please try again.",
};

export function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/mastermind/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: "homepage_lead_magnet",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setError(
          (data.error && ERROR_COPY[data.error]) ??
            "Something went wrong. Please try again."
        );
        setLoading(false);
        return;
      }
      trackEvent("lead_submit", { source: "homepage_lead_magnet" });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-blue-950 via-blue-900 to-black">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 border border-blue-500/30 rounded-3xl p-10 lg:p-16 backdrop-blur-sm">
          {submitted ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
              <h2 className="text-4xl font-black text-white mb-4">
                You&apos;re In — Read It Now
              </h2>
              <p className="text-xl text-blue-200 max-w-xl mx-auto mb-8">
                Your free AI Renewal Automation Playbook is ready. Most
                agencies find 3–5 revenue leaks in the first 10 minutes.
              </p>
              <a
                href="/resources/ai-renewal-automation-playbook"
                className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-black px-8 py-4 rounded-full text-lg transition-all hover:scale-105"
              >
                Open the Playbook →
              </a>
            </div>
          ) : (
            <>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full mb-6">
                <Download className="h-4 w-4" />
                <span className="font-black text-sm">FREE DOWNLOAD</span>
              </div>

              {/* Headline */}
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                5 AI Automations Every Insurance
                <span className="text-blue-400"> Agent Should Set Up This Week</span>
              </h2>
              <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-2xl">
                The exact five automations we set up first for independent
                agencies — renewal sequences, instant lead response, quote
                follow-up, service triage, and cross-sell scoring — with the
                templates to start this week.
              </p>

              {/* What's inside */}
              <ul className="grid sm:grid-cols-2 gap-3 mb-10">
                {[
                  "The 5 automations every agency needs now",
                  "Real ROI numbers from actual deployments",
                  "Which AMS integrations work best",
                  "How to get started in under 2 weeks",
                  "The renewal timeline that stops lapses",
                  "Lead response scripts that book calls",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-blue-100">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <input
                  type="email"
                  required
                  placeholder="your@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border border-blue-400/40 text-white placeholder:text-blue-300/60 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-400 !text-white font-black px-8 py-4 rounded-full text-lg transition-all hover:scale-105 whitespace-nowrap"
                >
                  {loading ? "Sending…" : "Get the Playbook →"}
                </Button>
              </form>

              {error && (
                <div className="flex items-center gap-2 mt-4 text-red-300">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <p className="text-blue-300/70 text-sm mt-4">
                No spam. Unsubscribe any time. We only email actionable AI ops content.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
