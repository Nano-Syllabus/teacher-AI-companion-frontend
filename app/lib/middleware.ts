import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const ROLE_REDIRECTS: Record<string, string> = {
  teacher: "/dashboard",
  student: "/teachers",
};

// Routes that should only be accessible when NOT signed in
const AUTH_ROUTES = ["/auth", "/register"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // If signed in and hitting an auth page → redirect to their role page
  if (token && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    const dest = ROLE_REDIRECTS[token.role as string] ?? "/";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // If signed in and hitting root → redirect to their role page
  if (token && pathname === "/") {
    const dest = ROLE_REDIRECTS[token.role as string] ?? "/";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // If NOT signed in and hitting a protected route → send to login
  if (!token && !AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico
     * - /api/auth (NextAuth routes)
     * - /download/:path* (your public QR scan pages — no auth needed)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth|download).*)",
  ],
};