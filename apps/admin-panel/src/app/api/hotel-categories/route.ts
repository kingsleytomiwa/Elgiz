import { NextResponse, NextRequest } from "next/server";
import { parseQuery } from "backend-utils";
import prisma from "db";

export async function GET(req: NextRequest) {
  const query = Object.fromEntries(new URL(req.url).searchParams);
  const { hotelId, startDate, endDate } = parseQuery(query);

  const isPeriodChosen = Boolean(startDate && endDate);

  const payments = await prisma.request.groupBy({
    by: "section",
    _count: { section: true },
    orderBy: {
      _count: {
        section: "desc",
      },
    },
    where: {
      hotelId,
      ...(isPeriodChosen && {
        createdAt: {
          lte: new Date(endDate),
          gte: new Date(startDate),
        },
      }),
    },
  });

  return new NextResponse(JSON.stringify({ data: payments }));
}
