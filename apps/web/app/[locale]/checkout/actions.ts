"use server";

import { calculateTotalPrice } from "utils/billing";
import { Prisma, TransactionType } from "@prisma/client";
import prisma, { createHotelWithModules } from "db";
import { v4 } from "uuid";
import { add } from "date-fns";

export async function checkEmailExists(email: string) {
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    return !!user;
  } catch (error) {
    console.error(error);
    return true;
  }
}

export async function createHotel(data: any) {
  try {
    const { rooms, period, extras, password, ...hotelData } = data;

    const found = await prisma.hotel.findFirst({
      where: { email: hotelData.email },
      select: { id: true },
    });

    if (found) {
      throw new Error("Hotel with this email already exists");
    }

    const price = calculateTotalPrice(rooms, period, extras);

    const hotelId = v4();

    await createHotelPaymentAndNotify({
      hotelData,
      price: price.total,
      rooms,
      period,
      extras,
      password,
      paypalSubscriptionId: undefined,
    });

    return hotelId;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createHotelPaymentAndNotify({
  hotelData,
  price,
  rooms,
  period,
  extras,
  password,
  paypalSubscriptionId,
}: {
  hotelData: Prisma.HotelCreateArgs["data"];
  price: number;
  rooms: number;
  period: number;
  extras: string[];
  password: string;
  paypalSubscriptionId?: string;
}) {
  const hotel = await createHotelWithModules(
    {
      ...hotelData,
      suspended: true,
      paypalSubscriptionId,
      rooms,
    },
    password
  );

  await prisma.payment.create({
    data: {
      amount: +(price.toFixed(2)),
      hotelId: hotel.id,
      rooms,
      period,
      extras,
      endDate: add(new Date(), { months: period }),
      type: TransactionType.BANK_TRANSFER,
    },
  });
}
