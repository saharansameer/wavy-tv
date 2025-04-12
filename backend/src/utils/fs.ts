import { readFile } from "fs/promises";
import path from "path";

export const readAndLoadJsonArray = async (
  filePath: string
): Promise<string[]> => {
  // Resolve File Path
  const absolutePath = path.resolve(process.cwd(), filePath);

  // Read File and Encode Data
  const raw = await readFile(absolutePath, "utf-8");

  // Return Data (JSON Array)
  return JSON.parse(raw) as string[];
};
