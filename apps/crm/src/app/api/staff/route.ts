import { NextResponse, NextRequest } from "next/server";
import { parseQuery } from "backend-utils";
import prisma from "db";
import { Category, Position, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { ownerAuthOptions } from "backend-utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(ownerAuthOptions);

  const query = Object.fromEntries(new URL(req.url).searchParams);
  const { search, sections, positions, page, take } = parseQuery(query);

	const newSections = sections?.split(",");
	const newPositions = positions?.split(",");

	const where: Prisma.UserWhereInput = {
		hotelId: session?.user.hotelId,
		name: {
			contains: search as string | undefined,
			mode: "insensitive",
		},
		...(newSections?.length > 0 && {
			sections: {
				hasSome: newSections as Category[],
			},
		}),
		...(newPositions?.length > 0 && {
			position: {
				in: newPositions as Position[],
			},
		}),
	};
	
	const [staff, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      take,
      skip: page * take,
      orderBy: { position: "desc" },
		}),
		
    prisma.user.count({
      where,
    }),
  ]);

	return new NextResponse(
    JSON.stringify({ data: staff, total, page: Math.ceil(total / take), take })
  );
}
