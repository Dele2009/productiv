import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();

  if (!session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.user?.role;

  const path = request.nextUrl.pathname;

  // Role-based access logic
//   if (path.startsWith("/admin") && role !== "admin") {
//     return NextResponse.redirect(new URL("/not-allowed", request.url));
//   }

  if (path.startsWith("/organization") && ![ "admin"].includes(role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/organization/:path*", "/tasks/:path*"],
};
