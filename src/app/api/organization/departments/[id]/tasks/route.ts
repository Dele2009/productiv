import { CreateTaskSchema, createTaskSchema } from "@/lib/validations/schema";
import { Department, Task } from "@/server/models";
import {
  HandlerArgs,
  withValidationAndRole,
} from "@/server/utils/withValidateAndRole";
import { NextResponse } from "next/server";

const handleGet = async ({ params, user }: HandlerArgs) => {
  const { id } = await params;
  const department: any = await Department.findOne({
    where: { id, OrganizationId: user.organization.id },
  });

  if (!department)
    return NextResponse.json(
      { error: "Department not found" },
      { status: 404 }
    );

  const tasks = await Task.findAll({
    where: {
      DepartmentId: department.id,
      OrganizationId: user.organization.id,
    },
    order: [["createdAt", "DESC"]],
  });

  return NextResponse.json(tasks);
};

const handlePost = async ({
  user,
  params,
  data,
}: HandlerArgs<CreateTaskSchema>) => {
  const { id } = await params;
  const department: any = await Department.findOne({
    where: { id, organizationId: user.organization.id },
  });

  if (!department)
    return NextResponse.json(
      { error: "Department not found" },
      { status: 404 }
    );

  const { title, description, dueDate } = data!;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const task = await Task.create({
    title,
    description,
    dueDate: dueDate ? new Date(dueDate) : null,
    status: "todo",
    DepartmentId: department.id,
    OrganizationId: user.organization.id,
    UserId: user.id,
  });

  return NextResponse.json(task, { status: 201 });
};

export const GET = withValidationAndRole(["admin"], handleGet);

export const POST = withValidationAndRole<CreateTaskSchema>(
  ["admin"],
  handlePost,
  createTaskSchema
);
