import Fuse from "fuse.js";
import { readFile } from "fs/promises";

const loadKnownWords = async () => {
  const raw = await readFile(
    new URL("../data/words.json", import.meta.url),
    "utf-8"
  );
  return JSON.parse(raw) as string[];
};

const knownWords = await loadKnownWords();

const fuse = new Fuse(knownWords, {
  includeScore: true,
  threshold: 0.4,
});

export const getCorrectSearchQuery = (input: string) => {
  const inputWords = input.toLocaleLowerCase().split(" ");
  const correctedWords = inputWords.map((word) => {
    const match = fuse.search(word)[0];
    return match && match.score! < 0.4 ? match.item : word;
  });

  return correctedWords.join(" ");
};
