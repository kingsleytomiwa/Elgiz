import { NextRequest, NextResponse } from "next/server";
import { getGuestPayload } from "src/utils/middleware";
import { getAvailableTimeSlots } from "src/utils/spa";

export async function GET(req: NextRequest) {
  try {
    const guest = await getGuestPayload(req);
    const query = Object.fromEntries(new URL(req.url).searchParams);

    try {
      return new NextResponse(
        JSON.stringify(
          await getAvailableTimeSlots(
            guest?.hotelId!,
            new Date(query.date),
            query.positionId as string
          )
        )
      );
    } catch (err) {
      console.error(err);
      return new NextResponse("", { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return new NextResponse("", { status: 401 });
  }
}
