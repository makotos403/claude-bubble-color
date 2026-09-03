// Runtime i18n for the popup UI. Unlike chrome.i18n (locked to the browser UI
// language), this loads a JSON dictionary we control, so the user can switch
// language in the popup. chrome.i18n still handles the manifest strings
// (name, description) via _locales/.

const cache = {};

/** "auto" -> resolve from the browser UI language; otherwise pass through. */
export function resolveLang(settingLang) {
  if (settingLang === "ja" || settingLang === "en") return settingLang;
  const ui = (chrome.i18n?.getUILanguage?.() || "en").toLowerCase();
  return ui.startsWith("ja") ? "ja" : "en";
}

export async function loadMessages(lang) {
  if (cache[lang]) return cache[lang];
  const url = chrome.runtime.getURL(`strings.${lang}.json`);
  const res = await fetch(url);
  const json = await res.json();
  cache[lang] = json;
  return json;
}

/** makeT(messages)("label.opacity", { pct: 80 }) */
export function makeT(messages) {
  return (key, params) => {
    let s = messages[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        s = s.replaceAll(`{${k}}`, String(v));
      }
    }
    return s;
  };
}
