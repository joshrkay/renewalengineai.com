"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function MastermindInviteForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
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
      const res = await fetch("/api/mastermind/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          name: name.trim() || undefined,
          source: "mastermind_page",
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(
          data.error === "invalid_email"
            ? "That email doesn't look right — please double-check it."
            : "Something went wrong. Please try again in a moment."
        );
        setStatus("error");
        return;
      }

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
      <div className="bg-blue-600/10 border border-blue-600/40 rounded-2xl p-6 text-center">
        <p className="text-white font-bold text-lg mb-1">You&apos;re on the list.</p>
        <p className="text-neutral-300 text-sm">
          We&apos;ll be in touch within a day or two with invite details and
          next steps.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 max-w-md mx-auto text-left"
    >
      <div>
        <label
          htmlFor="mastermind-name"
          className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2"
        >
          Name <span className="text-neutral-600">(optional)</span>
        </label>
        <input
          id="mastermind-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-black border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500"
          placeholder="Alex Johnson"
        />
      </div>
      <div>
        <label
          htmlFor="mastermind-email"
          className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2"
        >
          Work email
        </label>
        <input
          id="mastermind-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-black border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500"
          placeholder="you@agency.com"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold rounded-full px-8 py-4 transition-colors"
      >
        {status === "submitting" ? "Sending…" : "Request an invite"}
      </button>
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      <p className="text-xs text-neutral-500 text-center">
        No spam. We&apos;ll only email you about Mastermind onboarding.
      </p>
    </form>
  );
}
