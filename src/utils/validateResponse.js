/**
 * src/utils/validateResponse.js
 *
 * Validates and normalises a raw backend response before it reaches the Dashboard.
 * Every field gets a typed default so the Dashboard never receives undefined/null
 * in places it doesn't expect them, and will never crash on a malformed payload.
 */

// ---------------------------------------------------------------------------
// Field-level helpers
// ---------------------------------------------------------------------------

/** Safely coerce a value to a non-negative integer, falling back to `def`. */
function safeInt(value, def = 0) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n >= 0 ? n : def;
}

/** Safely coerce a value to a string, trimming whitespace, falling back to `def`. */
function safeStr(value, def = "") {
  if (typeof value === "string" && value.trim().length > 0) return value.trim();
  return def;
}

/** Ensure a value is an array; return [] otherwise. */
function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

// ---------------------------------------------------------------------------
// Section validators
// ---------------------------------------------------------------------------

/**
 * Validate `repository_summary` sub-object.
 * @param {unknown} raw
 * @returns {{ repo_name: string, total_commits: number, contributors: number, most_modified_module: string }}
 */
function validateRepositorySummary(raw) {
  const src = raw && typeof raw === "object" ? raw : {};
  return {
    repo_name: safeStr(src.repo_name, "Unknown Repository"),
    total_commits: safeInt(src.total_commits, 0),
    contributors: safeInt(src.contributors, 0),
    most_modified_module: safeStr(src.most_modified_module, ""),
  };
}

/**
 * Validate `risk_assessment` sub-object.
 * @param {unknown} raw
 * @returns {{ score: number, level: string }}
 */
function validateRiskAssessment(raw) {
  const src = raw && typeof raw === "object" ? raw : {};
  const score = Math.min(100, Math.max(0, safeInt(src.score, 0)));
  const level = safeStr(src.level, "Low");
  return { score, level };
}

/**
 * Validate a single timeline entry.
 * @param {unknown} item
 * @returns {{ date: string, commits: number }}
 */
function validateTimelineItem(item) {
  const src = item && typeof item === "object" ? item : {};
  return {
    date: safeStr(src.date, ""),
    commits: safeInt(src.commits, 1),
  };
}

/**
 * Validate a single hotspot entry.
 * @param {unknown} item
 * @returns {{ module?: string, file?: string, path?: string }}
 */
function validateHotspotItem(item) {
  if (!item || typeof item !== "object") return { module: "unknown" };
  return { ...item };
}

/**
 * Validate a single failure pattern entry.
 * @param {unknown} item
 * @returns {object}
 */
function validatePatternItem(item) {
  if (!item || typeof item !== "object") return { title: "Unknown pattern" };
  return {
    title: safeStr(item.title ?? item.pattern, "Recurring failure pattern"),
    severity: safeStr(item.severity, "medium"),
    occurrences: safeInt(item.occurrences, 1),
    lastSeen: safeStr(item.lastSeen, "recently"),
    description: safeStr(
      item.description ?? item.evidence,
      "A recurring issue was detected in this repository.",
    ),
    files: safeArray(item.files),
    suggestedFix: safeStr(
      item.suggestedFix,
      "Review and add regression tests for this pattern.",
    ),
  };
}

/**
 * Validate a single blind spot entry.
 * @param {unknown} item
 * @returns {string}
 */
function validateBlindSpotItem(item) {
  if (typeof item === "string" && item.trim().length > 0) return item.trim();
  if (item && typeof item === "object") {
    return safeStr(item.description ?? item.area, "Coverage gap identified");
  }
  return "Coverage gap identified";
}

/**
 * Validate a single code review rule entry.
 * @param {unknown} item
 * @returns {string}
 */
function validateCodeReviewRuleItem(item) {
  if (typeof item === "string" && item.trim().length > 0) return item.trim();
  if (item && typeof item === "object") {
    return safeStr(
      item.description ?? item.rule ?? item.title,
      "Apply code review safeguard",
    );
  }
  return "Apply code review safeguard";
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------

/**
 * Validate the full raw API response and return a safe, normalised object.
 *
 * If a top-level field is missing or the wrong type, sensible defaults are
 * provided so the Dashboard never crashes on unexpected backend output.
 *
 * @param {unknown} raw - Raw JSON from the backend `/api/analyze` endpoint
 * @returns {{
 *   repository_summary: object,
 *   risk_assessment: object,
 *   timeline: object[],
 *   hotspots: object[],
 *   failure_patterns: object[],
 *   blind_spots: string[],
 *   code_review_rules: string[],
 * }}
 */
export function validateResponse(raw) {
  const src = raw && typeof raw === "object" ? raw : {};

  return {
    repository_summary: validateRepositorySummary(src.repository_summary),
    risk_assessment: validateRiskAssessment(src.risk_assessment),
    timeline: safeArray(src.timeline).map(validateTimelineItem),
    hotspots: safeArray(src.hotspots).map(validateHotspotItem),
    failure_patterns: safeArray(src.failure_patterns).map(validatePatternItem),
    blind_spots: safeArray(src.blind_spots).map(validateBlindSpotItem),
    code_review_rules: safeArray(src.code_review_rules).map(
      validateCodeReviewRuleItem,
    ),
  };
}
