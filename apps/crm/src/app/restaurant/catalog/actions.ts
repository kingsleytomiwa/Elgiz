"use server";

import prisma from "db";
import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { OutputLanguage } from "src/utils/constants";
import { v4 } from "uuid";
import { FoodCategory } from "@prisma/client";

export const onAddCategory = async ({ name, id }: OutputLanguage & { id: string }) => {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const total = await prisma.foodCategory.count({
    where: {
      hotelId: session.user.hotelId!,
    },
  });

  await prisma.foodCategory.upsert({
    where: {
      id: id ? id : v4(),
      hotelId: session.user.hotelId!,
    },
    create: {
      index: total + 1,
      hotelId: session.user.hotelId!,
      name: name as string,
    },
    update: {
      name: name as string,
    },
  });
};

export const onDeleteCategory = async (id: string) => {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction([
    prisma.foodPosition.deleteMany({
      where: {
        categoryId: id,
      },
    }),
    prisma.foodCategory.delete({
      where: {
        id,
      },
    }),
  ]);
};

export const onDragItem = async (items: FoodCategory[]) => {
  const session = getServerSession(ownerAuthOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction(
    items.map((item) =>
      prisma.foodCategory.update({
        where: { id: item.id },
        data: { index: item.index },
      })
    )
  );
};
