// Preset card colors offered in the add form.
export const CARD_COLORS = [
  "#ffffff", // white
  "#fee2e2", // red
  "#ffedd5", // orange
  "#fef9c3", // yellow
  "#dcfce7", // green
  "#cffafe", // cyan
  "#dbeafe", // blue
  "#ede9fe", // violet
  "#fce7f3", // pink
  "#f1f5f9", // slate
] as const;

export const DEFAULT_CARD_COLOR = "#ffffff";

// Pick black or white text for best contrast on a given hex background.
export function readableText(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return "#0f172a";
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  // relative luminance (sRGB)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? "#0f172a" : "#ffffff";
}
