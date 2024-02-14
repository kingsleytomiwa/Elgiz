"use server";

import prisma from "prisma";
import { DEFAULT_MODULES } from "utils/constants";

function onCreateHotelModules(hotelId: string) {
  return DEFAULT_MODULES.map(({ subModules, ...item }) => {
    const data = {
      ...item,
      hotelId,
      subModules: {
        create: subModules.map(({ name, title, value, ...subModule }) => ({
          name,
          title,
          value,
          hotelId,
          hidden: subModule?.hidden ?? false,
        })),
      },
    };

    return prisma.module.create({
      data,
    });
  });
}

export async function setModulesAndSubmodulesToHotels() {
  const hotelIds = (await prisma.hotel.findMany({ select: { id: true } }))?.map(
    (el) => el.id
  );

  try {
    return await prisma.$transaction(
      async () => {
        for (const id of hotelIds) {
          const modules = onCreateHotelModules(id);

          for (const module of modules) {
            await module;
          }
        }
      },
      {
        maxWait: 20000,
        timeout: 100000,
      }
    );
  } catch (err) {
    console.error(err);
  }
}
