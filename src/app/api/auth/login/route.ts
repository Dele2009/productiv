import { NextResponse } from "next/server";
import User from "@/server/models/user";
import bcrypt from "bcrypt";
import { signToken } from "@/server/utils/auth";
import { initDB } from "@/server/config/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await initDB();
  const { email, password, type, employeeId } = await req.json();
  let user: any;

  if (type === "employee") {
    user = await User.findOne({ where: { email, employeeId } });
  } else {
    user = await User.findOne({ where: { email } });
  }
  if (!user || !(await bcrypt.compare(password, user.password)))
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const accessToken = signToken({id: user.id, role: user.role});
  const refreshToken = signToken({id: user.id, role: user.role}, "7d");
  const cookieStore = await cookies()
  cookieStore.set("session_token", "your_secure_session_id_here", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure: true in production
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: "lax", // Protects against CSRF attacks
  });

  cookieStore.set("user_preference", "dark_mode", {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days, can be accessed by client-side JS if httpOnly is false
  });
}
