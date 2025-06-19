export const runtime = "nodejs";


import { NextResponse } from "next/server";
import User from "@/server/models/user";
import bcrypt from "bcrypt";
import { signToken } from "@/server/utils/auth";
import { initDB } from "@/server/config/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await initDB();
  const { email, orgPasscode, employeeId } = await req.json();

  const user = await User.findOne({ where: { email, employeeId } });
  if (!user || !(await bcrypt.compare(orgPasscode, user.password)))
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

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
}
