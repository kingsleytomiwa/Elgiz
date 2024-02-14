"use server";

import { revalidatePath } from "next/cache";
import { kv } from "@vercel/kv";
import { Settings } from "./SettingsForm";
import { getServerSession } from "next-auth";
import { adminAuthOptions } from "backend-utils";

export const onUpdateSettings = async ({
  notificateInAdvance,
  autostopSubscriptionIn,
}: Settings) => {
  const session = await getServerSession(adminAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await kv.hset(`settings:${session.user.id}`, {
    notificateInAdvance,
    autostopSubscriptionIn,
  });

  revalidatePath("/settings");
};
