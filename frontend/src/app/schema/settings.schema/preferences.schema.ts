import { z } from "zod";
import { Category, PublishStatus } from "@/app/schema";

const ThemeType = z.enum(["dark", "light", "system"]);
const NsfwContentType = z.enum(["SHOW", "HIDE", "BLUR"]);

export const preferencesFormSchema = z.object({
  theme: ThemeType,
  nsfwContent: NsfwContentType,
  publishStatus: PublishStatus,
  category: Category,
  saveSearchHistory: z.boolean(),
  saveWatchHistory: z.boolean(),
});

export type PreferencesFormSchemaType = z.input<typeof preferencesFormSchema>;
