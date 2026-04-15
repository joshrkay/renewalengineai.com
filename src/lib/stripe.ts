import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return _stripe;
}

// Plan config drives `/api/stripe/checkout`. Each entry can source the
// actual Stripe price in one of two ways:
//
//   1. `productId` — the Stripe Product ID (prod_…). At checkout time we
//      retrieve the product with `default_price` expanded and use that
//      price in the line item. This lets pricing live in Stripe without
//      redeploying code.
//
//   2. `amount` — a hard-coded cents amount. Used as a fallback when
//      `productId` is not set (inline `price_data`). Kept for plans we
//      haven't yet migrated to a real Stripe product.
//
// `amount` is also what the marketing UI reads for display, so keep it
// roughly in sync with the Stripe-side price even when productId wins at
// checkout time.
export const PLAN_CONFIG = {
  audit: {
    productId: "prod_ULHZKqC7l4xCSt",
    amount: 150000,
    mode: "payment" as const,
    name: "AI-Powered Renewal Audit",
    interval: null,
    tier: "AUDIT" as const,
  },
  sprint: {
    productId: "prod_ULHZWucDiB4kPd",
    amount: 600000,
    mode: "payment" as const,
    name: "AI Automation Build & Launch",
    interval: null,
    tier: "SPRINT" as const,
  },
  managed: {
    productId: "prod_ULHZXJ5xHZHUgw",
    amount: 250000,
    mode: "subscription" as const,
    name: "Managed AI Operations",
    interval: "month" as const,
    tier: "MANAGED" as const,
  },
  "retention-course": {
    productId: "prod_ULHcrd2kItHf88",
    amount: 39700,
    mode: "payment" as const,
    name: "AI for Agent Retention",
    interval: null,
    tier: "AUDIT" as const,
  },
  "bootcamp-course": {
    productId: "prod_ULHbSayZppnUZZ",
    amount: 79700,
    mode: "payment" as const,
    name: "AI Agency Operations Bootcamp",
    interval: null,
    tier: "AUDIT" as const,
  },
} as const;

export type PlanKey = keyof typeof PLAN_CONFIG;
