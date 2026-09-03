// Single source of truth for the settings shape (chrome.storage.sync) and the
// pure mapping settings -> CSS custom properties. Imported by content.js (which
// writes the vars onto <html> of claude.ai) and popup.js (live preview), and
// exercised by dev/tint.test.mjs.

export const STORAGE_KEY = "settings";

/** All user-adjustable settings. Colors are `#rrggbb`. */
export const DEFAULT_SETTINGS = {
  enabled: true,
  bgColor: "#FFF1C1", // your-message background
  bgOpacity: 1, // 0.2 – 1  (blend toward the page behind the bubble)
  radius: 14, // 0 – 40 px corner rounding
  accentEnabled: false, // a colored bar on the inline-start edge
  accentColor: "#E8B23D",
  accentWidth: 3, // 1 – 12 px
  textEnabled: false, // override the message text color
  textColor: "#3A2E12",
  language: "auto", // "auto" | "ja" | "en"
};

/** One-tap swatches in the popup. `bg` fills the bubble, `accent` the edge bar. */
export const PRESETS = [
  { id: "butter", bg: "#FFF1C1", accent: "#E8B23D" },
  { id: "mint", bg: "#D9F2E6", accent: "#3DAE86" },
  { id: "peach", bg: "#FFE0D2", accent: "#E8794D" },
  { id: "lavender", bg: "#E7E0FA", accent: "#7C63D8" },
  { id: "sky", bg: "#D8ECFB", accent: "#3D93D8" },
  { id: "rose", bg: "#FBDDE8", accent: "#D85D93" },
  { id: "graphite", bg: "#E3E3E6", accent: "#8A8A90" },
];

const clamp = (n, lo, hi, fallback) => {
  const v = typeof n === "number" ? n : parseFloat(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.min(hi, Math.max(lo, v));
};

/** Merge a stored (possibly partial / legacy) object onto the defaults. */
export function normalize(stored) {
  return { ...DEFAULT_SETTINGS, ...(stored || {}) };
}

/**
 * Map settings -> { "--cbt-*": value }. tint.css consumes these; nothing here
 * touches the DOM so it stays trivially testable.
 */
export function settingsToVars(stored) {
  const s = normalize(stored);
  return {
    "--cbt-bg": s.bgColor,
    "--cbt-bg-alpha": String(clamp(s.bgOpacity, 0, 1, 1)),
    "--cbt-radius": `${clamp(s.radius, 0, 40, 14)}px`,
    "--cbt-text": s.textEnabled ? s.textColor : "inherit",
    "--cbt-accent": s.accentEnabled ? s.accentColor : "transparent",
    "--cbt-accent-width": s.accentEnabled
      ? `${clamp(s.accentWidth, 0, 12, 3)}px`
      : "0px",
  };
}
