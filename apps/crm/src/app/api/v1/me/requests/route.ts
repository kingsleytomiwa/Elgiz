import { Category, Guest, RequestStatus } from "@prisma/client";
import { JWT } from "backend-utils";
import prisma from "db";
import { NextRequest, NextResponse } from "next/server";
import { getGuestPayload } from "src/utils/middleware";
import { v4 } from "uuid";

export async function GET(req: NextRequest) {
  try {
    const [guest, { ...body }] = await Promise.all([getGuestPayload(req), req]);

    try {
      const [requests, count] = await prisma.$transaction([
        prisma.request.findMany({
          include: {
            worker: { select: { name: true, color: true } },
            guest: { select: { name: true, room: true } },
            history: { include: { staff: { select: { name: true } } } },
          },
          where: {
            guestId: guest?.id,
            hotelId: guest?.hotelId,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.request.count({
          where: {
            guestId: guest?.id,
            hotelId: guest?.hotelId,
          },
        }),
      ]);

      return new NextResponse(
        JSON.stringify({
          data: requests,
          count,
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
