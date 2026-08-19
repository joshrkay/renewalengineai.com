import { unstable_rethrow } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { log } from "@/lib/logger";

export type CourseAccess =
  | { allowed: true; reason: "entitled" }
  | { allowed: false; reason: "unauthenticated" }
  | { allowed: false; reason: "no_organization" }
  | { allowed: false; reason: "not_entitled" }
  | { allowed: false; reason: "error" };

// Access to paid course content is strictly per-course. A user unlocks a
// course by purchasing it through Stripe — the webhook records a row in
// `CourseEntitlement` that this helper reads. Service-tier subscriptions
// (audit / sprint / managed) do NOT imply course access.
//
// If the session or entitlement lookup itself fails (auth misconfiguration
// like a missing AUTH_SECRET, or a DB outage), fail closed with the
// distinct "error" reason so callers can render a retry/support state
// instead of a paywall — a paying customer mid-outage must never be shown
// a purchase button. Next.js control-flow errors are rethrown untouched.
export async function getCourseAccess(
  courseSlug: string
): Promise<CourseAccess> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { allowed: false, reason: "unauthenticated" };
    }

    const organizationId = (session as unknown as { organizationId?: string })
      .organizationId;
    if (!organizationId) {
      return { allowed: false, reason: "no_organization" };
    }

    const entitlement = await prisma.courseEntitlement.findUnique({
      where: {
        organizationId_courseSlug: {
          organizationId,
          courseSlug,
        },
      },
      select: { id: true },
    });

    if (!entitlement) {
      return { allowed: false, reason: "not_entitled" };
    }

    return { allowed: true, reason: "entitled" };
  } catch (error) {
    unstable_rethrow(error);
    log.error("getCourseAccess failed; failing closed with error state", error);
    return { allowed: false, reason: "error" };
  }
}
