import { initDB } from "@/server/config/db";
import User from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDB();
    const { id } = await params;
    const user = await User.findByPk(id, {
      attributes: ["id", "email", "name"],
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: `User ID is ${id}`, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "User not found or an error occurred" },
      { status: 404 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDB();

    const { id } = await params;
    const { email, name } = await req.json();

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.email = email || user.email;
    user.name = name || user.name;

    await user.save();

    return NextResponse.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the user" },
      { status: 500 }
    );
  }
}
