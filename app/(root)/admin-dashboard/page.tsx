import { getCurrentUser } from "@/utils/actions/auth.action";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/AdminDashboardClient";

const AdminDashboard = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "admin") {
    if (user.role === "student") redirect("/updates");
    if (user.role === "src") redirect("/src-dashboard");
    redirect("/sign-in");
  }

  return <AdminDashboardClient userId={user.id} userName={user.name} />;
};

export default AdminDashboard;