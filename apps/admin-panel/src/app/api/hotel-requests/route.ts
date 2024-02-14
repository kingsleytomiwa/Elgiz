import { NextResponse, NextRequest } from "next/server";
import { parseQuery } from "backend-utils";
import prisma from "db";
import { Category } from "@prisma/client";

export async function GET(req: NextRequest) {
  const query = Object.fromEntries(new URL(req.url).searchParams);
  const { hotelId, startDate, endDate, category } = parseQuery(query);

  const isPeriodChosen = startDate && endDate;

  const requests = await prisma.request.groupBy({
    by: "type",
    _count: { type: true },
    orderBy: {
      _count: {
        type: "desc",
      },
    },
    where: {
      section: category as Category,
      hotelId,
      ...(isPeriodChosen && {
        createdAt: {
          lte: new Date(endDate),
          gte: new Date(startDate),
        },
      }),
    },
  });

  return new NextResponse(JSON.stringify({ data: requests }));
}
