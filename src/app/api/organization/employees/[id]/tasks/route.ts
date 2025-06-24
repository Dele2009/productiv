import { Task } from "@/server/models";
import { HandlerArgs, withValidationAndRole } from "@/server/utils/withValidateAndRole";
import { NextResponse } from "next/server";

const handleGet = async ({ params, user }: HandlerArgs) => {
  const { id } = await params;

  const tasks = await Task.findAll({
    where: {
      UserId: id,
      OrganizationId: user.organization.id,
    },
  });

  if (!tasks) {
    return NextResponse.json(
      {
        error: "Tasks not found for this employee",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(tasks);
};


export const GET = withValidationAndRole(["admin"], handleGet);