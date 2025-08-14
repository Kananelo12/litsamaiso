import { connectDB } from "@/utils/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/actions/auth.action";

// Get current user profile
export async function GET() {
  try {
    await connectDB();

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await User.findById(currentUser.id)
      .populate("role", "name")
      .select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        studentCardUrl: user.studentCardUrl,
        role: user.role?.name || "student",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// Update current user profile
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { name, email, studentCardUrl } = await req.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: currentUser.id } 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already taken" },
        { status: 409 }
      );
    }

    const updateData: any = { name, email };
    if (studentCardUrl) {
      updateData.studentCardUrl = studentCardUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      currentUser.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("role", "name").select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        studentId: updatedUser.studentId,
        studentCardUrl: updatedUser.studentCardUrl,
        role: updatedUser.role?.name || "student",
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}