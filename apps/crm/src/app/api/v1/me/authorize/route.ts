import { Hotel, User } from "@prisma/client";
import { JWT } from "backend-utils";
import { getGuestSession } from "db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = Object.fromEntries(new URL(req.url).searchParams);

  if (typeof query.code !== "string") {
    return new NextResponse("Bad code provided", { status: 400, statusText: "Bad request" });
  }

  const data = await getGuestSession({ code: query.code });

  if (!data) {
    return new NextResponse("", { status: 403, statusText: "Unauthorized" });
  }

  const [refreshToken, accessToken] = await Promise.all([
    JWT.sign({ id: data.id }, process.env.GUEST_REFRESH_TOKEN_SECRET!, "30d"),
    JWT.sign(data, process.env.GUEST_ACCESS_TOKEN_SECRET!, "3h"),
  ]);

  return new NextResponse(
    JSON.stringify({
      data,
      refreshToken,
      accessToken,
    })
  );
}
