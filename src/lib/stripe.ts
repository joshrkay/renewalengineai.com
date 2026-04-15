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

export const PLAN_CONFIG = {
  audit: {
    amount: 150000,
    mode: "payment" as const,
    name: "AI-Powered Renewal Audit",
    interval: null,
    tier: "AUDIT" as const,
  },
  sprint: {
    amount: 600000,
    mode: "payment" as const,
    name: "AI Automation Build & Launch",
    interval: null,
    tier: "SPRINT" as const,
  },
  managed: {
    amount: 250000,
    mode: "subscription" as const,
    name: "Managed AI Operations",
    interval: "month" as const,
    tier: "MANAGED" as const,
  },
} as const;

export type PlanKey = keyof typeof PLAN_CONFIG;
