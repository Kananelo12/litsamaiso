import Header from "@/components/Header";
import { getCurrentUser } from "@/utils/actions/auth.action";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const layout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  // Allow access to admin dashboard for admin users
  const isAdminRoute = children?.props?.pathname === "/admin-dashboard";
  if (isAdminRoute && user.role !== "admin") {
    if (user.role === "student") redirect("/updates");
    if (user.role === "src") redirect("/src-dashboard");
    redirect("/sign-in");
  }

  return (
    <div>
      <Header username={user.name} />
      {children}
    </div>
  );
};

export default layout;
