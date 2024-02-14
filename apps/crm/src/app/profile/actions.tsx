"use server";

import { cancelSubscription, pauseSubscription, resumeSubscription } from "backend-utils/paypal";
import { AdminNotificationType, Position, TransactionType } from "@prisma/client";
import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import prisma from "db";
import { isWithinDays } from "utils";
import { Period, calculateTotalPrice } from "utils/billing";
import { v4 } from "uuid";
import { add } from "date-fns";

export type UpdatableHotelData = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
};

export async function updateHotelData(data: UpdatableHotelData) {
  try {
    const session = await getServerSession(ownerAuthOptions);

    if (session?.user.position !== Position.OWNER) {
      throw new Error("Only owner can update hotel data");
    }

    await prisma.hotel.update({
      where: { id: session?.user.hotelId! },
      data,
    });

    revalidatePath("/profile");
  } catch (error) {
    console.error(error);
  }
}

export async function updatePaymentData(data: {
  rooms: number;
  method: TransactionType;
  autoRenewal: boolean;
}) {
  try {
    const session = await getServerSession(ownerAuthOptions);

    if (session?.user.position !== Position.OWNER) {
      throw new Error("Only owner can update hotel data");
    }

    let needsSnack = false;

    const hotel = {} as {
      autoRenewal?: boolean;
      paypalSubscriptionId?: string | null;
    };

    const currentHotel = await prisma.hotel.findFirst({
      where: { id: session?.user.hotelId! },
      select: {
        id: true,
        rooms: true,
        paypalSubscriptionId: true,
        autoRenewal: true,
      }
    });

    if (!currentHotel) {
      throw new Error("Hotel not found");
    }

    if (data.rooms !== currentHotel?.rooms) {
      if (data.rooms < currentHotel.rooms!) {
        throw new Error("You can't decrease rooms quantity");
      }

      await prisma.adminNotification.create({
        data: {
          type: AdminNotificationType.ROOMS_QUANTITY_CHANGE_REQUEST,
          hotelId: session?.user.hotelId!,
          data: {
            rooms: currentHotel.rooms,
            newRooms: data.rooms,
          },
        },
      });

      needsSnack = true;
    }

    // This if statement is for the case when hotel has paypal subscription
    // and owner wants to change payment method to bank transfer
    // or stop auto renewal
    // PS: hotel can't both change payment method and auto renewal
    // because there's no auto renewal for bank transfer
    if (currentHotel.paypalSubscriptionId) {
      // If hotel wants to change payment method to bank transfer
      // we cancel paypal subscription and set paypalSubscriptionId to null
      if (data.method === TransactionType.BANK_TRANSFER) {
        await cancelSubscription(currentHotel.paypalSubscriptionId);

        needsSnack = true;
        hotel.autoRenewal = false;
        hotel.paypalSubscriptionId = null;
      } else if (data.autoRenewal !== currentHotel.autoRenewal) {
        // If hotel wants to change auto renewal status
        // we pause or resume paypal subscription
        if (currentHotel.autoRenewal) {
          await pauseSubscription(currentHotel.paypalSubscriptionId);
        } else {
          await resumeSubscription(currentHotel.paypalSubscriptionId);
        }

        hotel.autoRenewal = data.autoRenewal;
      }
    }
    // This if statement is for the case when hotel
    // wants to switch from Bank Transfer to PayPal
    // for now we simply create an admin notification
    else if (data.method === TransactionType.PAYPAL) {
      await prisma.adminNotification.create({
        data: {
          type: AdminNotificationType.PAYMENT_METHOD_CHANGE_REQUEST,
          hotelId: session?.user.hotelId!,
          data: {
            method: TransactionType.BANK_TRANSFER,
            newMethod: data.method,
          },
        },
      });

      needsSnack = true;
    }

    if (Object.keys(hotel).length) {
      await prisma.hotel.update({
        where: { id: session.user.hotelId! },
        data: hotel,
      });
    }

    revalidatePath("/profile/payments");

    return needsSnack;
  } catch (error) {
    console.error(error);

    throw "Something went wrong...";
  }
}

export async function createPaymentIntent() {
  try {
    const session = await getServerSession(ownerAuthOptions);

    if (session?.user.position !== Position.OWNER) {
      throw new Error("Only owner can update hotel data");
    }

    const [lastPayment, unpaid] = await prisma.$transaction([
      prisma.payment.findFirst({
        where: { hotelId: session.user.hotelId!, isPaid: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.payment.findFirst({
        where: { hotelId: session.user.hotelId!, isPaid: false },
      }),
    ]);

    if (unpaid) {
      throw new Error("You already have unpaid payment");
    }

    if (!lastPayment) {
      throw new Error("You don't have any payments");
    }

    if (!isWithinDays(lastPayment.endDate!)) {
      throw new Error("Cannot pay yet...");
    }

    const hotel = await prisma.hotel.findFirst({
      where: { id: session.user.hotelId! },
      select: { rooms: true },
    });

    const amount = calculateTotalPrice(hotel?.rooms!, lastPayment.period! as Period).total;
    const id = v4();

    await prisma.$transaction([
      prisma.payment.create({
        data: {
          id,
          hotelId: session.user.hotelId!,
          startDate: lastPayment.endDate!,
          endDate: add(lastPayment.endDate!, { months: lastPayment.period }),
          type: TransactionType.BANK_TRANSFER,
          isPaid: false,
          rooms: hotel?.rooms!,
          extras: [],
          period: lastPayment.period,
          amount,
        },
      }),
      prisma.adminNotification.create({
        data: {
          type: AdminNotificationType.PAYMENT,
          hotelId: session?.user.hotelId!,
          paymentId: id,
          data: {
            rooms: hotel?.rooms!,
            period: lastPayment.period,
            amount,
          },
        },
      })
    ]);

    revalidatePath("/profile/payments");
  } catch (error) {
    console.error(error);

    throw "Something went wrong...";
  }
}

export async function requestPaymentReceipt(paymentId: string) {
  try {
    const session = await getServerSession(ownerAuthOptions);

    if (session?.user.position !== Position.OWNER) {
      throw new Error("Only owner can request payment receipt");
    }

    const payment = await prisma.payment.findFirst({
      where: { id: paymentId, hotelId: session.user.hotelId! },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    await prisma.adminNotification.create({
      data: {
        type: AdminNotificationType.PAYMENT_RECEIPT,
        hotelId: session?.user.hotelId!,
        paymentId: payment.id,
      },
    });
  } catch (error) {
    console.error(error);

    throw "Something went wrong...";
  }
}
