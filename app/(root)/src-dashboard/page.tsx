import { getCurrentUser } from "@/utils/actions/auth.action";
import { redirect } from "next/navigation";
import React from "react";

const SRCDashboard = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "src") {
    if (user.role === "student") redirect("/updates");
    // Add more role redirects as needed
    redirect("/sign-in");
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">SRC Dashboard</h1>
        <p>Welcome, SRC member! This is your dedicated dashboard.</p>
      </div>
    </div>
  );
};

export default SRCDashboard;