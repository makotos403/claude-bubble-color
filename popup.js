// Popup: edits the settings object, mirrors it into the live preview, and
// persists to chrome.storage.sync (debounced). content.js on any open claude.ai
// tab picks the change up via storage.onChanged — no reload needed.

import {
  STORAGE_KEY,
  DEFAULT_SETTINGS,
  PRESETS,
  normalize,
  settingsToVars,
} from "./defaults.js";
import { resolveLang, loadMessages, makeT } from "./i18n.js";
import { REVIEW_URL, isReviewDue, nextReview } from "./review.js";

const $ = (id) => document.getElementById(id);
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

let settings = { ...DEFAULT_SETTINGS };
let t = (k) => k;
let saveTimer = null;

/** Static text nodes: element id -> dictionary key. */
const TEXT = {
  "app-title": "app.name",
  tagline: "app.tagline",
  "h-presets": "section.presets",
  "h-bg": "section.background",
  "l-bgColor": "label.bgColor",
  "l-opacity": "label.opacity",
  "l-radius": "label.radius",
  "l-accentToggle": "label.accentToggle",
  "l-accentColor": "label.accentColor",
  "l-accentWidth": "label.accentWidth",
  "l-textToggle": "label.textToggle",
  "l-textColor": "label.textColor",
  "h-language": "section.language",
  "o-lang-auto": "lang.auto",
  "o-lang-ja": "lang.ja",
  "o-lang-en": "lang.en",
  note: "note.autosave",
};

// --- persistence ---

function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    chrome.storage.sync.set({ [STORAGE_KEY]: settings });
  }, 200);
}

// --- rendering ---

function applyPreview() {
  const el = $("preview");
  const vars = settingsToVars(settings);
  for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
  el.toggleAttribute("data-cbt", settings.enabled);
}

function render() {
  $("enabled").checked = settings.enabled;

  $("bgColor").value = settings.bgColor;
  $("bgColorHex").value = settings.bgColor.toUpperCase();

  const pct = Math.round(settings.bgOpacity * 100);
  $("bgOpacity").value = pct;
  $("v-opacity").textContent = t("value.percent", { n: pct });

  $("radius").value = settings.radius;
  $("v-radius").textContent = t("value.px", { n: settings.radius });

  $("accentEnabled").checked = settings.accentEnabled;
  $("accent-fields").disabled = !settings.accentEnabled;
  $("accentColor").value = settings.accentColor;
  $("accentColorHex").value = settings.accentColor.toUpperCase();
  $("accentWidth").value = settings.accentWidth;
  $("v-accentWidth").textContent = t("value.px", { n: settings.accentWidth });

  $("textEnabled").checked = settings.textEnabled;
  $("text-fields").disabled = !settings.textEnabled;
  $("textColor").value = settings.textColor;
  $("textColorHex").value = settings.textColor.toUpperCase();

  for (const r of document.querySelectorAll('input[name="lang"]')) {
    r.checked = r.value === settings.language;
  }

  for (const b of document.querySelectorAll(".swatch")) {
    b.classList.toggle(
      "is-active",
      b.dataset.bg.toLowerCase() === settings.bgColor.toLowerCase(),
    );
  }

  applyPreview();
}

async function localize() {
  const lang = resolveLang(settings.language);
  document.documentElement.lang = lang;
  t = makeT(await loadMessages(lang));

  for (const [id, key] of Object.entries(TEXT)) {
    const node = $(id);
    if (node) node.textContent = t(key);
  }
  $("review-title").textContent = t("review.title");
  $("review-body").textContent = t("review.body");
  $("review-rate").textContent = t("review.rate");
  $("review-later").textContent = t("review.later");
  $("review-never").textContent = t("review.never");
  $("rate-link").textContent = t("settings.rateLink");
  $("pv-user").textContent = t("preview.you");
  $("pv-claude").textContent = t("preview.claude");
  for (const b of document.querySelectorAll(".swatch")) {
    b.title = t(`preset.${b.dataset.id}`);
  }
}

// --- rating request (see review.js for the policy) ---

