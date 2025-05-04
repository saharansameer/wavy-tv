import { z } from "zod";

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

// Zod validations for both avatar and coverImage
export const imageFormSchema = z.object({
  image: z
    .instanceof(File, { message: "Image File is required" })
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      {
        message: "Only JPG, JPEG, or PNG images are allowed",
      }
    )
    .refine((file) => file.size <= MAX_IMAGE_SIZE, {
      message: "Image must be less than 10 MB",
    }),
});

export type ImageFormSchemaType = z.input<typeof imageFormSchema>;
