import { Guest } from "@prisma/client";
import { JWT } from "backend-utils";
import prisma from "db";
import { NextRequest, NextResponse } from "next/server";
import { getGuestPayload } from "src/utils/middleware";

export async function GET(req: NextRequest) {
	try {
    const [guest, { ...body }] = await Promise.all([getGuestPayload(req), req]);

    try {
      const shopPositions = await prisma.shopPosition.findMany({
        where: {
          hotelId: guest?.hotelId,
        },
        include: { category: true },
      });

      return new NextResponse(
        JSON.stringify({
          data: shopPositions,
        })
      );
    } catch (err) {
      console.error(err);
      return new NextResponse("", { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return new NextResponse("", { status: 401 });
  }
}
