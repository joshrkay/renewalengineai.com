import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";
import { sendWelcomeEmail } from "@/lib/email";
import { logAudit } from "@/lib/audit";
import { log } from "@/lib/logger";
import type Stripe from "stripe";

// Stripe signature verification needs the raw request body, so this route
// must run on the Node.js runtime (not the edge) and must not be cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    log.error("Webhook signature verification failed");
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(subscription);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(subscription);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email;
  if (!email) return;

  const tier = (session.metadata?.tier || "AUDIT") as "AUDIT" | "SPRINT" | "MANAGED";
  const name = session.customer_details?.name || null;

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Create org and user without storing a plaintext password
    const org = await prisma.organization.create({
      data: {
        name: name || email.split("@")[0],
        stripeCustomerId: session.customer as string,
        subscriptionTier: tier,
        subscriptionStatus: "ACTIVE",
      },
    });

    user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: null, // No password yet — user sets it via reset link
        organizationId: org.id,
      },
    });

    await prisma.subscription.create({
      data: {
        organizationId: org.id,
        stripeSubscriptionId: session.subscription as string | null,
        tier,
        status: "ACTIVE",
      },
    });

    // Create a secure password reset token (24-hour expiry)
    const resetToken = randomBytes(32).toString("base64url");
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Send welcome email with secure reset link (no password in email)
    await sendWelcomeEmail(email, name, tier, resetToken);

    await logAudit({
      organizationId: org.id,
      userId: user.id,
      action: "user.created",
      resource: "User",
      resourceId: user.id,
      metadata: { tier, source: "stripe_checkout" },
    });
  } else {
    if (user.organizationId) {
      await prisma.organization.update({
        where: { id: user.organizationId },
        data: {
          subscriptionTier: tier,
          subscriptionStatus: "ACTIVE",
          stripeCustomerId: session.customer as string,
        },
      });
    }
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const sub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });
  if (!sub) return;

  const statusMap: Record<string, "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING"> = {
    active: "ACTIVE",
    canceled: "CANCELED",
    past_due: "PAST_DUE",
    trialing: "TRIALING",
  };
  const status = statusMap[subscription.status] || "ACTIVE";

  await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });

  await prisma.organization.update({
    where: { id: sub.organizationId },
    data: { subscriptionStatus: status },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const sub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });
  if (!sub) return;

  await prisma.subscription.update({
    where: { id: sub.id },
    data: { status: "CANCELED" },
  });

  await prisma.organization.update({
    where: { id: sub.organizationId },
    data: { subscriptionStatus: "CANCELED" },
  });
}
