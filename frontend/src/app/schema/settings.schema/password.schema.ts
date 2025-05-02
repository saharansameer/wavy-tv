import { z } from "zod";

export const passwordFormSchema = z
  .object({
    currPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(1, "New password can't be empty"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.currPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type PasswordFormSchemaType = z.input<typeof passwordFormSchema>;
