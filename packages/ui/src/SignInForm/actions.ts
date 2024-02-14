"use server";

import prisma from "db";
import { cookies } from "next/headers";

export async function onSignIn(email: string) {
    const user = await prisma.user.findFirst({
        where: { email },
        select: { hotel: { select: { settings: true } } }
    });

    const language = (user?.hotel?.settings as any)?.language;

    if (language) {
        cookies().set("X-Language", language);
    }
}
