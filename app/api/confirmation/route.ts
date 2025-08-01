import { connectDB } from "@/utils/mongodb";
import { NextResponse } from "next/server";
// import Confirmation from "@/models/Confirmation";
import Verification from "@/models/Verification";

export async function POST(request: Request) {
  await connectDB();

  try {
    const { studentId, bankName, accountNumber } = await request.json();

    if (!studentId || !bankName || !accountNumber) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Find the verification record for this student
    const record = await Verification.findOne({ studentId });

    if (!record) {
      return NextResponse.json(
        { error: "Student verification record not found." },
        { status: 404 }
      );
    }

    const isMatch =
      record.bankName === bankName.trim() &&
      record.accountNumber === accountNumber.trim();

    if (!isMatch) {
      return NextResponse.json(
        { error: "Provided data does not match verification records." },
        { status: 403 }
      );
    }

    record.status = "correct";
    await record.save();

    return NextResponse.json({
      success: true,
      message: "Account confirmed successfully!",
      status: "correct",
    });
  } catch (error) {
    console.error("Confirmation POST error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
