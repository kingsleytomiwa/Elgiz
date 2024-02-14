"use server";

import { ShopCategory } from "@prisma/client";
import prisma from "db";
import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { OutputLanguage } from "src/utils/constants";
import { v4 } from "uuid";

export const onAddCategory = async ({ name, id }: OutputLanguage & { id: string }) => {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const total = await prisma.shopCategory.count({
    where: {
      hotelId: session.user.hotelId!,
    },
  });

  await prisma.shopCategory.upsert({
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
    prisma.shopPosition.deleteMany({
      where: {
        categoryId: id,
      },
    }),
    prisma.shopCategory.delete({
      where: {
        id,
      },
    }),
  ]);
};

export const onDragItem = async (items: ShopCategory[]) => {
  const session = getServerSession(ownerAuthOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction(
    items.map((item) =>
      prisma.shopCategory.update({
        where: { id: item.id },
        data: { index: item.index },
      })
    )
  );
};
