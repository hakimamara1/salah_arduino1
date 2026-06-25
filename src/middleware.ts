import { NextResponse, type NextRequest } from "next/server";
import { DASH_COOKIE, verifyToken } from "@/lib/auth/dashboard";

/**
 * Guards every /dashboard route except the login page. Unauthenticated
 * requests are redirected to /dashboard/login. The export route is covered too.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/dashboard/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(DASH_COOKIE)?.value;
  if (await verifyToken(token)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/dashboard/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
