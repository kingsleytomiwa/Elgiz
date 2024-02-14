"use server";

import prisma from "db";
import { ownerAuthOptions } from "backend-utils";
import { sendPushNotification } from "backend-utils/notification";
import { getServerSession } from "next-auth";
import { Guest } from "@prisma/client";

export async function sendMessage({ guest, text }: { guest: Guest; text: string }) {
  try {
    const session = await getServerSession(ownerAuthOptions);

    if (!text || !guest.id) {
      throw new Error("Bad input");
    }

    await prisma.message.create({
      data: {
        text,
        senderId: session?.user.id!,

        guestId: guest.id,
        hotelId: session?.user.hotelId!,
      },
    });

    if (guest.pushToken) {
      await sendPushNotification(guest.pushToken, {
        title: "You have a new message!",
        body: "Read a new message from the hotel!",
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function readMessages(guestId: string) {
  try {
    const session = await getServerSession(ownerAuthOptions);

    await prisma.message.updateMany({
      where: {
        guestId,
        hotelId: session?.user.hotelId!,
        senderId: guestId,
      },
      data: { wasRead: true },
    });
  } catch (error) {
    console.error(error);
  }
}
