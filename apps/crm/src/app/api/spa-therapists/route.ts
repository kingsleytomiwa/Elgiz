import prisma from "db";
import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { isValid } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await getServerSession(ownerAuthOptions);

  const query = Object.fromEntries(new URL(req.url).searchParams);

  const positionId = query.positionId as string;
  const start = new Date(query.start as string);
  const end = new Date(query.end as string);

  if (!isValid(start) || !isValid(end)) {
    return NextResponse.json({ data: [] });
  }

  const workers = await prisma.user.findMany({
    where: {
      hotelId: session?.user.hotelId!,

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
    },
  });

  return NextResponse.json({ data: workers });
}
