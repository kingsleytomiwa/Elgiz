import prisma from "db";
import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const [session, body] = await Promise.all([getServerSession(ownerAuthOptions), req.json()]);

    const guestId = body.guestId;

    if (!guestId) {
      return new NextResponse("", { status: 400 });
    }

    await prisma.message.updateMany({
      where: {
        guestId,
        hotelId: session?.user.hotelId!,
        senderId: guestId,
      },
      data: { wasRead: true },
    });

    return new NextResponse("", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("", { status: 403 });
  }
}
