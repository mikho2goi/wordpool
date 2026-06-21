// Derives display metadata for a deck from data we already store — no extra
// DB fields needed. Source language comes from the deck's cards (`lang`);
// level + theme are parsed from the `Language_Level_Theme` name convention.
import { LANGUAGES } from "./langs";

// every meaning in the current data set is Vietnamese
export const TARGET_LABEL = "Tiếng Việt";

// cap deck names so long names can't blow out the grid layout
export const MAX_DECK_NAME = 60;

// canonical, editable level values
export const LEVEL_OPTIONS = ["Basic", "Intermediate", "Advanced"] as const;
export type Level = (typeof LEVEL_OPTIONS)[number];

export function isValidLevel(x: unknown): x is Level {
  return typeof x === "string" && (LEVEL_OPTIONS as readonly string[]).includes(x);
}

// map the name-convention token (Basic/Inter/Advanced) -> canonical level
const LEVELS: Record<string, Level> = {
  Basic: "Basic",
  Inter: "Intermediate",
  Advanced: "Advanced",
};

// "en-US" -> "English". Returns null for unknown/empty.
export function langLabel(code?: string | null): string | null {
  if (!code) return null;
  return LANGUAGES.find((l) => l.code === code)?.label ?? code;
}

// the meaning-side ("To") label; defaults to Vietnamese when unset
export function targetLabel(code?: string | null): string {
  return langLabel(code) ?? TARGET_LABEL;
}

export type DeckMeta = {
  level: string | null; // "Basic" | "Intermediate" | "Advanced" | null
  theme: string | null; // e.g. "Food", "Idioms"
  title: string; // clean display title
};

// Parse "English_Basic_Food" -> { level:"Basic", theme:"Food", title:"Food" }.
// Names that don't match the convention just get underscores prettified.
export function parseDeckName(name: string): DeckMeta {
  const parts = name.split("_");
  if (parts.length >= 3 && LEVELS[parts[1]]) {
    const theme = parts.slice(2).join(" ");
    return { level: LEVELS[parts[1]], theme, title: theme };
  }
  return { level: null, theme: null, title: name.replace(/_/g, " ") };
}
