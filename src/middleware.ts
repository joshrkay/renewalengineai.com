import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;

  const isLoggedIn = !!token;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnLogin = req.nextUrl.pathname === "/login";

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isOnLogin && isLoggedIn) {
    // Honor a same-origin callbackUrl (e.g. a course lesson) instead of
    // stranding an already-signed-in user on the dashboard. Validate the
    // RESOLVED URL's origin rather than pattern-matching the string: the
    // URL parser treats backslashes as slashes, so inputs like
    // "/\evil.example" resolve off-origin despite starting with "/".
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    let target = new URL("/dashboard", req.nextUrl);
    if (callbackUrl) {
      try {
        const resolved = new URL(callbackUrl, req.nextUrl);
        if (resolved.origin === req.nextUrl.origin) {
          target = resolved;
        }
      } catch {
        // unparsable callbackUrl — fall through to /dashboard
      }
    }
    return NextResponse.redirect(target);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
