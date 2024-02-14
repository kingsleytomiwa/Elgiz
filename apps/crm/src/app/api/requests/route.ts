import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { ownerAuthOptions } from "backend-utils";
import { getRequests, getRequestsArgs } from ".";

export async function GET(req: NextRequest) {
  const query = Object.fromEntries(new URL(req.url).searchParams);
  const user = await getServerSession(ownerAuthOptions);
  const { where, take, page } = getRequestsArgs(query, user!);

  const [requests, total] = await getRequests(where, take, page);

  return new NextResponse(
    JSON.stringify({ data: requests, total, page: Math.ceil(total / take), take })
  );
}
