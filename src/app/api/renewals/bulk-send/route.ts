import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, getTenantDb } from "@/lib/db";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "RenewalEngineAI <noreply@renewalengineai.com>";

export async function POST(req: NextRequest) {
  const session = await auth();
  const orgId = (session as any)?.organizationId;
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { policyIds } = await req.json();
  if (!Array.isArray(policyIds) || policyIds.length === 0) {
    return NextResponse.json({ error: "policyIds array required" }, { status: 400 });
  }

  const drafts = await prisma.renewalDraft.findMany({
    where: { policyId: { in: policyIds }, organizationId: orgId, status: "PENDING" },
    include: { policy: true },
    orderBy: { createdAt: "desc" },
    distinct: ["policyId"],
  });

  const sentAt = new Date();
  const results: { draftId: string; policyId: string; success: boolean; error?: string }[] = [];

  for (const draft of drafts) {
    try {
      if (RESEND_API_KEY) {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: draft.policy.clientEmail,
            subject: draft.subject,
            text: draft.body,
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          results.push({ draftId: draft.id, policyId: draft.policyId, success: false, error: err });
          continue;
        }
      }

      await prisma.$transaction([
        prisma.renewalDraft.update({
          where: { id: draft.id },
          data: { status: "SENT", sentAt },
        }),
        prisma.emailSendLog.create({
          data: {
            organizationId: orgId,
            policyId: draft.policyId,
            draftId: draft.id,
            recipientEmail: draft.policy.clientEmail,
            subject: draft.subject,
            sentAt,
          },
        }),
      ]);

      results.push({ draftId: draft.id, policyId: draft.policyId, success: true });
    } catch (err: any) {
      results.push({ draftId: draft.id, policyId: draft.policyId, success: false, error: err.message });
    }
  }

  const sentCount = results.filter((r) => r.success).length;
  return NextResponse.json({ sentCount, results });
}
