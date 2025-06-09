import { NextResponse } from "next/server";
import { initDB } from "@/server/config/db";
import { withValidation } from "@/lib/withValidate";
import { RegisterOwnerData, registerOwnerSchema } from "@/lib/validations/auth";
import { Organization, User } from "@/server/models";
import { sendVerificationEmail } from "@/lib/mailer";

export const POST = withValidation<RegisterOwnerData>(
  registerOwnerSchema,
  async (data) => {
    await initDB();
    const {
      email,
      c_password,
      country,
      industry,
      name,
      organizationName,
      organizationType,
      password,
      size,
    } = data;

    const exists = await User.findOne({ where: { email } });
    if (exists)
      return NextResponse.json({ error: "Email exists" }, { status: 400 });
    if (c_password !== password)
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    if (password.length < 6)
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );

    const organization: any = await Organization.create({
      name: organizationName,
      type: organizationType,
      size,
      country,
      industry,
    });
    const user = await User.create({
      email,
      password,
      name,
      role: "admin",
      organizationId: organization.id,
    });
    const token = await user.generateVerificationToken();
    user.createToken({
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      type: "email_verification",
    });
    await sendVerificationEmail(user.email, {
      name: user.name,
      organization_name: organization.name,
      verificationLink: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${user.getToken().token}&email=${user.email}`,
    });
    return NextResponse.json({
      message: "Organization account created successfully",
    });
  }
);
