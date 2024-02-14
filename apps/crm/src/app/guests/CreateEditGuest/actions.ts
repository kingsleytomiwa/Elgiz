"use server";

import { Guest } from "@prisma/client";
import prisma, { TableGuest, createGuest, updateGuest } from "db";
import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createEditGuest(
  data: Omit<Guest, "code" | "id"> & { pushToken?: string },
  id?: string
) {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const [rooms, hotel] = await prisma.$transaction([
    prisma.guest.count({
      where: {
        startDate: {
          lte: data.startDate,
        },
        endDate: {
          gte: data.endDate,
        },
      },

      orderBy: {},
    }),

    prisma.hotel.findUnique({
      where: {
        id: session?.user.hotelId!,
      },
      select: {
        rooms: true,
        id: true,
      },
    }),
  ]);

  if (rooms >= (hotel?.rooms || 0)) {
    throw new Error("No rooms left at this timeframe");
  }

  let guest: TableGuest;

  if (id) {
    guest = await updateGuest({ id, hotelId: session?.user.hotelId! }, data);
  } else {
    guest = await createGuest({ ...data, hotelId: session?.user.hotelId! });
  }

  revalidatePath("/guests");

  return guest;
}
