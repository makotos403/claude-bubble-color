// Pure logic for the "please rate us" request. No chrome.* calls so it stays testable.
//
// Two records in chrome.storage.local:
//   firstSeen  ms timestamp of the first popup open (the clock starts there,
//              so a fresh install, or an existing user right after updating,
//              is never asked on first open)
//   review     the user's answer:
//     undefined                                  never answered
//     { status: "active", laterCount, nextAt }   "later" was pressed (laterCount times)
//     { status: "done" }                         rated / "don't show again" / "later" used up
// Anything unreadable or unrecognised means "do not ask" (fail safe).

export const REVIEW_URL =
  "https://chromewebstore.google.com/detail/opfoggpkdjfghmpihdkdbclnfhehmcgh/reviews";

const DAY = 24 * 60 * 60 * 1000;
/** Time after the first popup open before the first ask. */
export const REVIEW_AFTER_MS = DAY;
/** Wait after "later" before asking again. */
export const REVIEW_LATER_MS = 5 * DAY;
/** Presses of "later" that end the asking for good. */
export const REVIEW_MAX_LATER = 2;

/** Should the request show now? */
export function isReviewDue(now, firstSeen, review) {
  if (!Number.isFinite(now) || !Number.isFinite(firstSeen)) return false;
  const earliest = firstSeen + REVIEW_AFTER_MS;
  if (review == null) return now >= earliest;
  if (review.status !== "active" || !Number.isFinite(review.nextAt)) return false;
  return now >= Math.max(earliest, review.nextAt);
}

/** The record to store after an answer: "rate" | "later" | "never". */
export function nextReview(review, answer, now) {
  if (answer === "later") {
    const laterCount = (review?.laterCount ?? 0) + 1;
    if (laterCount >= REVIEW_MAX_LATER) return { status: "done" };
    return { status: "active", laterCount, nextAt: now + REVIEW_LATER_MS };
  }
  return { status: "done" }; // "rate", "never" (and anything unexpected)
}
