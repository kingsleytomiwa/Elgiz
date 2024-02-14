import prisma from "db";
import { NextRequest, NextResponse } from "next/server";
import { getGuestPayload } from "src/utils/middleware";

export async function POST(req: NextRequest) {
  try {
    const [guest, body] = await Promise.all([getGuestPayload(req), req.json()]);
    const text = body.text?.trim();

    if (!text) {
      return new NextResponse("", { status: 400 });
    }

    await prisma.message.create({
      data: {
        text,
        senderId: guest.id,

        guestId: guest.id,
        hotelId: guest.hotel.id,
      },
    });

    return new NextResponse("", { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse("", { status: 500 });
  }
}
