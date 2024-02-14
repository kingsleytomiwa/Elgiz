import { NextResponse, NextRequest } from "next/server";
import { parseQuery } from "backend-utils";
import prisma from "db";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { ownerAuthOptions } from "backend-utils";

export async function GET(req: NextRequest) {
  const query = Object.fromEntries(new URL(req.url).searchParams);
  const { startDate, endDate, take, page, search } = parseQuery(query);

  const user = await getServerSession(ownerAuthOptions);

  const isPeriodChosen = startDate && endDate;

  const where: Prisma.ReviewWhereInput = {
    hotelId: user?.user.hotelId!,

    ...(isPeriodChosen && {
      createdAt: {
        lte: new Date(endDate),
        gte: new Date(startDate),
      },
    }),
    guest: {
      name: {
        contains: search as string | undefined,
        mode: "insensitive",
      },
    },
  };

  const [reviews, total] = await prisma.$transaction([
    prisma.review.findMany({
      include: {
        guest: { select: { name: true, room: true } },
      },
      where,
      take: take,
      skip: page * take,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.review.count({
      where,
    }),
  ]);

  return new NextResponse(
    JSON.stringify({ data: reviews, total, page: Math.ceil(total / take), take })
  );
}
