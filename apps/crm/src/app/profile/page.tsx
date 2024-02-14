import ProfileContainer from "src/app/profile/ProfileContainer";
import prisma from "db";
import { cache } from "react";
import { getUserSession } from "../layout";

const getHotel = cache(prisma.hotel.findFirst);

export default async function Profile() {
  const session = await getUserSession();

  const data = await getHotel({
    where: { id: session!.user.hotelId! },
  });

  return <ProfileContainer dataHotel={data!} />;
}
