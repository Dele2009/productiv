import { NextResponse } from "next/server";
import User from "@/server/models/user";
import bcrypt from "bcrypt";
import { signToken } from "@/server/utils/auth";
import { initDB } from "@/server/config/db";

export async function POST(req: Request) {
  await initDB();
  const { email, password } = await req.json();

  const user: any = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signToken(user);
  return NextResponse.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
}
