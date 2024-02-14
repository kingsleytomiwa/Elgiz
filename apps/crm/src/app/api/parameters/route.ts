import { NextResponse, NextRequest } from "next/server";
import prisma from "db";
import { Parameter, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { ownerAuthOptions, parseQuery } from "backend-utils";

export async function GET(req: NextRequest) {
  const query = Object.fromEntries(new URL(req.url).searchParams);
  const { type } = parseQuery(query);

  const user = await getServerSession(ownerAuthOptions);

  const where: Prisma.ParameterWhereInput = {
    hotelId: user?.user.hotelId!,
    ...(type && { type: type as Parameter["type"] }),
  };

  const parameters = await prisma.parameter.findMany({
    where,
  });

  return new NextResponse(JSON.stringify(parameters));
}
