import User from "@/models/User";
import { connectDB } from "@/utils/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "@/utils/jwt";

export async function POST(request: Request) {
  // Wait for connection to mongoDB
  await connectDB();

  // Extract studentId and password from the request body
  const { studentId, password } = await request.json();

  // Look up the user by studentId and populate the role
  const user = await User.findOne({ studentId }).populate('role');
  if (!user) {
    // If no user is found, return 401 Unauthorized
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Compare provided password with the stored hashed password
  const isValidPasswd = await bcrypt.compare(password, user.password);
  if (!isValidPasswd) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Create a JWT payload with the user's ID
  const token = signToken({ id: user._id });

  // Build a success response including user details and role name
  const response = NextResponse.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role?.name || null,
    },
  });

  // Set the JWT as an HttpOnly cookie so it's sent on subsequent requests
  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
