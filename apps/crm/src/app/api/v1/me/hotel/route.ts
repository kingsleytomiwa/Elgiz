import prisma, { getHotel } from "db";
import { NextRequest, NextResponse } from "next/server";
import { getGuestPayload } from "src/utils/middleware";

export async function GET(req: NextRequest) {
  try {
    const [guest, { ...body }] = await Promise.all([getGuestPayload(req), req]);

    try {
      const data = await getHotel(guest.hotelId);

      if (!data) {
        return new NextResponse("", { status: 403, statusText: "Unauthorized" });
      }

      return new NextResponse(JSON.stringify(data));
    } catch (err) {
      console.error(err);
      return new NextResponse("", { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return new NextResponse("", { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const [guest, body] = await Promise.all([getGuestPayload(req), req.json()]);

    try {
      const updatedHotel = await prisma.hotel.update({
        where: {
          id: guest.hotelId,
        },
        data: body
      });

      return new NextResponse(JSON.stringify(updatedHotel));
    } catch (err) {
      console.error(err);
      return new NextResponse("", { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return new NextResponse("", { status: 500 });
  }
}
