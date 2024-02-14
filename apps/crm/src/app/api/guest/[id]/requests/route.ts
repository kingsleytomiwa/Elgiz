import { NextResponse, NextRequest } from "next/server";
import { parseQuery } from "backend-utils";
import { findGuestRequests } from "db";
import { getServerSession } from "next-auth";
import { ownerAuthOptions } from "backend-utils";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(ownerAuthOptions);

  const query = Object.fromEntries(new URL(req.url).searchParams);
  const { skip, take } = parseQuery(query);

  const { data, total } = await findGuestRequests(
    {
      hotelId: session?.user.hotelId as string,
      ...params,
    },
    { skip, take }
  );

  return new NextResponse(JSON.stringify({ data, total, lastPage: Math.ceil(total / take), take }));
}
