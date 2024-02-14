"use server";

import { ownerAuthOptions } from "backend-utils";
import { updateStatusRequest } from "db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function updateStatus(id: string, guestId?: string) {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await updateStatusRequest(id, session.user.id, guestId);
  revalidatePath("/");
  revalidatePath("/request/[slug]");
}
