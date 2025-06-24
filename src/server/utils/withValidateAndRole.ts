// lib/withValidationAndRole.ts
import { NextRequest, NextResponse } from "next/server";
import { AnySchema } from "yup";
import { validateSchema } from "./validate";
import { auth } from "@/auth";
import { initDB } from "../config/db";

export type HandlerArgs<T = any> = {
  data: T | null;
  req: NextRequest;
  user: any;
  params: Promise<Record<string, string>>;
};

export function withValidationAndRole<T>(
  allowedRoles: string[],
  handler: (args: HandlerArgs<T>) => Promise<NextResponse>,
  schema?: AnySchema
) {
  return async (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ) => {
    const session = await auth();
    const user = session?.user;


    if (allowedRoles.length && !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (allowedRoles.length && !allowedRoles.includes(user!.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    let data: T | null = null;

    // Only try to parse body and validate if method typically has a body
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && schema) {
      try {
        const body = await req.json();
        const { data: validated, errors } = await validateSchema<T>(
          schema,
          body
        );

        if (errors) {
          return NextResponse.json({ success: false, errors }, { status: 400 });
        }

        data = validated!;
      } catch (err: any) {
        return NextResponse.json(
          {
            success: false,
            error: err.message || "Invalid JSON or schema failed",
          },
          { status: 400 }
        );
      }
    }

    try {
      await initDB()
      return await handler({
        data,
        req,
        user,
        params: context.params,
      });
    } catch (error) {
      console.error("Handler error:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
