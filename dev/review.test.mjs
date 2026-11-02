// Sanity checks for the rating-request policy. Run: node dev/review.test.mjs
import assert from "node:assert/strict";
import {
  REVIEW_AFTER_MS,
  REVIEW_LATER_MS,
  REVIEW_MAX_LATER,
  isReviewDue,
  nextReview,
} from "../review.js";

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log(`ok  ${name}`);
};

const T0 = 1_000_000;

test("first ask happens 24h after first open, not before", () => {
  assert.equal(isReviewDue(T0, T0, undefined), false);
  assert.equal(isReviewDue(T0 + REVIEW_AFTER_MS - 1, T0, undefined), false);
  assert.equal(isReviewDue(T0 + REVIEW_AFTER_MS, T0, undefined), true);
});

test("rate and never end the asking for good", () => {
  for (const answer of ["rate", "never"]) {
    const r = nextReview(undefined, answer, T0);
    assert.deepEqual(r, { status: "done" });
    assert.equal(isReviewDue(T0 + 99 * REVIEW_AFTER_MS, T0, r), false);
  }
});

test("later waits REVIEW_LATER_MS, then asks again", () => {
  const now = T0 + REVIEW_AFTER_MS;
  const r = nextReview(undefined, "later", now);
  assert.equal(r.status, "active");
  assert.equal(r.laterCount, 1);
  assert.equal(isReviewDue(now + REVIEW_LATER_MS - 1, T0, r), false);
  assert.equal(isReviewDue(now + REVIEW_LATER_MS, T0, r), true);
});

test("later is allowed REVIEW_MAX_LATER - 1 times, the last one ends it", () => {
  let r;
  for (let i = 1; i < REVIEW_MAX_LATER; i++) {
    r = nextReview(r, "later", T0);
    assert.equal(r.status, "active");
  }
  assert.deepEqual(nextReview(r, "later", T0), { status: "done" });
});

test("unreadable or unrecognised data never asks (fail safe)", () => {
  assert.equal(isReviewDue(NaN, T0, undefined), false);
  assert.equal(isReviewDue(T0 + REVIEW_AFTER_MS, undefined, undefined), false);
  assert.equal(isReviewDue(T0 + REVIEW_AFTER_MS, "1000000", undefined), false);
  assert.equal(isReviewDue(T0 + REVIEW_AFTER_MS, T0, { status: "weird" }), false);
  assert.equal(isReviewDue(T0 + 99 * REVIEW_AFTER_MS, T0, { status: "active" }), false);
});

test("a firstSeen in the future (clock skew) does not ask", () => {
  assert.equal(isReviewDue(T0, T0 + 10 * REVIEW_AFTER_MS, undefined), false);
});

console.log(`\n${passed} passed`);
