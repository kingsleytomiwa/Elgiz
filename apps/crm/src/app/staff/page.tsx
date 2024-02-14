import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { findHotel } from "db";
import Table from "./Table";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  const hotel = await findHotel({ email: session.user.email });

  return (
    <Table hotel={hotel} />
  );
}
