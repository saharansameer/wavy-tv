import { z } from "zod";

export const updateUserInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full Name can not be empty")
    .max(20, "Full Name should not exceed 20 characters")
    .transform((s) => s.trim()),
  username: z
    .string()
    .regex(
      /^[a-z0-9_]+$/,
      "Username may only contain lowercase letters, numbers, and underscores"
    )
    .min(3, "Username should be at least 3 characters long")
    .max(20, "Username should not exceed 20 characters")
    .transform((s) => s.trim().toLowerCase()),
  about: z
    .string()
    .max(200, "About should not exceed 200 characters")
    .optional()
    .or(z.literal("")),
});

export type UpdateUserInfoSchemaType = z.input<typeof updateUserInfoSchema>;
