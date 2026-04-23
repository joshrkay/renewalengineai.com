"use client";

import { useState } from "react";
import { ArrowRight, Calendar, CreditCard } from "lucide-react";
import { useBooking } from "@/components/marketing/BookingContext";

export function AuditTripwire() {
  const { openBooking } = useBooking();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuyAudit() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "audit" }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.url) {
        setError(
          "We couldn't open checkout. Please book a call instead or email hello@renewalengineai.com."
        );
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(
        "We couldn't open checkout. Please book a call instead or email hello@renewalengineai.com."
      );
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border-2 border-green-600/40 bg-gradient-to-br from-green-600/10 via-black to-black p-8 lg:p-12">
      <div className="flex flex-col items-center text-center mb-8">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 text-white"
          style={{ backgroundColor: "#10b981" }}
        >
          Ready to go deeper?
        </span>
        <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
          Want us to run this audit
          <br />
          ON your book?
        </h2>
        <p className="text-lg text-neutral-300 max-w-2xl">
          The guide shows you <em>what</em> to automate. The AI-Powered Renewal
          Audit shows you <em>how much your specific agency is leaking</em> — in
          dollars — and the exact 90-day plan to plug it. Delivered in 5 days.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Option A — Book a call */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600/20 border border-blue-600/40 rounded-full p-3">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-bold">
              Option A — Talk first
            </span>
          </div>
          <h3 className="text-2xl font-black text-white mb-3">
            Book a Free 30-Min Call
          </h3>
          <p className="text-neutral-400 mb-6 flex-1">
            We&apos;ll walk your renewal process, identify the top 3 leaks, and
            decide together if the paid Audit is the right next step. No
            pressure. You leave with notes either way.
          </p>
          <button
            onClick={openBooking}
            className="bg-white text-black hover:bg-neutral-100 font-black text-lg rounded-full px-6 py-4 transition-all flex items-center justify-center gap-2"
          >
            Book My Free Call
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Option B — Buy audit now */}
        <div
          className="border-2 rounded-2xl p-8 flex flex-col relative"
          style={{
            borderColor: "#10b981",
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(0,0,0,0.9))",
          }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span
              className="inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-lg"
              style={{ backgroundColor: "#10b981" }}
            >
              Skip the line
            </span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="border rounded-full p-3"
              style={{
                backgroundColor: "rgba(16,185,129,0.2)",
                borderColor: "rgba(16,185,129,0.4)",
              }}
            >
              <CreditCard className="h-5 w-5 text-green-400" />
            </div>
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
              Option B — Buy now
            </span>
          </div>
          <h3 className="text-2xl font-black text-white mb-1">
            AI-Powered Renewal Audit
          </h3>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-black text-white">$1,500</span>
            <span className="text-neutral-400">one-time</span>
          </div>
          <ul className="text-neutral-300 text-sm space-y-2 mb-6 flex-1">
            <li>• 5-day workflow &amp; renewal book assessment</li>
            <li>• Lead response time analysis</li>
            <li>• Custom 90-day AI automation roadmap</li>
            <li>• ROI projections + executive report</li>
            <li>• 1-hour results session (scheduled after checkout)</li>
          </ul>
          <button
            onClick={handleBuyAudit}
            disabled={loading}
            style={{ backgroundColor: "#10b981" }}
            className="hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-lg rounded-full px-6 py-4 transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-600/30"
          >
            {loading ? "Opening checkout…" : "Buy My Audit Now"}
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>
          <p className="text-xs text-neutral-500 text-center mt-3">
            Secure checkout via Stripe. 100% refund if the roadmap isn&apos;t
            actionable.
          </p>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="text-center text-red-400 font-semibold mt-4"
        >
          {error}
        </p>
      )}
    </div>
  );
}
