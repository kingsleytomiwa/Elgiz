import prisma from "db";
import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const [session, body] = await Promise.all([getServerSession(ownerAuthOptions), req.json()]);
    const text = body.text?.trim();
    const guestId = body.guestId;

    if (!text || !guestId) {
      return new NextResponse("", { status: 400 });
    }

    await prisma.message.create({
      data: {
        text,
        senderId: session?.user.id!,

        guestId,
        hotelId: session?.user.hotelId!,
      },
    });

    return new NextResponse("", { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse("", { status: 500 });
  }
}
