import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  const user = await User.create({
    name: "Kananelo",
    email: "kananelo@example.com",
    studentId: "2230541",
    password: "123456",
  });
  return NextResponse.json(user);
}
