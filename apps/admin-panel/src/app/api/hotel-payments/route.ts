import { NextResponse, NextRequest } from "next/server";
import { parseQuery } from "backend-utils";
import prisma from "db";

export async function GET(req: NextRequest) {
  const query = Object.fromEntries(new URL(req.url).searchParams);
  const { hotelId } = parseQuery(query);

  const payments = await prisma.payment.findMany({
    where: {
      hotelId,
    },
    orderBy: { startDate: "desc" },
  });

  return new NextResponse(JSON.stringify({ data: payments }));
}
