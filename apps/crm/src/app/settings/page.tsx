import { redirect } from "next/navigation";
import SettingsContainer from "components/SettingsContainer";
import { getHotelSettings, getUserSession } from "../layout";

export const metadata = {
  title: "Hotel details"
};

export default async function Settings() {
  const session = await getUserSession();

  if (!session) {
    redirect('/');
  }

  return (
    <SettingsContainer settings={await getHotelSettings(session.user?.hotelId!)} />
  );
};
