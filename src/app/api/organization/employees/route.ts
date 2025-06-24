import { addEmployeeSchema, AddEmployeeSchema } from "@/lib/validations/schema";
import { Department, Organization, User, UserMembership } from "@/server/models";
import {
  HandlerArgs,
  withValidationAndRole,
} from "@/server/utils/withValidateAndRole";
import { NextResponse } from "next/server";
import { Op } from "sequelize";

const handleGet = async ({ req, user }: HandlerArgs) => {
  const { searchParams } = req.nextUrl;
  const departmentId = searchParams.get("excludeDepartment");
  const formatted = JSON.parse(searchParams.get("format") || "false");

  const whereClause = {
    organizationId: user.organization.id,
    role: "member",
  };

  let excludeUserIds: string[] = [];

  if (departmentId) {
    const memberships = await UserMembership.findAll({
      where: {
        departmentId,
        organizationId: user.organization.id,
      },
      attributes: ["userId"],
    });

    excludeUserIds = memberships.map((m: any) => m.userId);
  }

  const employees = await User.findAll({
    where: {
      ...whereClause,
      ...(excludeUserIds.length > 0 && {
        id: { [Op.notIn]: excludeUserIds },
      }),
    },
    include: {
      model: Department,
      through: { attributes: [] },
      attributes: ["name"],
    },
    order: [["name", "ASC"]],
  });

  if (formatted) {
    const result = employees.map((e) => ({
      id: e.id,
      name: e.name,
      email: e.email,
      role: e.role,
      isActive: e.isActive,
      departments: e.Departments?.map((d: any) => d.name) || [],
    }));

    return NextResponse.json(result);
  }

  return NextResponse.json(employees);
};

const handlePost = async ({ user, data }: HandlerArgs<AddEmployeeSchema>) => {
  const { name, email, role = "member" } = data!;

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email required" },
      { status: 400 }
    );
  }
  const {id} = user.organization
  const org =await  Organization.findByPk(id)
  if (!org) {
    return NextResponse.json(
      { error: "Organization data not found" },
      { status: 404 }
    );
  }
  const newUser = await User.create({
    name,
    email,
    role,
    organizationId: org.id,
    password: org.passcode,
    isActive: true,
    isVerified: true,
  });

  return NextResponse.json(newUser);
};

export const GET = withValidationAndRole(["admin"], handleGet);
export const POST = withValidationAndRole<AddEmployeeSchema>(
  ["admin"],
  handlePost,
  addEmployeeSchema
);
