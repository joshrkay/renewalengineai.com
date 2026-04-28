"use client";

import { useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  source: string;
  compact?: boolean;
};

export function NewsletterSignupForm({ source, compact = false }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, source }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(
          data.error === "invalid_email"
            ? "That email doesn't look right."
            : "Something went wrong. Try again in a moment."
        );
        setStatus("error");
        return;
      }

      trackEvent("newsletter_subscribe", { source });
      setStatus("success");
      setEmail("");
    } catch {
      setError("Something went wrong. Try again in a moment.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-emerald-400 font-semibold text-sm">
        ✓ You&rsquo;re in. Check your inbox.
      </p>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@agency.com"
          className="flex-1 min-w-0 bg-neutral-900 border border-neutral-700 rounded-full px-4 py-2 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold rounded-full px-5 py-2 text-sm transition-colors flex-shrink-0"
        >
          {status === "submitting" ? "..." : "Subscribe"}
        </button>
        {error && (
          <p className="sr-only" role="alert">
            {error}
          </p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@agency.com"
        className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold rounded-full px-6 py-3 text-sm transition-colors"
      >
        {status === "submitting" ? "Subscribing..." : "Subscribe to updates"}
      </button>
      {error && (
        <p className="text-red-400 text-xs" role="alert">
          {error}
        </p>
      )}
      <p className="text-neutral-600 text-xs">
        New resources when published. Unsubscribe anytime.
      </p>
    </form>
  );
}
