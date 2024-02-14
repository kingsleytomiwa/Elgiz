import { calculateTotalPrice } from "utils/billing";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { rooms, period, extras } = await req.json();

  return new NextResponse(JSON.stringify(calculateTotalPrice(rooms, period, extras)));
}
