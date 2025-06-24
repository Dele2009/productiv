import {
  AddUserToDepartment,
  addUserToDepartment,
} from "@/lib/validations/schema";
import { Department, User, UserMembership } from "@/server/models";
import {
  HandlerArgs,
  withValidationAndRole,
} from "@/server/utils/withValidateAndRole";
import { NextResponse } from "next/server";
import { Op } from "sequelize";

const handleGet = async ({ params, user }: HandlerArgs) => {
  const { id } = await params;

  const department: any = await Department.findOne({
    where: { id, organizationId: user.organization.id },
    include: [User],
  });

  if (!department)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(department.Users);
};

const handlePost = async ({
  user,
  params,
  data,
}: HandlerArgs<AddUserToDepartment>) => {
  const { id: departmentId } = await params;
  const { userIds } = data!;

  if (!Array.isArray(userIds)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const department: any = await Department.findOne({
    where: { id: departmentId, organizationId: user.organization.id },
  });

  if (!department) {
    return NextResponse.json(
      { error: "Department not found" },
      { status: 404 }
    );
  }

  // Check for existing memberships to avoid duplicates
  const existing = await UserMembership.findAll({
    where: {
      departmentId,
      userId: { [Op.in]: userIds },
    },
  });

  const existingUserIds = existing.map((m: any) => m.userId);
  const newUserIds = userIds.filter((uid) => !existingUserIds.includes(uid));

  // Create new membership records
  await UserMembership.bulkCreate(
    newUserIds.map((userId) => ({
      userId,
      departmentId,
      organizationId: user.organization.id,
    }))
  );

  const updatedUsers = await department.getUsers();
  return NextResponse.json(updatedUsers);
};

export const GET = withValidationAndRole(["admin"], handleGet);
export const POST = withValidationAndRole<AddUserToDepartment>(
  ["admin"],
  handlePost,
  addUserToDepartment
);
