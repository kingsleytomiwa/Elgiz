import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { getAvailableTimeSlots } from "src/utils/spa";

export async function GET(req: NextRequest) {
  const session = await getServerSession(ownerAuthOptions);
  const query = Object.fromEntries(new URL(req.url).searchParams);

  return new Response(
    JSON.stringify(
      await getAvailableTimeSlots(
        session?.user.hotelId!,
        new Date(query.date as string),
        query.positionId as string
      )
    )
  );
}
