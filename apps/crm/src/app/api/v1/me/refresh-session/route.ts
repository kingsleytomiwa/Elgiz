import { JWT } from "backend-utils";
import { getGuestSession } from "db";
import { NextRequest, NextResponse } from "next/server";
import { getGuestPayload } from "src/utils/middleware";

export async function GET(req: NextRequest) {
  try {
    const payload = await getGuestPayload(req, process.env.GUEST_REFRESH_TOKEN_SECRET!);
		
    const data = await getGuestSession({ id: payload.id });

    return new NextResponse(
      JSON.stringify({
        accessToken: await JWT.sign(data, process.env.GUEST_ACCESS_TOKEN_SECRET!),
      })
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("", { status: 403 });
  }
}
