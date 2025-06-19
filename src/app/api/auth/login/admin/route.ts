export const runtime = "nodejs";

import { NextResponse } from "next/server";
import User from "@/server/models/user";
import bcrypt from "bcrypt";
import { signToken } from "@/server/utils/auth";
import { initDB } from "@/server/config/db";
import { cookies } from "next/headers";
import { Organization } from "@/server/models";

export async function POST(req: Request) {
  await initDB();
  const { email, password } = await req.json();

  const user = await User.findOne({
    where: { email },
    include: [{ model: Organization, as: "adminOf" }],
  });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return NextResponse.json({ error: "Invalid credentials" }, { status: 404 });

  if (!user.isVerified) {
    return NextResponse.json(
      {
        error:
          "Account verifcation is not complete, please verify your account",
      },
      { status: 401 }
    );
  }
  if (!user.isActive) {
    return NextResponse.json(
      {
        error:
          "Your account is not activated at the moment, contact your organization for assistance",
      },
      { status: 401 }
    );
  }
  const accessToken = signToken({ id: user.id, role: user.role });
  const refreshToken = signToken({ id: user.id, role: user.role }, "7d");
  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure: true in production
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: "lax", // Protects against CSRF attacks
  });
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure: true in production
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: "lax", // Protects against CSRF attacks
  });
  return NextResponse.json({
    name: user.name,
    email: user.email,
    organization: {
      id: user.adminOf.id,
      name: user.adminOf.name,
      slug: user.adminOf.slug,
      avatar: user.adminOf.logoUrl,
    },
  });
}
