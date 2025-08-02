import { getCurrentUser } from "@/utils/actions/auth.action";
import { redirect } from "next/navigation";
import SRCDashboardClient from "@/components/SRCDashboardClient";
import ImportSheet from "@/components/ImportSheet";

const SRCDashboard = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "src") {
    if (user.role === "student") redirect("/updates");
    redirect("/sign-in");
  }

  return (
    <>
      <SRCDashboardClient userId={user.id} userName={user.name} />

      <ImportSheet />
    </>
  );
};

export default SRCDashboard;
