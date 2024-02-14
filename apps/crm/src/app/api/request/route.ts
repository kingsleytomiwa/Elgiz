import { NextResponse, NextRequest } from "next/server";
import { parseQuery } from "backend-utils";
import prisma from "db";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { ownerAuthOptions } from "backend-utils";

export async function GET(req: NextRequest) {
  const query = Object.fromEntries(new URL(req.url).searchParams);
  const { id } = parseQuery(query);

  const user = await getServerSession(ownerAuthOptions);

  const where: Prisma.RequestWhereInput = {
    id,
    hotelId: user?.user?.hotelId!,
  };

  const request = await prisma.request.findFirst({
    where,
    include: {
      worker: { select: { name: true, color: true } },
      guest: { select: { name: true, room: true } },
      history: { include: { staff: { select: { name: true } } } },
    },
  });

  return new NextResponse(JSON.stringify({ data: request }));
}
