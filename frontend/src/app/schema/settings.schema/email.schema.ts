import { z } from "zod";
import { loginFormSchema } from "@/app/schema";

export const emailFormSchema = loginFormSchema
  .extend({
    newEmail: z
      .string()
      .email()
      .regex(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        "Please enter a valid email address"
      ),
  })
  .refine((data) => data.newEmail !== data.email, {
    message: "New email must be different from current email",
    path: ["newEmail"],
  });

export type EmailFormSchemaType = z.input<typeof emailFormSchema>;
