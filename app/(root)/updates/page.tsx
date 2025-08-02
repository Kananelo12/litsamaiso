import { getCurrentUser } from "@/utils/actions/auth.action";
import { redirect } from "next/navigation";
import React from 'react'
import StudentPortalSidebar from "@/components/StudentPortalSidebar";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "student") {
    if (user.role === "src") redirect("/src-dashboard");
    // Add more role redirects as needed
    redirect("/sign-in");
  }
  return (
    <div className='flex min-h-screen'>
      <StudentPortalSidebar />
      <div className='flex w-full items-center justify-center text-2xl'>Updates</div>
    </div>
  )
}

export default Page;