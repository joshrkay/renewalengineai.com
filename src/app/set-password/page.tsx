"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SetPasswordForm />
    </Suspense>
  );
}

function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  // Preserved through the welcome-email link so course buyers land back
  // on the course they purchased after login. Only same-origin relative
  // paths are honored (open-redirect guard).
  const rawCallbackUrl = searchParams.get("callbackUrl");
  const callbackUrl =
    rawCallbackUrl && rawCallbackUrl.startsWith("/") && !rawCallbackUrl.startsWith("//")
      ? rawCallbackUrl
      : null;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to set password");
        return;
      }

      setSuccess(true);
      const loginHref = callbackUrl
        ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : "/login";
      setTimeout(() => router.push(loginHref), 2000);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-black text-red-600 mb-2">Invalid Link</h1>
          <p className="text-neutral-600">This password reset link is invalid or has expired.</p>
          <a href="/" className="text-primary mt-4 inline-block">Back to homepage</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-black mb-2">Set Your Password</h1>
            <p className="text-neutral-600">Create a password for your RenewalEngineAI account</p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <p className="text-green-600 font-medium text-lg">Password set successfully!</p>
              <p className="text-neutral-500 mt-2">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-6 text-lg font-bold rounded-xl"
              >
                {loading ? "Setting password..." : "Set Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
