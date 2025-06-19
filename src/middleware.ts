import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// If you're using `NEXTAUTH_SECRET`, use the same one here
const secret = process.env.NEXTAUTH_SECRET!;

export async function middleware(request: NextRequest) {
  const token =
    request.cookies.get("next-auth.session-token")?.value || // Dev (http)
    request.cookies.get("__Secure-next-auth.session-token")?.value; // Prod (https)

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decoded = jwt.verify(token, secret) as any;
    const role = decoded.role;
    const path = request.nextUrl.pathname;

    if (path.startsWith("/organization") && !["admin"].includes(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Add more access rules as needed

    return NextResponse.next();
  } catch (err) {
    console.error("JWT decode failed:", err);
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/organization/:path*", "/tasks/:path*"],
};
