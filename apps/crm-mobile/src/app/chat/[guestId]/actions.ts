"use server";

import prisma from "db";
import { ownerAuthOptions } from "backend-utils";
import { sendPushNotification } from "backend-utils/notification";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function sendMessage({ guestId, text }: { guestId: string; text: string }) {
  try {
    const session = await getServerSession(ownerAuthOptions);

    if (!text || !guestId) {
      throw new Error("Bad input");
    }

    await prisma.message.create({
      data: {
        text,
        senderId: session?.user.id!,

        guestId,
        hotelId: session?.user.hotelId!,
      },
    });

    const guest = await prisma.guest.findFirst({
      where: {
        id: guestId,
        hotelId: session?.user.hotelId!,
      },
      select: {
        pushToken: true,
      },
    });

    if (guest?.pushToken) {
      await sendPushNotification(guest.pushToken, {
        title: "You have a new message!",
        body: "Read a new message from the hotel!",
      });
    }

    revalidatePath(`/chat`);
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
