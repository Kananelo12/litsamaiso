import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import User from '@/models/User';

export async function GET() {
  await connectDB();

  const users = await User.find();
  return NextResponse.json(users);
}
