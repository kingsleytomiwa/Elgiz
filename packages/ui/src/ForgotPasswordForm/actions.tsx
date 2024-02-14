"use server";

import { JWT } from 'backend-utils';
import prisma from "db";
import { sendMail } from 'utils/sendgrid';

export async function getPasswordResetLink(email: string) {
    try {
        const user = await prisma.user.findFirst({ where: { email }, select: { id: true } });

        if (!user) {
            throw new Error('User with such email hasn\'t been found');
        }

        const jwt = await JWT.sign({ email }, process.env.JWT_SECRET!);

        await sendMail({
            to: email,
            subject: `Password Reset`,
            content: `Please, <a href="${process.env.NEXT_PUBLIC_VERCEL_URL || process.env.SITE_URL}/reset-password?token=${jwt}">click here</a> to create a new password`,
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error sending password reset link');
    }
}
