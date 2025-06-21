export const runtime = "nodejs";
// app/api/auth/verify/route.ts
import { initDB } from "@/server/config/db";
import { Token } from "@/server/models";
import { verifyToken } from "@/server/utils/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await initDB();
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is required." },
        { status: 400 }
      );
    }

    const usertoken: any = await Token.findOne({
      where: {
        token,
        type: "email_verification",
      },
    });

    if (!usertoken) {
      console.log("Invalid token.");
      return NextResponse.json(
        { error: "Invalid token." },
        { status: 404 }
      );
    }

    if (new Date(usertoken.expiresAt).getTime() < Date.now()) {
      console.log("Expired token.");
      return NextResponse.json(
        { error: "Expired token." },
        { status: 410 }
      );
    }
    const user = await usertoken.getUser();
    console.log(user);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 410 }
      );
    }

    const decodeUser: any = verifyToken(token);

    if (user.email !== decodeUser?.email) {
      return NextResponse.json(
        { error: "Email does not match the token." },
        { status: 400 }
      );
    }
    await usertoken.destroy();
    await user.update({
      isVerified: true,
      isActive: true,
    });

    return NextResponse.json({
      message: "Your email has been successfully verified.",
    });
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
