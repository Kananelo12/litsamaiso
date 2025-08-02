import { connectDB } from "@/utils/mongodb";
import Announcement from "@/models/Announcement";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

// Add a reply to a comment in an announcement
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const { commentId, userId, text } = await req.json();
    if (
      !Types.ObjectId.isValid(id) ||
      !Types.ObjectId.isValid(commentId) ||
      !Types.ObjectId.isValid(userId) ||
      !text
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }
    const comment = announcement.comments.id(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    comment.replies.push({ user: userId, text, date: new Date() });
    await announcement.save();

    // Populate user data before returning
    const populatedAnnouncement = await Announcement.findById(id)
      .populate("postedBy", "name email")
      .populate("comments.user", "name email")
      .populate("comments.replies.user", "name email");

    return NextResponse.json({
      message: "Reply added",
      data: populatedAnnouncement,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
