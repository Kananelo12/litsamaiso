import { connectDB } from "@/utils/mongodb";
import AccountList from "@/models/AccountList";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/actions/auth.action";
import { Types } from "mongoose";

// Update specific account record (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid account ID" },
        { status: 400 }
      );
    }

    const updateData = await req.json();
    const {
      fullnames,
      contractNumber,
      courseOfStudy,
      bankName,
      accountNumber,
      studentId,
      status
    } = updateData;

    // Validate required fields
    if (!fullnames || !contractNumber || !courseOfStudy || !bankName || !accountNumber) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Validate status
    if (status && !["pending", "confirmed", "erroneous"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Check if contract number is unique (excluding current record)
    const existingAccount = await AccountList.findOne({
      contractNumber,
      _id: { $ne: id }
    });

    if (existingAccount) {
      return NextResponse.json(
        { error: "Contract number already exists" },
        { status: 409 }
      );
    }

    const updatedAccount = await AccountList.findByIdAndUpdate(
      id,
      {
        fullnames: fullnames.trim(),
        contractNumber: contractNumber.trim(),
        courseOfStudy: courseOfStudy.trim(),
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        studentId: studentId ? studentId.trim() : undefined,
        status: status || "pending"
      },
      { new: true, runValidators: true }
    );

    if (!updatedAccount) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Account updated successfully",
      data: updatedAccount
    });
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
}

// Get specific account record (admin only)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid account ID" },
        { status: 400 }
      );
    }

    const account = await AccountList.findById(id);

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: account
    });
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 }
    );
  }
}

// Delete specific account record (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid account ID" },
        { status: 400 }
      );
    }

    const deletedAccount = await AccountList.findByIdAndDelete(id);

    if (!deletedAccount) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}