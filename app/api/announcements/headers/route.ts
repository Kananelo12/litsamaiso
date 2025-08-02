import { connectDB } from "@/utils/mongodb";
import Announcement from "@/models/Announcement";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const headers = await Announcement.distinct("header");
    return NextResponse.json({ data: headers }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to retrieve headers" },
      { status: 500 }
    );
  }
}
