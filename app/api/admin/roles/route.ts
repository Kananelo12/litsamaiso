import { connectDB } from "@/utils/mongodb";
import Role from "@/models/Role";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/actions/auth.action";

// Get all roles (admin only)
export async function GET() {
  try {
    await connectDB();

    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const roles = await Role.find({}).sort({ name: 1 });

    return NextResponse.json({
      data: roles,
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}
