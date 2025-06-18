import { NextResponse } from "next/server";
import User from "@/server/models/user";
import { initDB } from "@/server/config/db";

export async function GET() {
  try {
    await initDB();
    const users = await User.findAll({
      attributes: ["id", "email", "name"],
      order: [["createdAt", "DESC"]],
    });
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching users" },
      { status: 500 }
    );
  }
}
