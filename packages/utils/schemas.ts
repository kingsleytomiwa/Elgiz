import * as zod from "zod";
import { PASSWORD_REGEX } from "./constants";

export const emailSchema = zod.object({
  email: zod
    .string()
    .trim()
    .email()
    .min(1, { message: "Email may not be correct" }),
});

export const passwordSchema = zod.object({
  password: zod
    .string()
    .trim()
    .min(6, { message: "Password may not be correct" })
    .regex(PASSWORD_REGEX, { message: "Password is invalid." }),
});

export const confirmPassword = zod.object({
  password: zod
    .string()
    .trim()
    .min(6, { message: "Password may not be correct" })
    .regex(PASSWORD_REGEX, { message: "Password is invalid." }),
});

export const addMessageSchema = zod.object({
  message: zod
    .string()
    .trim()
    .min(0, { message: "Message may not be correct" }),
});

export const nameSchema = zod.object({
  name: zod
    .string()
    .trim()
    .min(1, { message: "The username is not avaliable " }),
});

export const loginSchema = zod
  .object({
    password: zod.string().trim(),
  })
  .merge(emailSchema);

export const signInSchema = zod
  .object({})
  .merge(emailSchema)
  .merge(passwordSchema)
  .merge(nameSchema);

export const confirmPasswordSchema = zod
  .object({
    confirmPassword: zod
      .string()
      .trim()
      .min(8, { message: "Password may not be correct" }),
  })
  .merge(passwordSchema);
