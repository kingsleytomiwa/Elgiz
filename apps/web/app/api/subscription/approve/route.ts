import { NextRequest, NextResponse } from "next/server";
import { getSubscription } from "backend-utils/paypal";
import prisma from "db";

export async function POST(req: NextRequest) {
  try {
    const { orderID, subscriptionID } = await req.json();

    try {
      const subscription = await getSubscription(subscriptionID);

      if (subscription.status !== "ACTIVE") {
        return new NextResponse("", { status: 400 });
      }
    } catch (error) {
      console.error(error);
      return new NextResponse("", { status: 400 });
    }

    const hotel = await prisma.hotel.findFirst({
      where: {
        paypalSubscriptionId: subscriptionID,
        NOT: {
          suspended: false,
        },
      },
    });

    if (!hotel) {
      console.error("Hotel not found");
      return new NextResponse("", { status: 400 });
    }

    const payment = await prisma.payment.findFirst({
      where: {
        hotelId: hotel.id,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    if (!payment) {
      return new NextResponse("", { status: 404 });
    }

    await prisma.$transaction([
      prisma.user.updateMany({
        where: {
          hotelId: hotel.id,
        },

        data: {
          suspended: false,
        },
      }),

      prisma.payment.update({
        where: {
          id: payment.id,
        },

        data: {
          paypalOrderId: orderID,
          isPaid: true,
        },
      }),

      prisma.hotel.update({
        where: {
          id: hotel.id,
        },

        data: {
          suspended: false,
        },
      }),
    ]);

    return new NextResponse("", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("", { status: 500 });
  }
}
