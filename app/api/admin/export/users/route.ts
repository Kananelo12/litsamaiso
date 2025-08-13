import { connectDB } from "@/utils/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/actions/auth.action";
import * as XLSX from "xlsx";

// Export users to Excel (admin only)
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
    const format = searchParams.get("format") || "xlsx";

    const users = await User.find({})
      .populate("role", "name")
      .select("-password")
      .sort({ createdAt: -1 });

    // Prepare data for export
    const exportData = users.map(user => ({
      "Name": user.name || "",
      "Email": user.email || "",
      "Student ID": user.studentId || "",
      "Role": user.role?.name || "",
      "Student Card URL": user.studentCardUrl || "",
      "Created At": user.createdAt?.toISOString() || "",
      "Updated At": user.updatedAt?.toISOString() || ""
    }));

    if (format === "json") {
      return NextResponse.json({
        data: exportData,
        total: exportData.length,
        exportedAt: new Date().toISOString()
      });
    }

    // Create Excel workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Users");

    // Generate buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    const filename = `users_export_${new Date().toISOString().split('T')[0]}.xlsx`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting users:", error);
    return NextResponse.json(
      { error: "Failed to export users" },
      { status: 500 }
    );
  }
}