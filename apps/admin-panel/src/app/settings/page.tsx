import { findUser } from "db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import RootLayout from "../layout";
import SettingsContainer from "components/SettingsContainer";

export const metadata = {
  title: "Hotel details",
};

export default async function HotelDetails() {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  const user = await findUser({ email: session.user.email });
  return <SettingsContainer userId={user.id} />;
}
