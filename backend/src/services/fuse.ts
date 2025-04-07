import Fuse from "fuse.js";

const knownWords = [
  "mongoose",
  "mongodb",
  "data",
  "analytics",
  "analysis",
  "javascript",
  "typescript",
  "python",
  "express",
  "node",
  "nodejs",
  "expressjs",
];

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
