import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

// Lightweight diagnostic endpoint to verify Stripe is wired up in the
// current environment without leaking any secret values. Reports whether
// required env vars are present and pings Stripe to confirm the secret key
// is valid and which mode (live/test) it belongs to.
export async function GET() {
  const hasSecretKey = Boolean(process.env.STRIPE_SECRET_KEY);
  const hasWebhookSecret = Boolean(process.env.STRIPE_WEBHOOK_SECRET);

  const secretKeyPrefix = process.env.STRIPE_SECRET_KEY?.slice(0, 7) ?? null;
  const mode = secretKeyPrefix?.startsWith("sk_live")
    ? "live"
    : secretKeyPrefix?.startsWith("sk_test")
      ? "test"
      : null;

  let stripeReachable = false;
  let stripeError: string | null = null;

  if (hasSecretKey) {
    try {
      // Cheapest authenticated call available — verifies the key works.
      await getStripe().balance.retrieve();
      stripeReachable = true;
    } catch (err) {
      stripeError =
        err instanceof Error ? err.message : "unknown_stripe_error";
    }
  }

  const ok = hasSecretKey && hasWebhookSecret && stripeReachable;

  return NextResponse.json(
    {
      ok,
      env: {
        STRIPE_SECRET_KEY: hasSecretKey,
        STRIPE_WEBHOOK_SECRET: hasWebhookSecret,
      },
      mode,
      secretKeyPrefix,
      stripeReachable,
      stripeError,
    },
    { status: ok ? 200 : 503 }
  );
}
