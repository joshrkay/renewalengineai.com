import { after, NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { sendLeadMagnetEmail } from "@/lib/email";
import { logAudit } from "@/lib/audit";
import { log } from "@/lib/logger";
import { readGaClientIdFromCookie, trackServerEvent } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Basic RFC 5322-lite email check. Good enough to reject obvious junk; the
// source of truth is the `email` column's uniqueness constraint.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Captures email opt-ins from the homepage lead magnet and the in-content
// CTA blocks, writes them to `LeadMagnetSubscriber`, and emails the playbook.
// The matching `LeadMagnetSubscriber` model already existed in the schema —
// this route is what was missing, so every prior submission 404'd.
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      email?: unknown;
      source?: unknown;
    };

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const source =
      typeof body.source === "string" && body.source.trim()
        ? body.source.trim().slice(0, 64)
        : "lead_magnet";

    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    // Insert with create + unique-violation catch rather than upsert, so we
    // can tell a brand-new subscriber from a repeat submission. The DB's
    // unique(email) constraint is the arbiter, so this stays correct under
    // concurrent double-clicks without a read-then-write race.
    let isNew = true;
    let subscriberId: string | undefined;
    try {
      const created = await prisma.leadMagnetSubscriber.create({
        data: { email, source },
      });
      subscriberId = created.id;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        isNew = false; // already subscribed — idempotent success, no re-send
      } else {
        throw err;
      }
    }

    await logAudit({
      action: "lead_magnet.subscribed",
      resource: "LeadMagnetSubscriber",
      resourceId: subscriberId,
      metadata: { source, isNew },
    });

    // Side effects fire for first-time subscribers only. Repeat submissions
    // (double-click, retries, or anyone re-posting the same address to this
    // public endpoint) must not re-send the playbook or inflate GA lead
    // counts. Run them via `after()` so they complete within the request
    // lifetime instead of as a fire-and-forget promise the serverless
    // function can drop after responding.
    if (isNew) {
      // Capture the GA client id now; it isn't available inside `after()`.
      const clientId = readGaClientIdFromCookie(req.headers.get("cookie"));
      after(async () => {
        try {
          await sendLeadMagnetEmail(email);
        } catch (err) {
          log.error("[lead-magnet] playbook email failed:", err);
        }
        if (clientId) {
          await trackServerEvent({
            name: "lead_submit",
            params: { source },
            clientId,
          });
        }
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    log.error("[lead-magnet] submission failed:", err);
    return NextResponse.json({ error: "submission_failed" }, { status: 500 });
  }
}
