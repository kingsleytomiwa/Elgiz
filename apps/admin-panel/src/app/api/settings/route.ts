import { kv } from "@vercel/kv";
import { parseQuery } from "backend-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = Object.fromEntries(new URL(req.url).searchParams);
  const { userId } = parseQuery(query);

  const settings = await kv.hgetall(`settings:${userId}`);
  return NextResponse.json(settings);
}
