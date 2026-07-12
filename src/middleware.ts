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
    // stranding an already-signed-in user on the dashboard. Only relative
    // paths are followed to avoid an open redirect.
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    const target =
      callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
        ? callbackUrl
        : "/dashboard";
    return NextResponse.redirect(new URL(target, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
