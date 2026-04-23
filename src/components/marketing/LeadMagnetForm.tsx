"use client";

import { useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

export function LeadMagnetForm({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your work email.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/mastermind/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          name: name.trim() || undefined,
          source,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(
          data.error === "invalid_email"
            ? "That email doesn't look right. Double-check it and try again."
            : "Something went wrong. Please try again in a moment."
        );
        setStatus("error");
        return;
      }

      trackEvent("lead_submit", { source });
      setStatus("success");
      setEmail("");
      setName("");
    } catch {
      setError("Something went wrong. Please try again in a moment.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-8 text-center">
        <p className="text-white font-black text-2xl mb-2">
          Check your inbox.
        </p>
        <p className="text-neutral-300">
          The guide is on its way to{" "}
          <span className="text-white font-semibold">your email</span>. If it
          isn&rsquo;t there in 5 minutes, check spam.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
      <div>
        <label
          htmlFor="lm-name"
          className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2"
        >
          Name <span className="text-neutral-600">(optional)</span>
        </label>
        <input
          id="lm-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-black border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
          placeholder="Alex Johnson"
        />
      </div>
      <div>
        <label
          htmlFor="lm-email"
          className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2"
        >
          Work email
        </label>
        <input
          id="lm-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-black border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
          placeholder="you@agency.com"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-700 disabled:cursor-not-allowed text-white font-black rounded-full px-8 py-4 transition-colors text-lg"
      >
        {status === "submitting" ? "Sending..." : "Get My Free Guide"}
      </button>
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      <p className="text-xs text-neutral-500">
        No spam. Unsubscribe anytime. We only email you about AI automation
        for insurance agencies.
      </p>
    </form>
  );
}
