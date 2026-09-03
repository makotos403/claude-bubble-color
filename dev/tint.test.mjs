// Pure-logic checks for defaults.js (no chrome, no DOM). Run: node dev/tint.test.mjs
import assert from "node:assert/strict";
import { DEFAULT_SETTINGS, normalize, settingsToVars } from "../defaults.js";

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log(`ok  ${name}`);
};

test("normalize fills missing keys from defaults", () => {
  const s = normalize({ bgColor: "#000000" });
  assert.equal(s.bgColor, "#000000");
  assert.equal(s.enabled, DEFAULT_SETTINGS.enabled);
  assert.equal(s.language, "auto");
});

test("normalize tolerates null / undefined", () => {
  assert.deepEqual(normalize(null), DEFAULT_SETTINGS);
  assert.deepEqual(normalize(undefined), DEFAULT_SETTINGS);
});

test("settingsToVars: defaults -> full opaque fill, no accent, no text override", () => {
  const v = settingsToVars({});
  assert.equal(v["--cbt-bg"], "#FFF1C1");
  assert.equal(v["--cbt-bg-alpha"], "1");
  assert.equal(v["--cbt-radius"], "14px");
  assert.equal(v["--cbt-text"], "inherit");
  assert.equal(v["--cbt-accent"], "transparent");
  assert.equal(v["--cbt-accent-width"], "0px");
});

test("settingsToVars: accent + text only surface when their toggle is on", () => {
  const off = settingsToVars({ accentColor: "#123456", textColor: "#abcdef" });
  assert.equal(off["--cbt-accent"], "transparent");
  assert.equal(off["--cbt-text"], "inherit");

  const on = settingsToVars({
    accentEnabled: true,
    accentColor: "#123456",
    accentWidth: 5,
    textEnabled: true,
    textColor: "#abcdef",
  });
  assert.equal(on["--cbt-accent"], "#123456");
  assert.equal(on["--cbt-accent-width"], "5px");
  assert.equal(on["--cbt-text"], "#abcdef");
});

test("settingsToVars: out-of-range numbers are clamped", () => {
  assert.equal(settingsToVars({ bgOpacity: 5 })["--cbt-bg-alpha"], "1");
  assert.equal(settingsToVars({ bgOpacity: -2 })["--cbt-bg-alpha"], "0");
  assert.equal(settingsToVars({ radius: 999 })["--cbt-radius"], "40px");
  assert.equal(
    settingsToVars({ accentEnabled: true, accentWidth: 99 })["--cbt-accent-width"],
    "12px",
  );
});

test("settingsToVars: garbage numbers fall back instead of producing NaN", () => {
  assert.equal(settingsToVars({ bgOpacity: "oops" })["--cbt-bg-alpha"], "1");
  assert.equal(settingsToVars({ radius: null })["--cbt-radius"], "14px");
  assert.equal(settingsToVars({ radius: "" })["--cbt-radius"], "14px");
});

console.log(`\n${passed} passed`);
