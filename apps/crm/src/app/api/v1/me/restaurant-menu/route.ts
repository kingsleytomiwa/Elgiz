import prisma from "db";
import { NextRequest, NextResponse } from "next/server";
import { getGuestPayload } from "src/utils/middleware";

export async function GET(req: NextRequest & { categoryId: string }) {
  try {
    const [guest] = await Promise.all([getGuestPayload(req), req]);
    const { categoryId } = Object.fromEntries(new URL(req.url).searchParams);

    try {
      const data = await prisma.foodPosition.findMany({
        where: {
          hotelId: guest.hotelId,
          categoryId,
        },
        include: { category: true },
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
