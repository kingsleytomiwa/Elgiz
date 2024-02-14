import { parseQuery } from "backend-utils";
import { findMessages } from "db";
import { NextRequest, NextResponse } from "next/server";
import { getGuestPayload } from "src/utils/middleware";

export async function GET(req: NextRequest) {
  try {
    const guest = await getGuestPayload(req);
    // const query = Object.fromEntries(new URL(req.url).searchParams);

    return new NextResponse(
      JSON.stringify({
        ...(await findMessages(
          {
            guestId: guest.id,
            hotelId: guest.hotel.id,
          },
        ))
      })
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("", { status: 403 });
  }
}
