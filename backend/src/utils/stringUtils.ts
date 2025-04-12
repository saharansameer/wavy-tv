import { readAndLoadJsonArray } from "./fs.js";

export const trimAndClean = (val: string) => {
  return val.trim().replace(/\s+/g, " ");
};

// Excluded Tags and Keywords
const excludedTags = await readAndLoadJsonArray("src/data/ex-tags.json");

export const extractTagsAndKeywords = (title: string, description: string) => {
  const tagsSet = new Set<string>(); // To store unique tags

  // Convert to lowercase and remove non-alphanumerics
  const cleanWord = (word: string) => {
    return word.toLowerCase().replace(/[^\w]/g, "");
  };

  // Extract tags from title
  title.split(" ").forEach((word: string) => {
    const tag = cleanWord(word);

    if (tag && !excludedTags.includes(tag)) {
      tagsSet.add(tag); // Add cleaned tag if not excluded
    }
  });

  // Extract max 5 hashtags from description (if any)
  if (description !== undefined && description !== "") {
    description
      .split(" ")
      .filter((word: string) => word.startsWith("#")) // Only hashtags
      .slice(0, 5) // Limit to first 5
      .map((word: string) => cleanWord(word)) // Clean them
      .forEach((tag: string) => {
        if (tag && !excludedTags.includes(tag)) {
          tagsSet.add(tag); // Add cleaned hashtag if not excluded
        }
      });
  }

  // Return array of unique and cleaned tags
  return Array.from(tagsSet);
};
