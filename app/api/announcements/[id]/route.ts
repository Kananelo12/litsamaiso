import { connectDB } from "@/utils/mongodb";
import Announcement from "@/models/Announcement";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { getCurrentUser } from "@/utils/actions/auth.action";

// Edit the announcement
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    // Check if user owns the announcement or is admin
    if (announcement.postedBy.toString() !== currentUser.id && currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const updates = await req.json();
    const updated = await Announcement.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("postedBy", "name email")
      .populate("comments.user", "name email")
      .populate("comments.replies.user", "name email");

    return NextResponse.json(
      { message: "Updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Get one desired announcement using its Id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const announcement = await Announcement.findById(id)
      .populate("postedBy", "name email")
      .populate("comments.user", "name email")
      .populate("comments.replies.user", "name email");

    if (!announcement) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: announcement });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Delete the announcement by Id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Check if user owns the announcement or is admin
    if (announcement.postedBy.toString() !== currentUser.id && currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    await Announcement.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Like/Unlike an announcement
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { userId, like } = await req.json();

    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid ID(s)" }, { status: 400 });
    }

    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.id !== userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const update = like
      ? { $addToSet: { likes: userId } }
      : { $pull: { likes: userId } };

    const updated = await Announcement.findByIdAndUpdate(id, update, {
      new: true,
    }).populate("postedBy", "name email")
      .populate("comments.user", "name email")
      .populate("comments.replies.user", "name email");

    if (!updated) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: like ? "Liked" : "Unliked",
      data: updated,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Add a comment to an announcement
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { userId, text } = await req.json();

    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId) || !text) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.id !== userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const comment = { user: userId, text, date: new Date(), replies: [] };
    const updated = await Announcement.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    ).populate("postedBy", "name email")
      .populate("comments.user", "name email")
      .populate("comments.replies.user", "name email");

    if (!updated) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Comment added", data: updated });
  } catch (error) {
    console.log("Error in announcements dynamic route: ", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}