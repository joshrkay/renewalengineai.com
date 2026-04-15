import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLAN_CONFIG, type PlanKey } from "@/lib/stripe";
import { log } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const { plan } = (await req.json()) as { plan: string };
    const cfg = PLAN_CONFIG[plan as PlanKey];
    if (!cfg) {
      return NextResponse.json({ error: "invalid_plan" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "https://renewalengineai.com";

    const lineItem = {
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

    // After paying for the audit, send customers straight to the 1-hour
    // audit Calendly so they can schedule their session immediately.
    const successUrl =
      plan === "audit"
        ? "https://calendly.com/joshrkay-ch88/1-hour-audit"
        : `${origin}/?checkout=success&plan=${plan}`;

    const session = await getStripe().checkout.sessions.create({
      mode: cfg.mode,
      line_items: [lineItem],
      success_url: successUrl,
      cancel_url: `${origin}/?checkout=cancel&plan=${plan}`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_creation: cfg.mode === "payment" ? "always" : undefined,
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
