import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { prisma } from "@/lib/db";
import {
  sendMastermindInviteNotification,
  sendLeadMagnetDelivery,
} from "@/lib/email";
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

    // Whether this email is new decides delivery below: the guide email
    // goes out at most once per address, ever. Without this, the public
    // endpoint is a mail pump — repeat POSTs with a victim's address and
    // a lead-magnet source would email them on every call.
    const existing = await prisma.mastermindInvite.findUnique({
      where: { email },
      select: { id: true },
    });

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

    // Emails run via after() so they survive the serverless response
    // being sent (a bare floating promise can be frozen mid-flight on
    // Vercel) without blocking the caller. The DB row is the source of
    // truth either way; on-page delivery never depends on these.
    after(async () => {
      await sendMastermindInviteNotification(email, name, source).catch(
        (err) => {
          log.error("[mastermind-invite] notification failed:", err);
        }
      );
      // Guide delivery: only for lead-magnet sources, and only on the
      // first-ever submission for this address (see `existing` above).
      if (!existing) {
        await sendLeadMagnetDelivery(email, name, source).catch((err) => {
          log.error("[mastermind-invite] lead delivery failed:", err);
        });
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    log.error("[mastermind-invite] submission failed:", err);
    return NextResponse.json({ error: "submission_failed" }, { status: 500 });
  }
}
