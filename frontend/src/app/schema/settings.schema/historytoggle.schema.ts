import { z } from "zod";

export const historyToggleFormSchema = (
  prevSearchHistory: boolean,
  prevWatchHistory: boolean
) =>
  z
    .object({
      saveSearchHistory: z.boolean(),
      saveWatchHistory: z.boolean(),
    })
    .refine(
      (data) =>
        data.saveSearchHistory !== prevSearchHistory ||
        data.saveWatchHistory !== prevWatchHistory,
      {
        message: "No changes detected.",
        path: ["saveSearchHistory"],
      }
    );

export type HistoryToggleFormSchema = z.infer<
  ReturnType<typeof historyToggleFormSchema>
>;
