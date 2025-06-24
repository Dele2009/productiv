export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  HandlerArgs,
  withValidationAndRole,
} from "@/server/utils/withValidateAndRole";
import { RegisterOwnerData, registerOwnerSchema } from "@/lib/validations/auth";
import { Organization, User } from "@/server/models";
import { sendVerificationEmail } from "@/server/utils/mailer";
import { getBaseUrl } from "@/server/utils/helpers";

const handlePost = async ({ data, req }: HandlerArgs<RegisterOwnerData>) => {
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
  } = data!;

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
  });

  user.setOrganization(organization);
  user.setAdminOf(organization);

  const token = await user.generateVerificationToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.createToken({
    token,
    expiresAt, // 1 day
    type: "email_verification",
  });
  console.log(expiresAt);
  const userToken = await user.getToken();

  await sendVerificationEmail(user.email, {
    name: user.name,
    organizationName: organization.name,
    verificationLink: `${getBaseUrl(req)}/auth/verify/${userToken.token}?email=${user.email}`,
  });
  return NextResponse.json({
    message: "Organization account created successfully",
  });
};


export const POST = withValidationAndRole<RegisterOwnerData>(
  [],
  handlePost,
  registerOwnerSchema
);
