import { findMessages } from "db";
import { ownerAuthOptions } from "backend-utils";
import { parseQuery } from "backend-utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { guestId: string } }) {
  try {
    const session = await getServerSession(ownerAuthOptions);

    const query = Object.fromEntries(new URL(req.url).searchParams);
    const { skip, take } = parseQuery(query);

    return new NextResponse(
      JSON.stringify({
        ...(await findMessages({ ...params, hotelId: session?.user.hotelId! }, { skip, take })),
        skip,
        take,
      })
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("", { status: 403 });
  }
}
