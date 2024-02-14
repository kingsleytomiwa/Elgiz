"use server";

import { revalidatePath } from "next/cache";
import { kv } from "@vercel/kv";
import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";

export const onUpdateSettings = async (settings: any, hotelId: string) => {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await kv.hset(`hotelSettings:${hotelId}`, settings);

  revalidatePath("/settings");
};
