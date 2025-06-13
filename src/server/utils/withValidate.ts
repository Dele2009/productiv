import { NextRequest, NextResponse } from "next/server";
import { AnySchema } from "yup";
import { validateSchema } from "./validate";

// lib/withValidation.ts
export function withValidation<T>(
  schema: AnySchema,
  handler: (validatedBody: T, request: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const body = await req.json();
    const { data, errors } = await validateSchema<T>(schema, body);
    if (errors) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }
    try {
      return await handler(data!, req);
    } catch (error) {
      console.error("Handler error:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
