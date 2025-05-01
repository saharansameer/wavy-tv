import { z } from "zod";

// Post Schema
export const postFormSchema = z.object({
  content: z
    .string()
    .min(1, "Title can not be empty")
    .max(2000, "Post content must be at most 2000 characters"),
});

// Comment Schema
export const commentFormSchema = postFormSchema.extend({
  content: z
    .string()
    .min(1, "Comment can not be empty")
    .max(1000, "Comment must be at most 1000 characters"),
});

export type PostFormSchemaType = z.input<typeof postFormSchema>;

export type CommentFormSchemaType = z.input<typeof commentFormSchema>;
