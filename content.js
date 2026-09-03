// Runs on claude.ai. Reads the saved settings, writes them as CSS custom
// properties onto <html>, and toggles the `data-cbt` attribute that tint.css
// keys off. Re-applies live on any storage change, so popup edits show up
// without a reload.
//
// Manifest content scripts can't be ES modules, so defaults.js (the shared
// settings shape + settings->vars mapping) is pulled in via dynamic import;
// it's listed in web_accessible_resources for that to resolve.

(async () => {
  const { STORAGE_KEY, settingsToVars, normalize } = await import(
    chrome.runtime.getURL("defaults.js")
  );

  const root = document.documentElement;

  function apply(stored) {
    const s = normalize(stored);
    if (!s.enabled) {
      root.removeAttribute("data-cbt");
      root.removeAttribute("data-cbt-text");
      return;
    }
    for (const [k, v] of Object.entries(settingsToVars(s))) {
      root.style.setProperty(k, v);
    }
    root.setAttribute("data-cbt", "on");
    if (s.textEnabled) root.setAttribute("data-cbt-text", "on");
    else root.removeAttribute("data-cbt-text");
  }

  const stored = await chrome.storage.sync.get(STORAGE_KEY);
  apply(stored[STORAGE_KEY]);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes[STORAGE_KEY]) {
      apply(changes[STORAGE_KEY].newValue);
    }
  });
})();
