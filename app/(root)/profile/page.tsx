import { getCurrentUser } from "@/utils/actions/auth.action";
import { redirect } from "next/navigation";
import ProfilePageClient from "@/components/ProfilePageClient";

const ProfilePage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <ProfilePageClient />;
};

export default ProfilePage;