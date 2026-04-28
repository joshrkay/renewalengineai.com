import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { log } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";

  if (!token || token.length !== 64 || !/^[0-9a-f]+$/.test(token)) {
    return NextResponse.redirect(
      new URL("/unsubscribe?error=invalid", req.url)
    );
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      return NextResponse.redirect(
        new URL("/unsubscribe?error=notfound", req.url)
      );
    }

    if (!subscriber.unsubscribedAt) {
      await prisma.newsletterSubscriber.update({
        where: { id: subscriber.id },
        data: { unsubscribedAt: new Date() },
      });
    }

    return NextResponse.redirect(new URL("/unsubscribe?success=1", req.url));
  } catch (err) {
    log.error("[newsletter-unsubscribe] failed:", err);
    return NextResponse.redirect(
      new URL("/unsubscribe?error=server", req.url)
    );
  }
}
