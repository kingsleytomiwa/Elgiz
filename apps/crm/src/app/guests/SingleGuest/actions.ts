"use server";

import prisma from "db";
import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";

export async function suspendGuest(id: string, suspended: boolean) {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    // Assure the guest exists
    // and current user has access
    await prisma.guest.findFirstOrThrow({
      where: { id, hotelId: session?.user.hotelId! },
    });

    await Promise.all([
      prisma.guest.update({
        where: { id },

        data: {
          suspended,
        },
      }),

      suspended ? kv.set(`guest:${id}`, { suspended }) : kv.del(`guest:${id}`),
    ]);

    revalidatePath("/guests");
  } catch (error) {
    console.error(error);

    return { error };
  }

  revalidatePath("/api/guests");
}
