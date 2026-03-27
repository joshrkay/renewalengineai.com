import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import type Stripe from "stripe";

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
    console.error("Webhook signature verification failed:", err);
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

  const plan = session.metadata?.plan;
  const tier = (session.metadata?.tier || "AUDIT") as
    | "AUDIT"
    | "SPRINT"
    | "MANAGED";

  // Check if user already exists
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Generate a temporary password (user will reset via magic link)
    const tempPassword = randomBytes(16).toString("hex");
    const passwordHash = await hash(tempPassword, 12);

    // Create organization
    const org = await prisma.organization.create({
      data: {
        name: session.customer_details?.name || email.split("@")[0],
        stripeCustomerId: session.customer as string,
        subscriptionTier: tier,
        subscriptionStatus: "ACTIVE",
      },
    });

    // Create user
    user = await prisma.user.create({
      data: {
        email,
        name: session.customer_details?.name,
        passwordHash,
        organizationId: org.id,
      },
    });

    // Create subscription record
    await prisma.subscription.create({
      data: {
        organizationId: org.id,
        stripeSubscriptionId: session.subscription as string | null,
        tier,
        status: "ACTIVE",
      },
    });
  } else {
    // Update existing user's organization tier if upgrading
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

  // TODO: Send welcome email with password reset / magic link
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
