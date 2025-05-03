import { z } from "zod";

export const signupFormSchema = z.object({
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
    .max(20, "Username should not exceed 20 characters"),
  email: z
    .string()
    .email()
    .regex(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      "Please enter a valid email address"
    ),
  password: z
    .string()
    .min(8, "Password should be atleast 8 characters long")
    .max(128, "Password should not exceed 128 characters")
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

export type SignupFormSchemaType = z.input<typeof signupFormSchema>;
