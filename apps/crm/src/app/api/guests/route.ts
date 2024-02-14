import { NextResponse, NextRequest } from "next/server";
import { parseQuery } from "backend-utils";
import { findGuests } from "db";
import { getServerSession } from "next-auth";
import { ownerAuthOptions } from "backend-utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(ownerAuthOptions);

  const query = Object.fromEntries(new URL(req.url).searchParams);
  const { search, skip, take, startDate, endDate, suspended = "false" } = parseQuery(query);

  const { data, total } = await findGuests(
    {
      name: {
        contains: search as string,
        mode: "insensitive",
      },

      hotelId: session?.user.hotelId as string,

      suspended: suspended === "false" ? false : true,

      ...(typeof startDate === "string"
        ? {
            startDate: {
              gte: new Date(startDate),
            },
          }
        : {}),

      ...(typeof endDate === "string"
        ? {
            endDate: {
              lte: new Date(endDate),
            },
          }
        : {
            endDate: {
              gte: new Date(),
            },
          }),
    },
    { skip, take }
  );

  return new NextResponse(JSON.stringify({ data, total, lastPage: Math.ceil(total / take), take }));
}
