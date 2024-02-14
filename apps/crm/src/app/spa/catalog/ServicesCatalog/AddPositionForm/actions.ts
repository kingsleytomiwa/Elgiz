"use server";

import { SpaPosition } from "@prisma/client";
import { Option } from "components/FormikAutocomplete";
import prisma from "db";
import { ownerAuthOptions, saveBlob } from "backend-utils";
import { getServerSession } from "next-auth";
import { v4 } from "uuid";

export const onAddPosition = async (
  {
    staff,
    ...position
  }: Omit<SpaPosition, "hotelId" | "id" | "imageURL"> & {
    id?: string;
    imageURL?: string;
    staff?: Option[];
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

  const staffIds = staff?.map((worker) => ({ id: worker.value }));
  const fields = {
    ...position,
    id: position?.id ? position?.id : v4(),
    hotelId: session.user.hotelId!,
    ...(staffIds?.length && {
      staff: { connect: staffIds },
    }),
  };

  // uploading to prisma
  await prisma.spaPosition.upsert({
    where: {
      id: fields.id,
      hotelId: session.user.hotelId!,
    },
    create: fields as any,
    update: fields as any,
  });
};

export const deleteSpaPosition = async (id: string) => {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.spaPosition.delete({
    where: {
      id: id,
      hotelId: session.user.hotelId!,
    },
  });
};
