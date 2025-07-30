import React from 'react'
import StudentPortalSidebar from "@/components/StudentPortalSidebar";

const page = () => {
  return (
    <div className='flex min-h-screen'>
      <StudentPortalSidebar />
      <div className='flex w-full items-center justify-center text-2xl border border-red-500'>Updates</div>
    </div>
  )
}

export default page