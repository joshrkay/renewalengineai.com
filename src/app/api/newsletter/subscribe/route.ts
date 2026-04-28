import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendNewsletterWelcome } from "@/lib/email";
import { logAudit } from "@/lib/audit";
import { log } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      email?: unknown;
      name?: unknown;
      source?: unknown;
    };

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const name =
      typeof body.name === "string" && body.name.trim()
        ? body.name.trim()
        : null;
    const source =
      typeof body.source === "string" && body.source.trim()
        ? body.source.trim().slice(0, 64)
        : "newsletter";

    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const unsubscribeToken = randomBytes(32).toString("hex");

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email, name, source, unsubscribeToken },
      update: {
        name: name ?? undefined,
        unsubscribedAt: null,
      },
    });

    await logAudit({
      action: "newsletter.subscribed",
      resource: "NewsletterSubscriber",
      resourceId: subscriber.id,
      metadata: { source },
    });

    sendNewsletterWelcome(email, name, subscriber.unsubscribeToken).catch(
      (err) => {
        log.error("[newsletter-subscribe] welcome email failed:", err);
      }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    log.error("[newsletter-subscribe] submission failed:", err);
    return NextResponse.json({ error: "submission_failed" }, { status: 500 });
  }
}
