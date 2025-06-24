import { Department, User } from "@/server/models";
import {
  withValidationAndRole,
  HandlerArgs,
} from "@/server/utils/withValidateAndRole";
import { NextResponse } from "next/server";
import { AddEmployeeSchema, addEmployeeSchema } from "@/lib/validations/schema";



// ✅ GET: Return single employee by ID (including departments)
const handleGet = async ({ params, user }: HandlerArgs) => {
  const { id } = await params;

  const employee = await User.findOne({
    where: {
      id,
      organizationId: user.organization.id,
    },
    include: {
      model: Department,
      attributes: ["id", "name"],
      through: { attributes: [] },
    },
  });

  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json(employee);
};

// ✅ PUT: Update employee
const handlePut = async ({ params, user, data }: HandlerArgs<AddEmployeeSchema>) => {
  const { id } = await params;

  const employee = await User.findOne({
    where: {
      id,
      organizationId: user.organization.id,
    },
  });

  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  // Update values

  await employee.update(data);

  return NextResponse.json({ success: true });
};

export const GET = withValidationAndRole(["admin"], handleGet);
export const PUT = withValidationAndRole<AddEmployeeSchema>(
  ["admin"],
  handlePut,
  addEmployeeSchema
);
