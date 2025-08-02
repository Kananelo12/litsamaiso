import { connectDB } from "@/utils/mongodb";
import { NextResponse } from "next/server";
import AccountList from "@/models/AccountList";
import { getCurrentUser } from "@/utils/actions/auth.action";
import { makeSignature } from "@/lib/utils";

export async function POST(request: Request) {
  // Establish a database connection
  await connectDB();

  try {
    // Extracting payload from the request body
    const { contractNumber, studentId, bankName, accountNumber } =
      await request.json();

    if (!contractNumber || !studentId || !bankName || !accountNumber) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // // Fetch the record for the provided contract number
    const record = await AccountList.findOne({ contractNumber });

    if (!record) {
      return NextResponse.json(
        { error: "Provided record was not found." },
        { status: 404 }
      );
    }

    // Prevent duplicate confirmations
    if (record.status === "confirmed") {
      return NextResponse.json(
        { error: "This account has already been confirmed." },
        { status: 409 }
      );
    }

    // Validate the user's provided bank details against the record
    const isMatch =
      record.bankName === bankName.trim() &&
      record.accountNumber === accountNumber.trim();

    if (!isMatch) {
      return NextResponse.json(
        { error: "Provided data does not match verification records." },
        { status: 403 }
      );
    }

    // Retrieve the currently logged-in user from session
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("User not found in session!");
    }

    // Update the record with confirmation details
    record.confirmationDate = new Date();
    record.studentId = studentId;
    record.signature = makeSignature(user.name);
    record.status = "confirmed";
    await record.save();

    return NextResponse.json(
      {
        success: true,
        message: "Account confirmed successfully!",
        status: "correct",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Confirmation POST error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
