import { kv } from "@vercel/kv";
import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const settings = await kv.hgetall(`spaSettings:${session?.user.hotelId}`);
  return NextResponse.json(settings);
}
