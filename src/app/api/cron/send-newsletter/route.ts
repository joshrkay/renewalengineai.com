import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { listResources } from "@/lib/resources";
import { sendNewsletterIssue } from "@/lib/email";
import { isAuthorizedCron } from "@/lib/cron-auth";
import { log } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const resources = listResources();
  if (resources.length === 0) {
    return NextResponse.json({ status: "no_resources" });
  }

  const sent = await prisma.newsletterSend.findMany({
    select: { resourceSlug: true },
  });
  const sentSlugs = new Set(sent.map((s) => s.resourceSlug));

  // Oldest unsent first — send one issue per cron run
  const unsent = resources
    .filter((r) => !sentSlugs.has(r.slug))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? -1 : 1));

  if (unsent.length === 0) {
    return NextResponse.json({ status: "nothing_to_send" });
  }

  const resource = unsent[0];

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { unsubscribedAt: null },
    select: { email: true, name: true, unsubscribeToken: true },
  });

  if (subscribers.length === 0) {
    log.info(`[send-newsletter] no active subscribers — skipping ${resource.slug}`);
    return NextResponse.json({ status: "no_subscribers", slug: resource.slug });
  }

  let sentCount = 0;
  const failed: string[] = [];

  for (const sub of subscribers) {
    try {
      await sendNewsletterIssue(
        sub.email,
        sub.name,
        sub.unsubscribeToken,
        resource
      );
      sentCount++;
    } catch (err) {
      log.error(`[send-newsletter] failed for ${sub.email}:`, err);
      failed.push(sub.email);
    }
  }

  await prisma.newsletterSend.create({
    data: { resourceSlug: resource.slug, recipientCount: sentCount },
  });

  log.info(
    `[send-newsletter] sent "${resource.title}" to ${sentCount} subscribers` +
      (failed.length ? `, ${failed.length} failed` : "")
  );

  return NextResponse.json({
    status: "ok",
    slug: resource.slug,
    title: resource.title,
    sent: sentCount,
    failed: failed.length,
    remaining: unsent.length - 1,
  });
}
