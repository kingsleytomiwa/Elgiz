"use server";

import { Prisma } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { randomBytes } from "crypto";
import prisma, { updateUser } from "db";
import { getServerSession } from "next-auth";
import { ownerAuthOptions, saveBlob } from "backend-utils";
import { MAILER } from "utils";
import { sendMail } from "utils/sendgrid";

export const onMutateStaff = async (
  { password, ...fields }: Prisma.UserUncheckedCreateInput,
  formData?: FormData
) => {
  const newPassword = randomBytes(10).toString("hex");
  const hashPassword = hashSync(newPassword, 10);

  if (!fields.image && formData) {
    // uploading to vercel blob
    fields.image = await saveBlob(formData);
  }

  await updateUser(
    { email: fields.email as string },
    {
      create: { ...fields, password: hashPassword },
      update: { ...fields },
    }
  );

  await sendMail({
    from: MAILER.noReply,
    to: fields.email!,
    subject: `Account created!`,
    content: `Use the following credentials to access Elgiz: ${fields.email} ${newPassword}`,
  });
};

export const onDeleteStaff = async (id: string) => {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.user.delete({
    where: {
      id: id,
      hotelId: session.user.hotelId!,
    },
  });
};
