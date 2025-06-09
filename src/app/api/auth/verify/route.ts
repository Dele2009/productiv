// app/api/auth/verify/route.ts
import { initDB } from "@/server/config/db";
import { Token, User } from "@/server/models";
import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

export async function POST(req: NextRequest) {
  try {
    await initDB();
    const { token, email } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: "Token is required." },
        { status: 400 }
      );
    }

    const usertoken: any = await Token.findOne({
      where: {
        token,
        type: "email_verification",
        expiresAt: {
          [Op.gt]: new Date(), // Check if token is not expired
        },
      },
    });

    if (!usertoken) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 404 }
      );
    }
    const user = usertoken.getUser();

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 404 }
      );
    }

    if (user.email !== email) {
      return NextResponse.json(
        { message: "Email does not match the token." },
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
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
