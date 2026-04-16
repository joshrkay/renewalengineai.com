import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type CourseAccess =
  | { allowed: true; reason: "entitled" }
  | { allowed: false; reason: "unauthenticated" }
  | { allowed: false; reason: "no_organization" }
  | { allowed: false; reason: "not_entitled" };

// Access to paid course content is strictly per-course. A user unlocks a
// course by purchasing it through Stripe — the webhook records a row in
// `CourseEntitlement` that this helper reads. Service-tier subscriptions
// (audit / sprint / managed) do NOT imply course access.
export async function getCourseAccess(
  courseSlug: string
): Promise<CourseAccess> {
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
}
