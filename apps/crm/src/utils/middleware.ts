import { kv } from "@vercel/kv";
import { JWT } from "backend-utils";
import { GuestSession } from "db";
import { NextRequest } from "next/server";

export async function getGuestPayload(
  req: NextRequest,
  secret = process.env.GUEST_ACCESS_TOKEN_SECRET!
) {
  const payload = (await JWT.decode(
    req.headers.get("authorization")?.replace("Bearer ", "")!,
    secret
  )) as GuestSession;

  if (!payload) {
    throw new Error("Unauthorized");
  }

  const data = (await kv.get(`guest:${payload.id}`)) as { suspended: boolean };

  if (data?.suspended) {
    throw new Error("User suspended");
  }

  return payload;
}
