"use client";

import { useState } from "react";

type Props = {
  plan: string;
  label: string;
  className?: string;
};

// Starts a Stripe Checkout Session for a course plan key
// (e.g. "retention-course") and redirects the buyer to Stripe. Used on the
// course landing page to sell directly instead of booking a call.
export function EnrollButton({ plan, label, className }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.url) {
        setError("We couldn't open checkout. Please try again in a moment.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("We couldn't open checkout. Please try again in a moment.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={className}
      >
        {loading ? "Opening checkout…" : label}
      </button>
      {error && (
        <p className="text-sm text-red-400 mt-3 text-center" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
