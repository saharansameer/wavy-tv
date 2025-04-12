import Fuse from "fuse.js";
import { readAndLoadJsonArray } from "../utils/fs.js";

// Known Words (Used to correct misspelled words)
const knownWords = await readAndLoadJsonArray("src/data/words.json");

// Fuse Init
const fuse = new Fuse(knownWords, {
  includeScore: true,
  threshold: 0.4,
});

// Misspelled words correction
export const getCorrectSearchQuery = (input: string) => {
  const inputWords = input.toLocaleLowerCase().split(" ");
  const correctedWords = inputWords.map((word) => {
    const match = fuse.search(word)[0];
    return match && match.score! < 0.4 ? match.item : word;
  });

  return correctedWords.join(" ");
};
