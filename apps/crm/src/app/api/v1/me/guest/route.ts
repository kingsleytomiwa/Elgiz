import { Hotel, User } from "@prisma/client";
import { JWT } from "backend-utils";
import prisma, { getGuestSession } from "db";
import { NextRequest, NextResponse } from "next/server";
import { getGuestPayload } from "src/utils/middleware";

export async function GET(req: NextRequest) {
	try {
		const [guest, body] = await Promise.all([getGuestPayload(req), req]);
		
		if (!guest) {
			return new NextResponse("", { status: 403, statusText: "Unauthorized" });
		}

		return new NextResponse(
			JSON.stringify({
				data: guest,
			})
		);
	} catch (err) {
		console.error(err);
    return new NextResponse("", { status: 401 });
	}
}

export async function POST(req: NextRequest) {
  try {
    const [guest, body] = await Promise.all([getGuestPayload(req), req.json()]);

    try {
      const updatedGuest = await prisma.guest.update({
        where: {
          id: guest.id,
        },
        data: body,
      });

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
