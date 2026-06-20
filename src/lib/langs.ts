// Languages offered for a card's pronunciation. Store the code; each viewer's
// browser picks its best installed voice for that language.
export const LANGUAGES = [
  { code: "en-US", label: "English" },
  { code: "es-ES", label: "Spanish" },
  { code: "fr-FR", label: "French" },
  { code: "de-DE", label: "German" },
  { code: "it-IT", label: "Italian" },
  { code: "pt-PT", label: "Portuguese" },
  { code: "ru-RU", label: "Russian" },
  { code: "ja-JP", label: "Japanese" },
  { code: "ko-KR", label: "Korean" },
  { code: "zh-CN", label: "Chinese (Mandarin)" },
  { code: "vi-VN", label: "Vietnamese" },
  { code: "th-TH", label: "Thai" },
  { code: "ar-SA", label: "Arabic" },
  { code: "hi-IN", label: "Hindi" },
  { code: "nl-NL", label: "Dutch" },
] as const;

export const LANG_CODES = LANGUAGES.map((l) => l.code) as readonly string[];

export const DEFAULT_LANG = "en-US";

export function isValidLang(code: unknown): code is string {
  return typeof code === "string" && LANG_CODES.includes(code);
}
