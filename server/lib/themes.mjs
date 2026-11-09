/**
 * Palety postów o spotkaniach — te same dane co w renderze
 * (`src/core/posts/post-themes.json`). Generator używa ich do podglądu kolorów
 * na kafelkach kompozycji.
 */
import fs from "node:fs";
import path from "node:path";

const themesFile = path.join(import.meta.dirname, "..", "..", "src", "core", "posts", "post-themes.json");

const loadThemes = () => {
  try {
    const parsed = JSON.parse(fs.readFileSync(themesFile, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.error(`Nie udało się wczytać palet: ${error.message}`);
    return {};
  }
};

export const postThemes = loadThemes();

export const resolveTheme = (name) => postThemes[name] ?? postThemes.default ?? {};
