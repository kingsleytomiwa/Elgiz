import prisma, { getGuestSession, getHotel } from "db";
import { NextRequest, NextResponse } from "next/server";
import { getGuestPayload } from "src/utils/middleware";

export async function GET(req: NextRequest & {categories: string[]}) {
  try {
    const [guest, { categories, ...body }] = await Promise.all([getGuestPayload(req), req]);

    try {
      const data = await prisma.foodCategory.findMany({
        where: {
					hotelId: guest.hotelId,
        },
      });

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
