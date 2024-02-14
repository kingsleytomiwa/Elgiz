import prisma from "db";
import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(ownerAuthOptions);

    return NextResponse.json(
      await prisma.message.findFirst({
        where: {
          hotelId: session?.user.hotelId!,
          wasRead: false,
          senderId: {
            not: session?.user.id!,
          },
        },
      })
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("", { status: 403 });
  }
}
