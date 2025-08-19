/* eslint-disable @typescript-eslint/no-explicit-any */

import { connectDB } from "@/utils/mongodb";
import AccountList from "@/models/AccountList";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/actions/auth.action";
import * as XLSX from "xlsx";

// Export accounts to Excel (admin only)
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
    const status = searchParams.get("status");
    const format = searchParams.get("format") || "xlsx";

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const accounts = await AccountList.find(query).sort({ createdAt: -1 });

    // Prepare data for export
    const exportData = accounts.map(account => ({
      "Full Names": account.fullnames || "",
      "Contract Number": account.contractNumber || "",
      "Course of Study": account.courseOfStudy || "",
      "Bank Name": account.bankName || "",
      "Account Number": account.accountNumber || "",
      "Student ID": account.studentId || "",
      "Status": account.status || "",
      "Confirmation Date": account.confirmationDate || "",
      "Signature": account.signature || "",
      "Created At": account.createdAt?.toISOString() || "",
      "Updated At": account.updatedAt?.toISOString() || ""
    }));

    if (format === "json") {
      return NextResponse.json({
        data: exportData,
        total: exportData.length,
        status: status || "all",
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

    XLSX.utils.book_append_sheet(wb, ws, "Accounts");

    // Generate buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    const statusSuffix = status ? `_${status}` : "_all";
    const filename = `accounts_export${statusSuffix}_${new Date().toISOString().split('T')[0]}.xlsx`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting accounts:", error);
    return NextResponse.json(
      { error: "Failed to export accounts" },
      { status: 500 }
    );
  }
}