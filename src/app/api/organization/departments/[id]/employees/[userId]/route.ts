import { NextResponse } from "next/server";
import {
  HandlerArgs,
  withValidationAndRole,
} from "@/server/utils/withValidateAndRole";
import { Department, User } from "@/server/models";

const handleDelete = async ({ user, params }: HandlerArgs) => {
  const { id, userId } = await params;
  const department: any = await Department.findOne({
    where: { id, OrganizationId: user.organization.id },
  });

  if (!department)
    return NextResponse.json(
      { error: "Department not found" },
      { status: 404 }
    );

  const member = await User.findByPk(userId);
  if (!member)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  await department.removeUser(member);
  return NextResponse.json({ success: true });
};
export const DELETE = withValidationAndRole(["admin"], handleDelete);
