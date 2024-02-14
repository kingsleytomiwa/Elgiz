"use server";

import { FoodPosition } from "@prisma/client";
import prisma from "db";
import { ownerAuthOptions, saveBlob } from "backend-utils";
import { getServerSession } from "next-auth";
import { v4 } from "uuid";

export const onAddPosition = async (
  position: Omit<FoodPosition, "hotelId" | "id" | "imageURL"> & {
    id?: string;
    imageURL?: string;
  },
  formData?: FormData
) => {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!position.imageURL && formData) {
    // uploading to vercel blob
    position.imageURL = await saveBlob(formData);
  }

  const fields = {
    ...position,
    id: position?.id ? position?.id : v4(),
    hotelId: session.user.hotelId!,
  };

  // uploading to prisma
  await prisma.foodPosition.upsert({
    where: {
      id: fields.id,
      hotelId: session.user.hotelId!,
    },
    create: fields as any,
    update: fields as any,
  });
};

export const deleteFoodPosition = async (id: string) => {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.foodPosition.delete({
    where: {
      id: id,
      hotelId: session.user.hotelId!,
    },
  });
};
