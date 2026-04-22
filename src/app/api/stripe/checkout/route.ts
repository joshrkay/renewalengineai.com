import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, PLAN_CONFIG, type PlanKey } from "@/lib/stripe";
import { log } from "@/lib/logger";

// Per-plan success URL overrides. Keys that aren't listed here fall back
// to a generic success query-string on the homepage.
const SUCCESS_URLS: Partial<Record<PlanKey, (origin: string) => string>> = {
  // After paying for the audit, send customers straight to the 1-hour
  // audit Calendly so they can schedule their session immediately.
  audit: () => "https://calendly.com/joshrkay-ch88/1-hour-audit",
  "retention-course": (origin) =>
    `${origin}/courses/ai-for-agent-retention?checkout=success`,
  "bootcamp-course": (origin) =>
    `${origin}/courses/ai-agency-ops-bootcamp?checkout=success`,
};

export async function POST(req: NextRequest) {
  try {
    const { plan } = (await req.json()) as { plan: string };
    const cfg = PLAN_CONFIG[plan as PlanKey];
    if (!cfg) {
      return NextResponse.json({ error: "invalid_plan" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "https://renewalengineai.com";
    const stripe = getStripe();

    // Resolve the line item. Prefer a real Stripe Product's default_price
    // (set in the Stripe dashboard). Fall back to inline price_data built
    // from the hard-coded PLAN_CONFIG amount when a plan hasn't been wired
    // to a product yet.
    let lineItem: Stripe.Checkout.SessionCreateParams.LineItem;
    let effectiveMode: Stripe.Checkout.SessionCreateParams.Mode = cfg.mode;

    const productId = (cfg as { productId?: string }).productId;
    if (productId) {
      const product = await stripe.products.retrieve(productId, {
        expand: ["default_price"],
      });
      const defaultPrice = product.default_price;
      if (!defaultPrice || typeof defaultPrice === "string") {
        log.error(
          `Stripe product ${productId} is missing an expanded default_price`
        );
        return NextResponse.json(
          { error: "product_missing_default_price" },
          { status: 500 }
        );
      }
      if (!defaultPrice.active) {
        return NextResponse.json(
          { error: "product_price_inactive" },
          { status: 500 }
        );
      }
      lineItem = { price: defaultPrice.id, quantity: 1 };
      // Trust Stripe's billing scheme over our local config: if the
      // product's default price is recurring, run a subscription session.
      effectiveMode = defaultPrice.recurring ? "subscription" : "payment";
    } else {
      lineItem = {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: cfg.amount,
          product_data: { name: cfg.name },
          ...(cfg.mode === "subscription"
            ? { recurring: { interval: cfg.interval as "month" } }
            : {}),
        },
      };
    }

    const successUrl =
      SUCCESS_URLS[plan as PlanKey]?.(origin) ??
      `${origin}/?checkout=success&plan=${plan}`;

    const session = await stripe.checkout.sessions.create({
      mode: effectiveMode,
      line_items: [lineItem],
      success_url: successUrl,
      cancel_url: `${origin}/?checkout=cancel&plan=${plan}`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_creation: effectiveMode === "payment" ? "always" : undefined,
      metadata: {
        plan,
        tier: cfg.tier,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    log.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "checkout_session_failed" },
      { status: 500 }
    );
  }
}
