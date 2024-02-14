import { NextRequest, NextResponse } from "next/server";
import prisma from "db";
import { getGuestPayload } from "src/utils/middleware";

export async function POST(req: NextRequest) {
  try {
    const [guest, { ...body }] = await Promise.all([getGuestPayload(req), req.json()]);

    try {
      const request = await prisma.review.create({
        data: {
          ...body,
          guest: { connect: { id: guest.id } },
          hotel: { connect: { id: guest.hotelId } },
        },
      });
      return new NextResponse(JSON.stringify(request));
    } catch (err) {
      console.error(err);
      return new NextResponse("", { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return new NextResponse("", { status: 401 });
  }
  // checking current guest & getting request data
}
