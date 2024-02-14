"use server";

import { revalidatePath } from "next/cache";

export async function mutateRequests() {
  revalidatePath("/requests");
}
