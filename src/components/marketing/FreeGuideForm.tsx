"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "submitting" | "error";

interface FreeGuideFormProps {
  theme?: "dark" | "light";
  source?: string;
  ctaLabel?: string;
  redirectPath?: string;
}

export function FreeGuideForm({
  theme = "dark",
  source = "free_guide",
  ctaLabel = "Get My Free Automation Guide",
  redirectPath = "/free-guide/thank-you",
}: FreeGuideFormProps) {
  const router = useRouter();
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
          source,
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

      const params = new URLSearchParams({
        email: trimmedEmail,
        ...(name.trim() ? { name: name.trim() } : {}),
      });
      router.push(`${redirectPath}?${params.toString()}`);
    } catch {
      setError("Something went wrong. Please try again in a moment.");
      setStatus("error");
    }
  }

  const isDark = theme === "dark";
  const labelClass = isDark
    ? "block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2"
    : "block text-xs uppercase tracking-wider text-neutral-600 font-semibold mb-2";
  const inputClass = isDark
    ? "w-full bg-black/40 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
    : "w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-black placeholder-neutral-400 focus:outline-none focus:border-green-600";
  const footnoteClass = isDark
    ? "text-xs text-neutral-500 text-center"
    : "text-xs text-neutral-500 text-center";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      <div>
        <label htmlFor={`fg-name-${source}`} className={labelClass}>
          Name <span className="opacity-60">(optional)</span>
        </label>
        <input
          id={`fg-name-${source}`}
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="Alex Johnson"
        />
      </div>
      <div>
        <label htmlFor={`fg-email-${source}`} className={labelClass}>
          Work email
        </label>
        <input
          id={`fg-email-${source}`}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="you@agency.com"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        style={{ backgroundColor: "#10b981" }}
        className="mt-1 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-lg rounded-full px-8 py-4 transition-all shadow-xl shadow-green-600/30"
      >
        {status === "submitting" ? "Sending your guide…" : ctaLabel}
      </button>
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
      <p className={footnoteClass}>
        No spam. Unsubscribe any time. We read every reply.
      </p>
    </form>
  );
}
