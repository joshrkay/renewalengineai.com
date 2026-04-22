import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendMastermindInviteNotification } from "@/lib/email";
import { logAudit } from "@/lib/audit";
import { log } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Basic RFC 5322-lite email check. Good enough to reject obvious junk; the
// source of truth is the `email` column's uniqueness constraint.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      email?: unknown;
      name?: unknown;
      source?: unknown;
      notes?: unknown;
    };

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const name =
      typeof body.name === "string" && body.name.trim() ? body.name.trim() : null;
    const source =
      typeof body.source === "string" && body.source.trim()
        ? body.source.trim().slice(0, 64)
        : "mastermind_page";
    const notes =
      typeof body.notes === "string" && body.notes.trim()
        ? body.notes.trim().slice(0, 2000)
        : null;

    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    // Upsert so duplicate submissions return success without creating
    // duplicate rows. Existing rows keep their `contacted` flag.
    const invite = await prisma.mastermindInvite.upsert({
      where: { email },
      create: { email, name, source, notes },
      update: {
        name: name ?? undefined,
        notes: notes ?? undefined,
      },
    });

    await logAudit({
      action: "mastermind_invite.submitted",
      resource: "MastermindInvite",
      resourceId: invite.id,
      metadata: { source },
    });

    // Fire-and-forget notification to the ops inbox. Do not block the
    // response on email delivery — the DB row is the source of truth.
    sendMastermindInviteNotification(email, name, source).catch((err) => {
      log.error("[mastermind-invite] notification failed:", err);
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    log.error("[mastermind-invite] submission failed:", err);
    return NextResponse.json({ error: "submission_failed" }, { status: 500 });
  }
}
