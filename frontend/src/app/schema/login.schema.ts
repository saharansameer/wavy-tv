import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .email()
    .regex(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      "Please enter a valid email address"
    ),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormSchemaType = z.input<typeof loginFormSchema>;
