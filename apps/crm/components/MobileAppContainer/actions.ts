"use server";

import { Module, Prisma, SubModule } from "@prisma/client";
import prisma from "db";
import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";

export const onCreateModules = async (
  items: (Omit<Module, "hotelId"> & { subModules: SubModule[] })[]
) => {
  const session = await getServerSession(ownerAuthOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  return await prisma.$transaction(
    items.map(({ subModules, ...item }) => {
      const data: Prisma.ModuleUpsertArgs["create"] = {
        ...item,
        hotelId: session!.user!.hotelId!,
        subModules: {
          connectOrCreate: subModules.map(({ id, title, value, name }) => ({
            where: {
              id,
              moduleId: item.id,
            },
            // i believe it just doesnt update here. either creates or connects
            create: {
              id,
              title,
							value,
							name
            },
          })),
        },
      };

      return prisma.module.upsert({
        where: {
          id: item.id,
          hotelId: session.user.hotelId!,
        },
        create: data,
        update: data,
        include: {
          subModules: true,
        },
      });
    })
  );
};

export const onCheckModule = async (id: string, value: boolean) => {
	const session = await getServerSession(ownerAuthOptions);

	if (!session) {
		throw new Error("Unauthorized");
	}

	return await prisma.module.update({
    where: {
      id: id!,
      hotelId: session.user.hotelId!,
    },
    data: {
      value,
    },
  });
};

export const onCheckSubModulesOfModule = async (id: string, value: boolean) => {
	const session = await getServerSession(ownerAuthOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }
	
	return await prisma.subModule.updateMany({
		where: {
			moduleId: id,
			hotelId: session.user.hotelId!,
		},
		data: {
			value,
		},
	});
}

export const onCheckSubModule = async (id: string, value: boolean) => {
  const session = await getServerSession(ownerAuthOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  return prisma.subModule.update({
    where: {
			id: id!,
			hotelId: session.user.hotelId!
    },
    data: {
      value,
    },
  });
};
