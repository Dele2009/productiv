// app/api/organization/[orgSlug]/departments/create/route.ts
import { Organization, User } from "@/server/models";
import {
  CreateDepartmentSchema,
  createDepartmentSchema,
} from "@/lib/validations/schema";
import {
  HandlerArgs,
  withValidationAndRole,
} from "@/server/utils/withValidateAndRole";
import { NextResponse } from "next/server";

const handlePost = async ({
  data,
  user,
}: HandlerArgs<CreateDepartmentSchema>) => {
  const { id } = user.organization;
  const organization = await Organization.findByPk(id);

  if (!organization) {
    return NextResponse.json(
      { error: "Organization not found" },
      { status: 404 }
    );
  }

  // Ensure current user is the admin of the org
  if (organization.adminId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const newDepartment = await organization.createDepartment({
    name: data?.name,
    description: data?.description,
  });

  return NextResponse.json({ success: true, department: newDepartment });
};

const handleGet = async ({ user }: HandlerArgs) => {
  const org = await Organization.findOne({
    where: { id: user.organization.id },
  });

  if (!org)
    return NextResponse.json(
      { error: "Organization not found" },
      { status: 404 }
    );

  const departments = await org.getDepartments({
    include: [
      {
        model: User,
        through: { attributes: [] },
      },
    ],
  });

  const result = departments.map((dept: any) => ({
    id: dept.id,
    name: dept.name,
    description: dept.description,
    status: dept.status ?? "active",
    employeeCount: dept.Users?.length || 0,
    createdAt: dept.createdAt,
  }));

  return NextResponse.json(result);
};

export const POST = withValidationAndRole<CreateDepartmentSchema>(
  ["admin"],
  handlePost,
  createDepartmentSchema
);

export const GET = withValidationAndRole(["admin"], handleGet);
