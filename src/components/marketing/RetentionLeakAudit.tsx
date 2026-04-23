"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { useBooking } from "@/components/marketing/BookingContext";
import { trackEvent } from "@/lib/analytics";
import {
  AMS_OPTIONS,
  calculateLeakOutputs,
  MAX_AVG_PREMIUM,
  MAX_POLICY_COUNT,
} from "@/lib/retention-leak-audit";

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  source?: string;
};

const DEFAULTS = {
  policyCount: 450,
  currentRetention: 85,
  avgPremium: 1500,
  ams: "APPLIED_EPIC" as string,
};

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

export function RetentionLeakAudit({ source = "home" }: Props) {
  const { openBooking } = useBooking();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [policyCount, setPolicyCount] = useState<number>(DEFAULTS.policyCount);
  const [currentRetention, setCurrentRetention] = useState<number>(
    DEFAULTS.currentRetention
  );
  const [avgPremium, setAvgPremium] = useState<number>(DEFAULTS.avgPremium);
  const [ams, setAms] = useState<string>(DEFAULTS.ams);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const outputs = useMemo(
    () =>
      calculateLeakOutputs({
        policyCount,
        currentRetention,
        avgPremium,
      }),
    [policyCount, currentRetention, avgPremium]
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your work email.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/retention-leak-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          name: name.trim() || undefined,
          agencyName: agencyName.trim() || undefined,
          policyCount,
          currentRetention,
          avgPremium,
          ams,
          source,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setErrorMessage(
          data.error === "invalid_email"
            ? "That email doesn't look right. Double-check it and try again."
            : "Something went wrong. Please try again in a moment."
        );
        setStatus("error");
        return;
      }

      trackEvent("retention_leak_audit_submit", {
        source,
        ams,
        policy_count: policyCount,
        current_retention: currentRetention,
        annual_leakage: outputs.annualLeakage,
      });

      setStatus("success");
      setSubmitted(true);
    } catch {
      setErrorMessage("Something went wrong. Please try again in a moment.");
      setStatus("error");
    }
  }

  return (
    <section
      id="retention-leak-audit"
      className="py-28 px-6 lg:px-8 bg-gradient-to-b from-white to-neutral-50"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-5 py-2 rounded-full text-sm font-bold mb-6 border border-red-100">
            <AlertTriangle className="h-4 w-4" />
            Free 60-second Retention Leak Audit
          </div>
          <h2 className="text-5xl lg:text-6xl font-black text-black mb-5 tracking-tight">
            How much premium is your book leaking?
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Four numbers, no sales call. We&rsquo;ll show you the commission
            dollars you&rsquo;re losing to renewal lapse every year &mdash; and
            what a three-point retention lift would recover.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl border-2 border-neutral-100 p-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div className="sm:col-span-2">
                <label
                  htmlFor="rla-email"
                  className="block text-xs uppercase tracking-wider text-neutral-500 font-bold mb-2"
                >
                  Work email
                </label>
                <input
                  id="rla-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-base font-medium focus:border-blue-600 focus:outline-none transition-colors"
                  placeholder="you@agency.com"
                />
              </div>

              <div>
                <label
                  htmlFor="rla-name"
                  className="block text-xs uppercase tracking-wider text-neutral-500 font-bold mb-2"
                >
                  Name <span className="text-neutral-400 font-normal">(optional)</span>
                </label>
                <input
                  id="rla-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-base font-medium focus:border-blue-600 focus:outline-none transition-colors"
                  placeholder="Alex Johnson"
                />
              </div>

              <div>
                <label
                  htmlFor="rla-agency"
                  className="block text-xs uppercase tracking-wider text-neutral-500 font-bold mb-2"
                >
                  Agency <span className="text-neutral-400 font-normal">(optional)</span>
                </label>
                <input
                  id="rla-agency"
                  type="text"
                  autoComplete="organization"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-base font-medium focus:border-blue-600 focus:outline-none transition-colors"
                  placeholder="Pacific Agency Group"
                />
              </div>

              <div>
                <label
                  htmlFor="rla-policies"
                  className="block text-xs uppercase tracking-wider text-neutral-500 font-bold mb-2"
                >
                  Policies in force
                </label>
                <input
                  id="rla-policies"
                  type="number"
                  required
                  min={1}
                  max={MAX_POLICY_COUNT}
                  value={policyCount || ""}
                  onChange={(e) => setPolicyCount(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-base font-semibold focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="rla-retention"
                  className="block text-xs uppercase tracking-wider text-neutral-500 font-bold mb-2"
                >
                  Current retention %
                </label>
                <input
                  id="rla-retention"
                  type="number"
                  required
                  min={1}
                  max={99}
                  value={currentRetention || ""}
                  onChange={(e) => setCurrentRetention(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-base font-semibold focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="rla-premium"
                  className="block text-xs uppercase tracking-wider text-neutral-500 font-bold mb-2"
                >
                  Avg annual premium ($)
                </label>
                <input
                  id="rla-premium"
                  type="number"
                  required
                  min={1}
                  max={MAX_AVG_PREMIUM}
                  value={avgPremium || ""}
                  onChange={(e) => setAvgPremium(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-base font-semibold focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="rla-ams"
                  className="block text-xs uppercase tracking-wider text-neutral-500 font-bold mb-2"
                >
                  Agency management system
                </label>
                <select
                  id="rla-ams"
                  required
                  value={ams}
                  onChange={(e) => setAms(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-base font-semibold focus:border-blue-600 focus:outline-none transition-colors bg-white"
                >
                  {AMS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={status === "submitting" || submitted}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-700 disabled:cursor-not-allowed !text-white text-lg font-black rounded-full px-8 py-6"
            >
              {status === "submitting"
                ? "Calculating..."
                : submitted
                  ? "Sent — check your inbox"
                  : "Show My Retention Leak"}
              {!submitted && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>

            {errorMessage && (
              <p className="text-sm text-red-600 mt-3" role="alert">
                {errorMessage}
              </p>
            )}

            <p className="text-xs text-neutral-500 mt-4">
              No spam. We email your detailed breakdown and follow up only if
              the numbers suggest a real fit. Unsubscribe anytime.
            </p>
          </form>

          {/* Results */}
          <div
            className={`rounded-3xl border-2 p-8 transition-colors ${
              submitted
                ? "bg-gradient-to-br from-red-50 via-white to-emerald-50 border-emerald-200"
                : "bg-neutral-50 border-neutral-200"
            }`}
            aria-live="polite"
          >
            {!submitted && (
              <div className="text-center py-8">
                <p className="text-sm uppercase tracking-wider text-neutral-500 font-bold mb-3">
                  Preview
                </p>
                <p className="text-neutral-600 text-lg">
                  Enter your numbers and submit to see your agency&rsquo;s
                  annual leakage, the impact of a three-point retention lift,
                  and the full recovery ceiling.
                </p>
              </div>
            )}

            {submitted && (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-emerald-700 mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">
                      Your leak report
                    </span>
                  </div>
                  <p className="text-neutral-600 text-sm">
                    A copy is on its way to your inbox. Follow-up below.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-white border-2 border-red-200 rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wider text-red-700 font-bold mb-1">
                      Annual commission leakage
                    </p>
                    <p className="text-4xl font-black text-red-600">
                      {formatCurrency(outputs.annualLeakage)}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {outputs.policiesLapsingAnnually.toLocaleString("en-US")}{" "}
                      policies lapsing at {currentRetention}% retention &middot;
                      12% commission assumed
                    </p>
                  </div>

                  <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wider text-emerald-700 font-bold mb-1">
                      3-point retention lift recovers
                    </p>
                    <p className="text-3xl font-black text-emerald-600">
                      {formatCurrency(outputs.threePointRecovery)} / year
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {currentRetention}% &rarr; {outputs.improvedRetentionPct}%
                      on your current book
                    </p>
                  </div>

                  <div className="bg-white border-2 border-blue-200 rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wider text-blue-700 font-bold mb-1">
                      Full recovery ceiling ({outputs.targetRetentionPct}%
                      retention)
                    </p>
                    <p className="text-3xl font-black text-blue-600">
                      {formatCurrency(outputs.targetRecovery)} / year
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Best-case if retention reaches the top-quartile
                      benchmark
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => openBooking("retention_leak_audit")}
                  className="w-full bg-black hover:bg-neutral-800 !text-white text-lg font-black rounded-full px-8 py-6"
                >
                  Book the $1,500 Stack Recommendation Audit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-xs text-neutral-500 mt-4 text-center">
                  Credited toward Build &amp; Launch if you continue. Fully
                  refundable if we can&rsquo;t surface a real leak in 5 days.
                </p>
              </>
            )}
          </div>
        </div>

        <p className="text-xs text-neutral-400 text-center mt-8 max-w-3xl mx-auto">
          Numbers are directional and assume a 12% commission rate &mdash; the
          same assumption used in the full audit and the ROI calculator below.
          The paid audit uses your actual AMS data and produces a named Stack
          Recommendation Report.
        </p>
      </div>
    </section>
  );
}
