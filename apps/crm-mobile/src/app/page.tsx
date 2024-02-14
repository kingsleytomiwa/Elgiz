import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "db";
import { ownerAuthOptions } from "backend-utils";
import RequestsContainer from "../../components/RequestsContainer";
import { RequestStatus } from "@prisma/client";

export default async function Home() {
  const session = await getServerSession(ownerAuthOptions);

  if (!session) {
    redirect("/login");
  }

  const data = await prisma.$transaction([
    prisma.request.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
      include: {
        guest: { select: { name: true, room: true } },
      },
      where: { hotelId: session.user.hotelId!, status: RequestStatus.ACCEPTED },
    }),
    prisma.request.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
      include: {
        guest: { select: { name: true, room: true } },
      },
      where: { hotelId: session.user.hotelId!, status: RequestStatus.CREATED },
    }),
  ]);

  return (
    <RequestsContainer acceptedData={data[0]} createdData={data[1]} name={session.user.name!} />
  );
}
