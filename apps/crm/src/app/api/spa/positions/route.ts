import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { ownerAuthOptions } from "backend-utils";
import prisma from "db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const spaPositions = await prisma.spaPosition.findMany({
    where: {
      hotelId: session?.user.hotelId!,
    },
    include: {
      staff: true,
    },
  });

  return new NextResponse(JSON.stringify(spaPositions));
}
