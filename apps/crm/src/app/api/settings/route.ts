import { kv } from "@vercel/kv";
import { ownerAuthOptions } from "backend-utils";
import { findHotel } from "db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// we can use settings in prisma hotel instead
export async function GET(req: NextRequest) {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const settings = (await findHotel({ id: session.user.hotelId! }))?.settings;
  return NextResponse.json(settings);
}
