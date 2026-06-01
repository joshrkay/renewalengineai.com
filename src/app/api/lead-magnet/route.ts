import { after, NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
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

    // Upsert so duplicate submissions return success without creating
    // duplicate rows or re-spamming the welcome email path.
    const subscriber = await prisma.leadMagnetSubscriber.upsert({
      where: { email },
      create: { email, source },
      update: {},
    });

    await logAudit({
      action: "lead_magnet.subscribed",
      resource: "LeadMagnetSubscriber",
      resourceId: subscriber.id,
      metadata: { source },
    });

    // Capture the GA client id from the request cookie now; it isn't
    // available once we're inside `after()`.
    const clientId = readGaClientIdFromCookie(req.headers.get("cookie"));

    // Deliver the playbook and fire the lead event AFTER the response, but
    // within the request lifetime via `after()` (Vercel keeps the function
    // alive to finish it). A bare fire-and-forget promise can be frozen or
    // dropped when the serverless function suspends post-response, and the
    // playbook email is the whole point of this endpoint. The DB row above
    // is already committed as the source of truth, so a failed send never
    // fails the user's submission, and the GA4 event no-ops without env vars.
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    log.error("[lead-magnet] submission failed:", err);
    return NextResponse.json({ error: "submission_failed" }, { status: 500 });
  }
}
