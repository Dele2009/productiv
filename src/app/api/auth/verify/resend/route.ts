export const runtime = "nodejs";

import { initDB } from "@/server/config/db";
import { Organization, User } from "@/server/models";
import { getBaseUrl } from "@/server/utils/helpers";
import { sendVerificationEmail } from "@/server/utils/mailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await initDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required to resend verification." },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: Organization, as: "organization" }],
    });

    if (!user) {
      console.warn(
        `Attempt to resend verification for non-existent email: ${email}`
      );
      return NextResponse.json(
        {
          message:
            "If an account with that email exists, a new verification email has been sent.",
        },
        { status: 200 }
      );
    }

    // 3. Check if the user is already verified
    if (user.isVerified) {
      return NextResponse.json(
        { message: "This email is already verified. You can now log in." },
        { status: 200 }
      );
    }

    // 4. Generate a new verification token and expiry
    const token = await user.generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.createToken({
      token,
      expiresAt, // 1 day
      type: "email_verification",
    });
    // 6. Send the new verification email
    await sendVerificationEmail(user.email, {
      name: user.name,
      organizationName: user.organization.name,
      verificationLink: `${getBaseUrl(req)}/auth/verify?token=${token}&email=${user.email}`,
    });

    // 7. Respond with success
    return NextResponse.json(
      {
        message:
          "A new verification email has been sent to your inbox. Please check your spam folder as well.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in resend verification API:", error);
    return NextResponse.json(
      {
        message:
          "An internal server error occurred while trying to resend the verification email.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
