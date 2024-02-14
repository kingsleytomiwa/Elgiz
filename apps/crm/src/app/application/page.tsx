import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MobileAppContainer from "components/MobileAppContainer";

export default async function MobileApp() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return <MobileAppContainer />;
}
