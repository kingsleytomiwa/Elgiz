import { getSubscriptionData } from "backend-utils/paypal";
import { NextRequest, NextResponse } from "next/server";
import prisma from "db";
import { createHotelPaymentAndNotify } from "@/app/[locale]/checkout/actions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rooms, period, extras, password, ...hotelData } = body;

    const found = await prisma.hotel.findFirst({
      where: { email: hotelData.email },
      select: { id: true },
    });

    if (found) {
      throw new Error("Hotel with this email already exists");
    }

    const { id, price } = await getSubscriptionData(body);
    hotelData.autoRenewal = true;

    await createHotelPaymentAndNotify({
      hotelData,
      price: +(price.toFixed(2)),
      rooms,
      period,
      extras,
      password,
      paypalSubscriptionId: id,
    });

    return new NextResponse(id);
  } catch (error) {
    console.error(error);
    return new NextResponse("", { status: 500 });
  }
}
