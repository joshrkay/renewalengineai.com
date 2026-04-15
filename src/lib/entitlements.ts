import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { SubscriptionStatus, SubscriptionTier } from "@prisma/client";

export type CourseAccess =
  | { allowed: true; reason: "active_subscription"; tier: SubscriptionTier }
  | { allowed: false; reason: "unauthenticated" }
  | { allowed: false; reason: "no_organization" }
  | { allowed: false; reason: "inactive_subscription"; status: SubscriptionStatus };

// A user has access to paid course content if they are signed in and their
// organization has a subscription in a state that should grant access.
// We intentionally treat ACTIVE and TRIALING as entitled. CANCELED and
// PAST_DUE are not. Any paid tier (AUDIT / SPRINT / MANAGED) currently
// includes the course library — if that changes, narrow the check here.
const ENTITLED_STATUSES: SubscriptionStatus[] = ["ACTIVE", "TRIALING"];

export async function getCourseAccess(): Promise<CourseAccess> {
  const session = await auth();
  if (!session?.user?.id) {
    return { allowed: false, reason: "unauthenticated" };
  }

  const organizationId = (session as unknown as { organizationId?: string })
    .organizationId;
  if (!organizationId) {
    return { allowed: false, reason: "no_organization" };
  }

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { subscriptionTier: true, subscriptionStatus: true },
  });

  if (!org) {
    return { allowed: false, reason: "no_organization" };
  }

  if (!ENTITLED_STATUSES.includes(org.subscriptionStatus)) {
    return {
      allowed: false,
      reason: "inactive_subscription",
      status: org.subscriptionStatus,
    };
  }

  return {
    allowed: true,
    reason: "active_subscription",
    tier: org.subscriptionTier,
  };
}
