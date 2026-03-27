import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  if (!token || !password || password.length < 8) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 });
  }

  if (resetToken.expiresAt < new Date()) {
    return NextResponse.json({ error: "This link has expired" }, { status: 400 });
  }

  if (resetToken.usedAt) {
    return NextResponse.json({ error: "This link has already been used" }, { status: 400 });
  }

  const passwordHash = await hash(password, 12);

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { usedAt: new Date() },
  });

  await logAudit({
    organizationId: resetToken.user.organizationId || undefined,
    userId: resetToken.userId,
    action: "user.password_reset",
    resource: "User",
    resourceId: resetToken.userId,
  });

  return NextResponse.json({ success: true });
}
