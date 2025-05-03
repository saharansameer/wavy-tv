import { z } from "zod";

// Define constants
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024; // 10MB

// Define enum types for better type safety
export const PublishStatus = z.enum(["PRIVATE", "UNLISTED", "PUBLIC"]);
export type PublishStatusType = z.infer<typeof PublishStatus>;

export const Category = z.enum([
  "GENERAL",
  "ENTERTAINMENT",
  "EDUCATION",
  "GAMING",
  "MUSIC",
  "COMEDY",
  "PROGRAMMING",
  "SCIENCE",
  "TECH",
  "ART",
  "ANIMATION",
  "GRAPHICS",
]);
export type CategoryType = z.infer<typeof Category>;

// Create the form schema
export const videoFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title can not be empty")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .max(5000, "Description must be at most 5000 characters")
    .optional()
    .or(z.literal("")),
  video: z
    .instanceof(File, { message: "Video is required" })
    .refine(
      (file) =>
        ["video/mp4", "video/quicktime", "video/webm"].includes(file.type),
      {
        message: "Only MP4, MOV, or WEBM videos are allowed",
      }
    )
    .refine((file) => file.size <= MAX_VIDEO_SIZE, {
      message: "Video must be less than 100 MB",
    }),
  thumbnail: z
    .instanceof(File, { message: "Thumbnail is required" })
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      {
        message: "Only JPG, JPEG, or PNG images are allowed",
      }
    )
    .refine((file) => file.size <= MAX_THUMBNAIL_SIZE, {
      message: "Thumbnail must be less than 10 MB",
    }),
  publishStatus: PublishStatus,
  category: Category,
  nsfw: z.boolean().default(false),
});

export const videoEditFormSchema = videoFormSchema.extend({
  video: z.union([z.undefined(), z.instanceof(File)]).optional(),
  thumbnail: z
    .instanceof(File, { message: "Thumbnail is required" })
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      {
        message: "Only JPG, JPEG, or PNG images are allowed",
      }
    )
    .optional(),
});

// Infer the type from the schema
export type VideoFormSchemaType = z.input<typeof videoFormSchema>;

export type VideoEditFormSchemaType = z.input<typeof videoEditFormSchema>;
