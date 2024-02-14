import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HomeContainer from "components/HomeContainer";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return <HomeContainer />;
}
