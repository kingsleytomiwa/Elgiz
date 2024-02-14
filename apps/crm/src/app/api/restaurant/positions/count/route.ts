import { NextResponse, NextRequest } from "next/server";
import prisma from "db";
import { getServerSession } from "next-auth";
import { ownerAuthOptions } from "backend-utils";
import { parseQuery } from "backend-utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
	}
	
	const query = Object.fromEntries(new URL(req.url).searchParams);
	const { id } = parseQuery(query);

  const total = await prisma.foodPosition.count({
    where: {
      hotelId: session?.user.hotelId!,
      categoryId: id,
    },
  });

  return new NextResponse(JSON.stringify(total));
}
