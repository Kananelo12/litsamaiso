import { connectDB } from "@/utils/mongodb";
import AccountList from "@/models/AccountList";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/actions/auth.action";

// Get all account records (admin only)
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
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";

    let query: any = {};
    
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullnames: { $regex: search, $options: "i" } },
        { contractNumber: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { bankName: { $regex: search, $options: "i" } }
      ];
    }

    const accounts = await AccountList.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await AccountList.countDocuments(query);

    // Get status counts for dashboard
    const statusCounts = await AccountList.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    return NextResponse.json({
      data: accounts,
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total
      }
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

// Update account status (admin only)
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

    const { accountId, status } = await req.json();

    if (!accountId || !status) {
      return NextResponse.json(
        { error: "Account ID and status are required" },
        { status: 400 }
      );
    }

    if (!["pending", "confirmed", "erroneous"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedAccount = await AccountList.findByIdAndUpdate(
      accountId,
      { status },
      { new: true }
    );

    if (!updatedAccount) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Account status updated successfully",
      data: updatedAccount
    });
  } catch (error) {
    console.error("Error updating account status:", error);
    return NextResponse.json(
      { error: "Failed to update account status" },
      { status: 500 }
    );
  }
}