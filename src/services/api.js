/**
 * src/services/api.js
 *
 * Central API service for GitPostmortem.
 * All network communication lives here — components call analyzeRepository()
 * and receive a typed { data } | { error } result. No fetch calls in components.
 */

/** Relative URL — works via the Vite dev proxy and production rewrites */
const API_BASE = import.meta.env.VITE_API_URL ?? "/api/analyze";

/** Request timeout in milliseconds (30 s) */
const REQUEST_TIMEOUT_MS = 30_000;

/** Maximum automatic retries on transient network errors */
const MAX_RETRIES = 1;

// ---------------------------------------------------------------------------
// Error classification
// ---------------------------------------------------------------------------

/**
 * Converts a raw error (fetch rejection, HTTP error, or custom flag) into a
 * human-readable string suitable for display in the UI.
 *
 * @param {unknown} error
 * @param {number|null} httpStatus
 * @returns {string}
 */
function classifyError(error, httpStatus = null) {
  // Offline
  if (!navigator.onLine) {
    return "You appear to be offline. Please check your internet connection and try again.";
  }

  // Explicit abort / timeout
  if (error?.name === "AbortError") {
    return "The analysis request timed out after 30 seconds. The repository may be too large or the backend is slow to respond. Please try again.";
  }

  // HTTP-level errors from the backend
  if (httpStatus !== null) {
    switch (httpStatus) {
      case 400:
        return "The repository URL is not valid. Please enter a URL in the format https://github.com/owner/repo.";
      case 401:
        return "Authentication failed. The backend GitHub token may be missing or expired.";
      case 403:
        return "GitHub API rate limit exceeded. Please wait a few minutes and try again, or add a GitHub token to the backend.";
      case 404:
        return "Repository not found. Please check that the repository exists and is publicly accessible.";
      case 422:
        return "The request was rejected by the backend. Please ensure the repository URL is correct.";
      case 429:
        return "Too many requests. The GitHub or Gemini API rate limit has been hit. Please wait a moment and try again.";
      case 500:
      case 502:
      case 503:
        return "The analysis backend returned an error. The Gemini API may be unavailable. Results have been estimated from repository data.";
      case 504:
        return "The backend gateway timed out. The analysis is taking longer than expected — please try again.";
      default:
        if (httpStatus >= 500) {
          return `The backend returned an unexpected error (HTTP ${httpStatus}). Please try again.`;
        }
        return `The request failed with status ${httpStatus}. Please check the repository URL and try again.`;
    }
  }

  // Network-level failure (backend unreachable)
  if (
    error?.message?.includes("Failed to fetch") ||
    error?.message?.includes("NetworkError") ||
    error?.message?.includes("ERR_CONNECTION_REFUSED")
  ) {
    return "Cannot reach the analysis backend. Please make sure the backend server is running on port 8000 (run: npm run dev:full).";
  }

  // Gemini-specific message forwarded from the backend
  if (error?.message?.toLowerCase().includes("gemini")) {
    return "The Gemini AI analysis failed. The dashboard will show estimated results from the repository data.";
  }

  return error?.message || "An unexpected error occurred. Please try again.";
}

// ---------------------------------------------------------------------------
// Core fetch helper
// ---------------------------------------------------------------------------

/**
 * Performs a single POST request to the analyze endpoint.
 *
 * @param {string} repoUrl
 * @param {AbortSignal} signal
 * @returns {Promise<{ data: object } | { error: string }>}
 */
async function fetchAnalysis(repoUrl, signal) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repoUrl: repoUrl.trim() }),
    signal,
  });

  let body = {};
  try {
    body = await response.json();
  } catch {
    // Non-JSON body — ignore, handled below
  }

  if (!response.ok) {
    const backendMessage = body?.detail || body?.message || null;
    const baseError = classifyError(
      backendMessage ? new Error(backendMessage) : null,
      response.status,
    );
    return { error: baseError };
  }

  return { data: body };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Analyze a GitHub repository.
 *
 * Features:
 * - 30-second request timeout (via AbortController)
 * - External AbortController support (caller can cancel mid-flight)
 * - Retries once on transient network errors (not on 4xx/5xx)
 * - Offline detection
 * - Human-readable error classification
 *
 * @param {string} repoUrl   - Full GitHub repository URL
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{ data: object } | { error: string }>}
 */
export async function analyzeRepository(repoUrl, options = {}) {
  if (!repoUrl?.trim()) {
    return { error: "Please enter a repository URL to begin analysis." };
  }

  if (!navigator.onLine) {
    return {
      error: "You appear to be offline. Please check your internet connection.",
    };
  }

  const externalSignal = options.signal ?? null;

  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    // Create a fresh timeout controller for each attempt
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(
      () => timeoutController.abort(),
      REQUEST_TIMEOUT_MS,
    );

    // Combine external signal + timeout signal
    const signals = [timeoutController.signal];
    if (externalSignal) signals.push(externalSignal);

    // Use the first signal to abort (simple combination without AbortSignal.any polyfill)
    const effectiveSignal =
      signals.length === 1
        ? signals[0]
        : (() => {
            const combined = new AbortController();
            for (const s of signals) {
              if (s.aborted) {
                combined.abort();
                break;
              }
              s.addEventListener("abort", () => combined.abort(), {
                once: true,
              });
            }
            return combined.signal;
          })();

    try {
      const result = await fetchAnalysis(repoUrl, effectiveSignal);
      clearTimeout(timeoutId);
      return result;
    } catch (err) {
      clearTimeout(timeoutId);

      // If the external caller cancelled, propagate immediately
      if (externalSignal?.aborted) {
        return { error: "Request cancelled." };
      }

      // Timeout: do not retry
      if (err.name === "AbortError") {
        return { error: classifyError(err, null) };
      }

      // Network error: retry once
      if (attempt < MAX_RETRIES) {
        attempt += 1;
        // Small back-off before retry
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      return { error: classifyError(err, null) };
    }
  }

  // Should never reach here
  return { error: "The analysis request failed. Please try again." };
}
