import { Organization } from "@/server/models";
import {
  HandlerArgs,
  withValidationAndRole,
} from "@/server/utils/withValidateAndRole";
import { NextResponse } from "next/server";
import * as yup from "yup";
const schema = yup.object({
  passcode: yup.string().required("Passcode is required"),
  logoUrl: yup
    .string()
    .url("Logo URL must be a valid URL")
    .required("Logo URL is required"),
});
type Data = yup.InferType<typeof schema>;


const handlePut = async ({ data, user }: HandlerArgs<Data>) => {
  const { passcode, logoUrl } = data!;

  if (!passcode || !logoUrl) {
    return NextResponse.json(
      { error: "Passcode and logo URL are required" },
      { status: 400 }
    );
  }

  try {
    // Here you would typically update the organization in your database
    // For example:
    const org = await Organization.findByPk(user.organizationId);
    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    await org.update({
      passcode,
      logoUrl,
    });

    return NextResponse.json({
      message: "Organization setup completed successfully",
    });
  } catch (error) {
    console.error("Error setting up organization:", error);
    return NextResponse.json(
      { error: "Failed to set up organization" },
      { status: 500 }
    );
  }
};
export const PUT = withValidationAndRole<Data>(["admin"], handlePut, schema);
