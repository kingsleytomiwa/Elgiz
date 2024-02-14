import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { ownerAuthOptions } from "backend-utils";
import prisma from "db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(ownerAuthOptions);

  return new NextResponse(
    JSON.stringify(
      await prisma.guest.findFirst({
        where: {
          ...params,
          hotelId: session?.user.hotelId as string,
        },
      })
    )
  );
}
