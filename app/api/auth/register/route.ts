import { connectDB } from "@/utils/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "@/utils/jwt";
import Role from "@/models/Role";

export async function POST(request: Request) {
  // Wait for connection to mongoDB
  await connectDB();

  // Parse incoming JSON payload
  const { name, email, studentId, password, studentCardUrl } = await request.json();

  // Check if a user with the same email or studentId already exists
  const userExists = await User.findOne({ $or: [{ email }, { studentId }] });
  if (userExists) {
    // If user exists, return HTTP 409 Conflict
    return NextResponse.json({ error: "User aleady exists" }, { status: 409 });
  }

  // Lookup the “student” role (must be pre-seeded)
  const studentRole = await Role.findOne({ name: "student" });
  if (!studentRole) {
    return NextResponse.json(
      { error: "Student role not found. Please seed roles first" },
      { status: 500 }
    );
  }

  // Hash the plaintext password before storing
  const hash = await bcrypt.hash(password, 10);
  // Create and save new user document in MongoDB
  const user = await User.create({ name, email, studentId, password: hash, studentCardUrl, role: studentRole._id });

  // Generate a JWT containing the new user's ID
  const token = signToken({ id: user._id });

  // Build a JSON response with the created user
  const response = NextResponse.json({
    user: { id: user._id, name: user.name, email: user.email, role: studentRole.name },
  });

  // Set the JWT as an HttpOnly cookie on the response
  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}