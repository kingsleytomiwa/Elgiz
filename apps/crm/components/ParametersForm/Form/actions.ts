"use server";

import { Parameter } from "@prisma/client";
import { ownerAuthOptions } from "backend-utils";
import prisma from "db";
import { getServerSession } from "next-auth";
import { v4 } from "uuid";

export async function onUpdate(data: Partial<Parameter> & { type: Parameter["type"] }) {
  const user = await getServerSession(ownerAuthOptions);

  return await prisma.parameter.upsert({
    where: {
      id: data.id ?? v4(),
      hotelId: user?.user.hotelId!,
    },
    create: {
      hotelId: user?.user.hotelId!,
      ...data,
    },
    update: {
      ...data,
    },
  });
}
