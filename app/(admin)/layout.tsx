import Header from "@/components/Header";
import { getCurrentUser } from "@/utils/actions/auth.action";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const layout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "admin") {
    redirect("/updates");
  }

  return (
    <div>
      <Header username={user.name} />
      {children}
    </div>
  );
};

export default layout;
