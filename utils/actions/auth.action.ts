import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";
import User from "@/models/User";
import { connectDB } from "../mongodb";

/**
 * Retrieves the current authenticated user based on the JWT stored in cookies.
 * Returns null if no valid token is found or the user does not exist.
 */
export async function getCurrentUser(): Promise<null | {
  id: string;
  name: string;
  email: string;
  role?: string | null;
}> {
  // cookies() may return a Promise in your environment, so ensure we await it
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const { id } = verifyToken(token);
    await connectDB();
    const user = await User.findById(id).populate('role');
    if (!user) return null;
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role?.name || null,
    };
  } catch (err) {
    console.error("Error in getCurrentUser:", err);
    return null;
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
