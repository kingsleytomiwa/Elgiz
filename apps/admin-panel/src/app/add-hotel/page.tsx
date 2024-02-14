import AddHotelForm from "components/AddHotelForm";
import { Drawer } from "ui";
import { getHotel } from "db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import RootLayout from "../layout";
import { Hotel } from "@prisma/client";
import { menuLinks } from "src/constants";

export const metadata = {
  title: "Add | Edit Hotel",
};

export default async function AddHotel({ searchParams }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  const hotel = (searchParams?.id && (await getHotel(searchParams.id))) as Hotel;

  return <AddHotelForm hotel={hotel} />;
}
