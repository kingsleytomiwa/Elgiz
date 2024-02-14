import { Prisma } from "@prisma/client";
import { parseQuery, ownerAuthOptions } from "backend-utils";
import prisma, { findHotelMessageThreads } from "db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(ownerAuthOptions);

    const query = Object.fromEntries(new URL(req.url).searchParams);
    const { skip, take, search } = parseQuery(query);

    const where = {
      hotelId: session?.user.hotelId!,

      ...(search
        ? {
            guest: {
              name: {
                contains: search as string,
                mode: "insensitive",
              },
            },
          }
        : {}),
    } as Prisma.MessageWhereInput;

    const { data, total } = await findHotelMessageThreads(where, { skip, take });

    return new NextResponse(
      JSON.stringify({
        data,
        total: Number((total as any)[0].count),
        skip,
        take,
      })
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("", { status: 403 });
  }
}
