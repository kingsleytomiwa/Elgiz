import prisma from "db";
import { NextRequest, NextResponse } from "next/server";
import { getGuestPayload } from "src/utils/middleware";

export async function GET(req: NextRequest) {
  try {
    const [guest, { ...body }] = await Promise.all([getGuestPayload(req), req]);
    const query = Object.fromEntries(new URL(req.url).searchParams);

    const positionId = query.positionId as string;
    const start = new Date(query.start as string);
    const end = new Date(query.end as string);

    try {
      return new NextResponse(
        JSON.stringify(
          await prisma.user.findMany({
            where: {
              hotelId: guest?.hotelId!,

              spaPositions: {
                some: {
                  id: positionId,
                },
              },

              requests: {
                none: {
                  reserveStart: {
                    gte: start,
                  },
                  reserveEnd: {
                    lte: end,
                  },
                },
              },
            },

            select: {
              id: true,
              name: true,
              image: true,
            },
          })
        )
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
