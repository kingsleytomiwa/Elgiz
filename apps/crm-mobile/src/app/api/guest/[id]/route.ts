import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { ownerAuthOptions } from "backend-utils";
import prisma from "db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(ownerAuthOptions);

  return NextResponse.json(
    await prisma.guest.findFirst({
      where: {
        ...params,
        hotelId: session?.user.hotelId as string,
      },

      select: {
        id: true,
        name: true,
        room: true,
      },
    })
  );
}
