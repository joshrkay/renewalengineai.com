"use client";
import { useState } from "react";
import { ArrowRight, Calendar, CheckCircle } from "lucide-react";
import { useBooking } from "@/components/marketing/BookingContext";
import { trackEvent } from "@/lib/analytics";

interface ContentCTAProps {
  /** Analytics label — flows into `book_audit_click` / `lead_submit` events. */
  location: string;
  eyebrow?: string;
  headline?: string;
  subcopy?: string;
}

/**
 * Conversion block rendered at the foot of every content article
 * (resources, comparisons, case studies). Gives article readers two
 * explicit next steps instead of a single static link to /#pricing:
 *
 *   A. Book a free renewal audit (high-touch)  -> opens the Calendly modal
 *   B. Grab the AI playbook (low friction)      -> POST /api/lead-magnet
 *
 * `openBooking` already fires `book_audit_click`, so path A doesn't
 * double-track. Path B captures the email the homepage magnet was losing.
 *
 * Phase 2 seam: when the self-serve trial ships, add a third
 * "Start free trial" button here pointing at /signup.
 */
export function ContentCTA({
  location,
  eyebrow = "Two ways to start",
  headline = "See exactly where your agency is leaking revenue",
  subcopy = "Book a free 30-minute renewal audit, or grab the AI playbook and start on your own this week.",
}: ContentCTAProps) {
  const { openBooking } = useBooking();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: location }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(
          data.error === "invalid_email"
            ? "Enter a valid email address."
            : "Something went wrong. Please try again."
        );
        setStatus("error");
        return;
      }
      trackEvent("lead_submit", { source: location });
      setStatus("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section className="mt-16 bg-gradient-to-br from-emerald-600/10 to-blue-600/10 border border-emerald-500/30 rounded-2xl p-8 lg:p-10">
      <p className="text-emerald-400 font-bold uppercase tracking-wider text-sm mb-3">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-black text-white mb-3">{headline}</h2>
      <p className="text-neutral-300 mb-8 leading-relaxed max-w-2xl">{subcopy}</p>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Path A — Book the audit (high-touch) */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-neutral-400">
            <Calendar className="h-5 w-5 text-blue-400" />
            <span className="text-xs uppercase tracking-wider font-bold">
              Have us do it
            </span>
          </div>
          <p className="text-white font-bold text-lg mb-4 flex-1">
            Free 30-min renewal audit — we find your top 3 revenue leaks, live.
          </p>
          <button
            onClick={() => openBooking(location)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-full px-6 py-3.5 transition-colors flex items-center justify-center gap-2"
          >
            Book my free audit
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Path B — Self-serve playbook (low friction) */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-neutral-400">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <span className="text-xs uppercase tracking-wider font-bold">
              Start on your own
            </span>
          </div>
          {status === "done" ? (
            <p className="text-white font-bold text-lg flex-1 flex items-center">
              Check your inbox — the AI playbook is on its way.
            </p>
          ) : (
            <>
              <p className="text-white font-bold text-lg mb-4 flex-1">
                Get the free AI playbook: the 5 automations to set up this week.
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="email"
                  required
                  placeholder="you@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/5 border border-neutral-700 text-white placeholder:text-neutral-500 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-white text-black hover:bg-neutral-100 disabled:opacity-60 font-black rounded-full px-6 py-3 whitespace-nowrap transition-colors"
                >
                  {status === "loading" ? "Sending…" : "Get it"}
                </button>
              </form>
              {error && (
                <p role="alert" className="text-red-400 text-sm mt-2">
                  {error}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <p className="text-sm text-neutral-500 mt-6">
        Prefer to compare packages first?{" "}
        <a
          href="/#pricing"
          className="text-blue-500 hover:text-blue-400 underline underline-offset-4"
        >
          See audit pricing
        </a>
        .
      </p>
    </section>
  );
}
