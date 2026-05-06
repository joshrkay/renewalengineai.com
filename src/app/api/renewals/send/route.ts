import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, getTenantDb } from "@/lib/db";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "RenewalEngineAI <noreply@renewalengineai.com>";

export async function POST(req: NextRequest) {
  const session = await auth();
  const orgId = (session as any)?.organizationId;
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { draftId, subject: subjectOverride, body: bodyOverride } = await req.json();
  if (!draftId) return NextResponse.json({ error: "draftId required" }, { status: 400 });

  const draft = await prisma.renewalDraft.findFirst({
    where: { id: draftId, organizationId: orgId },
    include: { policy: true },
  });
  if (!draft) return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  if (draft.status === "SENT") return NextResponse.json({ error: "Already sent" }, { status: 409 });

  const subject = subjectOverride ?? draft.subject;
  const body = bodyOverride ?? draft.body;

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
        subject,
        text: body,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Email send failed: ${err}` }, { status: 502 });
    }
  }

  const sentAt = new Date();
  const tenantDb = getTenantDb(orgId);

  const [updated] = await prisma.$transaction([
    prisma.renewalDraft.update({
      where: { id: draftId },
      data: { status: "SENT", sentAt, subject, body },
    }),
    prisma.emailSendLog.create({
      data: {
        organizationId: orgId,
        policyId: draft.policyId,
        draftId,
        recipientEmail: draft.policy.clientEmail,
        subject,
        sentAt,
      },
    }),
  ]);

  return NextResponse.json(updated);
}
