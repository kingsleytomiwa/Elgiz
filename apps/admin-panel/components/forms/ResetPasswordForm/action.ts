"use server";

import { updateUser } from "db";

export const renewPassword = async ({ email, password }: { email: string; password: string }) => {
  await updateUser({ email }, { update: { password } });
};
