import { connectDB } from "@/utils/mongodb";
import Announcement from "@/models/Announcement";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// Create a new announcement resource from either SRC/admin memeber(s)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, content, date, postedBy, header } = body;

    if (!title || !content || !postedBy || !header) {
      return NextResponse.json(
        { error: "Title, content, header, and postedBy are required." },
        { status: 400 }
      );
    }

    const newAnnouncement = await Announcement.create({
      title,
      content,
      header,
      date: date ? new Date(date) : undefined,
      postedBy,
    });

    return NextResponse.json(
      { message: "Announcement created successfully", data: newAnnouncement },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}

//get all announcements
export async function GET() {
  try {
    await connectDB();

    const announcements = await Announcement.find()
      .populate("postedBy", "name email") //get announcement owner name and email using thier Ids
      .populate("comments.user", "name email") //populate comment user data
      .populate("comments.replies.user", "name email") //populate reply user data
      .sort({ date: -1 }); // sort announcements starting with the latest

    return NextResponse.json({ data: announcements }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching announcements:", error.stack || error);
    return NextResponse.json(
      { error: "Failed to retrieve announcements" },
      { status: 500 }
    );
  }
}

// Get all unique headers
export async function GET_HEADERS() {
  try {
    await connectDB();
    const headers = await Announcement.distinct("header");
    return NextResponse.json({ data: headers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching headers:", error);
    return NextResponse.json(
      { error: "Failed to retrieve headers" },
      { status: 500 }
    );
  }
}
