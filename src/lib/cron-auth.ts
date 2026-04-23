import type { NextRequest } from "next/server";

/**
 * Constant-time bearer-auth check for Vercel cron routes.
 *
 * Returns true only when CRON_SECRET is set AND the Authorization header
 * matches `Bearer <secret>`. Explicitly rejects when CRON_SECRET is unset
 * so a misconfigured deploy does not accept literal `Bearer undefined`
 * from a caller who guessed the default template-literal behavior.
 *
 * Use at the top of every cron route:
 *
 *   if (!isAuthorizedCron(req)) {
 *     return NextResponse.json({ error: "unauthorized" }, { status: 401 });
 *   }
 */
export function isAuthorizedCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return false;
  return authHeader === `Bearer ${secret}`;
}
