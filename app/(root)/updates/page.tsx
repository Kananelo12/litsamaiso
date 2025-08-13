import { getCurrentUser } from "@/utils/actions/auth.action";
import UpdatesPageClient from "@/components/UpdatesPageClient";

const Page = async () => {
  const user = await getCurrentUser();

  return <UpdatesPageClient userId={user?.id} userName={user?.name} />;
};

export default Page;
