import { getCurrentUser } from '@/utils/actions/auth.action'
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

const layout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return (
    <div>{children}</div>
  )
}

export default layout