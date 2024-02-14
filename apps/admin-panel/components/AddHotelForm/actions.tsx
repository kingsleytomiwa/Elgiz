'use server';

import { Hotel, Position } from "@prisma/client";
import { randomBytes } from "crypto";
import prisma, { updateHotel } from "db";
import { adminAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const onMutateHotel = async ({ modules, subModules, ...values }: Partial<Hotel & { modules: any; subModules: any; }>, isEdit: boolean) => {
  const session = await getServerSession(adminAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const password = randomBytes(10).toString("hex");

  const { id, email } = await updateHotel({
    ...values,
    id: values.id
  });

  isEdit && revalidatePath(`/hotel/${id}`);

  isEdit && await prisma.user.update(
    {
      where: {
        email: email!,
      },
      data: {
        email,
        hotelId: id,
        position: Position.OWNER
      }
    }
  );

  return id;
};