// Set once the user answers; even if saving failed we never ask again this session.
let reviewAnswered = false;

async function loadReview() {
  const { review } = await chrome.storage.local.get("review");
  return review;
}

// The clock starts at the first popup open, so nobody is asked on that open.
// Any storage error means "stay hidden".
async function renderReview() {
  let show = false;
  try {
    const { firstSeen, review } = await chrome.storage.local.get([
      "firstSeen",
      "review",
    ]);
    if (firstSeen === undefined) {
      await chrome.storage.local.set({ firstSeen: Date.now() });
    } else {
      show = !reviewAnswered && isReviewDue(Date.now(), firstSeen, review);
    }
  } catch (_) {
    show = false;
  }
  $("review").hidden = !show;
}

// Hide first, then record the choice; a failed write must not block the user.
async function answerReview(answer) {
  reviewAnswered = true;
  $("review").hidden = true;
  try {
    await chrome.storage.local.set({
      review: nextReview(await loadReview(), answer, Date.now()),
    });
  } catch (_) {
    /* not saved: the next popup may ask once more, this one will not */
  }
}

function wireReview() {
  const rate = async (e) => {
    e.preventDefault(); // record the answer first; the new tab would close the popup
    await answerReview("rate");
    chrome.tabs.create({ url: REVIEW_URL });
  };
  $("review-rate").href = REVIEW_URL;
  $("rate-link").href = REVIEW_URL;
  $("review-rate").addEventListener("click", rate);
  $("rate-link").addEventListener("click", rate);
  $("review-later").addEventListener("click", () => answerReview("later"));
  $("review-never").addEventListener("click", () => answerReview("never"));
}

// --- wiring ---

function buildSwatches() {
  const host = $("swatches");
  for (const p of PRESETS) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "swatch";
    b.dataset.id = p.id;
    b.dataset.bg = p.bg;
    b.style.background = p.bg;
    b.addEventListener("click", () => {
      settings.bgColor = p.bg.toUpperCase();
      settings.accentColor = p.accent.toUpperCase();
      render();
      save();
    });
    host.append(b);
  }
}

function bindColorPair(colorId, hexId, key) {
  const color = $(colorId);
  const hex = $(hexId);
  color.addEventListener("input", () => {
    settings[key] = color.value.toUpperCase();
    render();
    save();
  });
  hex.addEventListener("input", () => {
    if (!HEX_RE.test(hex.value)) return;
    settings[key] = hex.value.toUpperCase();
    render();
    save();
  });
}

function bindRange(id, key, transform = (v) => v) {
  $(id).addEventListener("input", (e) => {
    settings[key] = transform(Number(e.target.value));
    render();
    save();
  });
}

function bindCheck(id, key) {
  $(id).addEventListener("change", (e) => {
    settings[key] = e.target.checked;
    render();
    save();
  });
}

function wire() {
  bindCheck("enabled", "enabled");
  bindCheck("accentEnabled", "accentEnabled");
  bindCheck("textEnabled", "textEnabled");

  bindColorPair("bgColor", "bgColorHex", "bgColor");
  bindColorPair("accentColor", "accentColorHex", "accentColor");
  bindColorPair("textColor", "textColorHex", "textColor");

  bindRange("bgOpacity", "bgOpacity", (v) => v / 100);
  bindRange("radius", "radius");
  bindRange("accentWidth", "accentWidth");

  for (const r of document.querySelectorAll('input[name="lang"]')) {
    r.addEventListener("change", async () => {
      settings.language = r.value;
      save();
      await localize();
      render();
    });
  }
}

// react to edits from another device / window
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync" || !changes[STORAGE_KEY]) return;
  const incoming = normalize(changes[STORAGE_KEY].newValue);
  if (JSON.stringify(incoming) === JSON.stringify(settings)) return;
  settings = incoming;
  localize().then(render);
});

// --- boot ---

(async () => {
  const stored = await chrome.storage.sync.get(STORAGE_KEY);
  settings = normalize(stored[STORAGE_KEY]);
  buildSwatches();
  wire();
  wireReview();
  await localize();
  render();
  await renderReview();
})();
