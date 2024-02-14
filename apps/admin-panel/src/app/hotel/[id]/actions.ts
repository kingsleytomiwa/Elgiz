"use server";

import { revalidatePath } from "next/cache";
import { deletePayment, updateHotel, updatePayment } from "db";
import { Hotel, Position } from "@prisma/client";
import { adminAuthOptions, saveBlob } from "backend-utils";
import { getServerSession } from "next-auth";
import prisma from "db";

export const onUpdateHotel = async (id: string, { ...hotel }: Partial<Hotel>) => {
  const session = await getServerSession(adminAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await updateHotel({ id, ...hotel });

  revalidatePath(`/hotel/${id}`);
};

export async function activateUser(id: string) {
  const session = await getServerSession(adminAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await prisma.user.updateMany({
    where: {
      hotelId: id,
      position: Position.OWNER,
    },

    data: {
      suspended: false,
    },
  });
}

export const onAddPayment = async (
  {
    daysAmount,
    startDate,
  }: {
    submit: null;
    startDate: Date;
    daysAmount: number;
  },
  hotelId: string
) => {
  const session = await getServerSession(adminAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // TODO! Need to fulfill
  // await createHotelPayment({
  //   data: {
  //     hotelId,
  //     startDate,
  //     daysAmount: +daysAmount,
  //     endDate: dateFns.addDays(startDate, daysAmount),
  //   },
  // });

  revalidatePath(`/hotel/${hotelId}`);
};

export const confirmPayment = async (id: string, hotelId: string) => {
  const session = await getServerSession(adminAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await updatePayment({ id }, { isPaid: true });

  revalidatePath(`/hotel/${hotelId}/payments`);
  revalidatePath(`/hotel/${hotelId}/notifications`);
};

export const uploadReceipt = async (id: string, hotelId: string, file: FormData) => {
  const session = await getServerSession(adminAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await updatePayment({ id }, { receipt: await saveBlob(file) });

  revalidatePath(`/hotel/${hotelId}/payments`);
  revalidatePath(`/hotel/${hotelId}/notifications`);
};

export const onDeletePayment = async (id: string, hotelId: string) => {
  const session = await getServerSession(adminAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await deletePayment({ id });

  revalidatePath(`/hotel/${hotelId}/payments`);
};
