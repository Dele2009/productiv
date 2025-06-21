// src/middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  // console.log(request.cookies.getAll());
  const token = await getToken({
    req: request,
    secret,
    cookieName:
      process.env.NODE_ENV === "development"
        ? "authjs.session-token"
        : "__Secure-authjs.session-token", 
  });
  // console.log(token);

  // No session? Redirect to login
  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  const role = token.role;
  const path = request.nextUrl.pathname;

  if (path.startsWith("/organization") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/organization/:path*", "/tasks/:path*"],
};
