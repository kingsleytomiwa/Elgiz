import prisma from "db";
import { NextRequest, NextResponse } from "next/server";
import { getGuestPayload } from "src/utils/middleware";

export async function POST(req: NextRequest) {
  try {
    const guest = await getGuestPayload(req);

    await prisma.message.updateMany({
      where: {
        guestId: guest.id,
        senderId: {
          not: guest.id,
        },
      },
      data: { wasRead: true },
    });

    return new NextResponse("", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("", { status: 403 });
  }
}
