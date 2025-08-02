import { getCurrentUser } from "@/utils/actions/auth.action";
import { redirect } from "next/navigation";
import UpdatesPageClient from "@/components/UpdatesPageClient";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "student") {
    if (user.role === "src") redirect("/src-dashboard");
    redirect("/sign-in");
  }
  return <UpdatesPageClient userId={user.id} userName={user.name} />;
};

export default Page;