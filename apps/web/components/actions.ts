"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const onChangeLanguage = async (lang: string) => {
  cookies().set("lang", lang);
};
