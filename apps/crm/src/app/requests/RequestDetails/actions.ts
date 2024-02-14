"use server";

import prisma, { updateStatusRequest } from "db";
import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function revalidateRequests() {
  revalidatePath("/requests");
  revalidatePath("/restaurant");
  revalidatePath("/reception");
  revalidatePath("/shop");
  revalidatePath("/spa");
  revalidatePath("/spa/schedule");
  revalidatePath("/");
}

export async function deleteRequest(id: string) {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await prisma.request.delete({
    where: {
      id,
      hotelId: session.user.hotelId!,
    },
  });

  await revalidateRequests();
}

export async function updateStatus(id: string, guestId?: string) {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await updateStatusRequest(id, session.user.id, guestId);
  await revalidateRequests();
}

export async function updatePaidStatus(id: string, status: boolean) {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await prisma.request.update({
    where: {
      id,
    },
    data: {
      isPaid: status,
    },
  });

  await revalidateRequests();
}
