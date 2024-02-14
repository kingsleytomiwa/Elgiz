import prisma, { updateGuest } from "db";
import { NextRequest, NextResponse } from "next/server";
import { getGuestPayload } from "src/utils/middleware";

export async function POST(req: NextRequest) {
  try {
    const [guest, body] = await Promise.all([getGuestPayload(req), req.json()]);

    try {
      const updatedGuest = await updateGuest({ id: guest?.id, hotelId: guest?.hotelId }, { pushToken: body.token });
      return new NextResponse(JSON.stringify(updatedGuest));
    } catch (err) {
      console.error(err);
      return new NextResponse("", { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return new NextResponse("", { status: 500 });
  }
}
