/* eslint-disable @typescript-eslint/no-explicit-any */

import { connectDB } from "@/utils/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/actions/auth.action";

// Get all users (admin only)
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(query)
      .populate("role", "name")
      .select("-password") // Exclude password from response
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await User.countDocuments(query);

    // Filter by role after population if role filter is specified
    let filteredUsers = users;
    if (role) {
      filteredUsers = users.filter(user => user.role?.name === role);
    }

    return NextResponse.json({
      data: filteredUsers,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// Update user role (admin only)
export async function PUT(req: NextRequest) {
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

    const { userId, roleId } = await req.json();

    if (!userId || !roleId) {
      return NextResponse.json(
        { error: "User ID and Role ID are required" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: roleId },
      { new: true }
    ).populate("role", "name").select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User role updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}