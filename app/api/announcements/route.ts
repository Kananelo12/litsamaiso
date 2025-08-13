/* eslint-disable @typescript-eslint/no-explicit-any */

import { connectDB } from "@/utils/mongodb";
import Announcement from "@/models/Announcement";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/actions/auth.action";

// Create a new announcement resource from either SRC/admin member(s)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Check if user is authenticated and has proper role
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (currentUser.role !== "src" && currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Insufficient permissions. Only SRC members and admins can create announcements." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, content, date, postedBy, header } = body;

    if (!title || !content || !postedBy || !header) {
      return NextResponse.json(
        { error: "Title, content, header, and postedBy are required." },
        { status: 400 }
      );
    }

    // Verify the postedBy user exists
    const user = await User.findById(postedBy);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid user ID in postedBy field" },
        { status: 400 }
      );
    }

    const newAnnouncement = await Announcement.create({
      title,
      content,
      header,
      date: date ? new Date(date) : new Date(),
      postedBy,
    });

    // Populate the response
    const populatedAnnouncement = await Announcement.findById(newAnnouncement._id)
      .populate("postedBy", "name email")
      .populate("comments.user", "name email")
      .populate("comments.replies.user", "name email");

    return NextResponse.json(
      { message: "Announcement created successfully", data: populatedAnnouncement },
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

// Get all announcements
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const header = searchParams.get("header");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    let query = {};
    if (header) {
      query = { header };
    }

    const announcements = await Announcement.find(query)
      .populate("postedBy", "name email")
      .populate("comments.user", "name email")
      .populate("comments.replies.user", "name email")
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Announcement.countDocuments(query);

    return NextResponse.json({ 
      data: announcements,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching announcements:", error.stack || error);
    return NextResponse.json(
      { error: "Failed to retrieve announcements" },
      { status: 500 }
    );
  }
}