/**
 * Single funnel for client-side error reporting.
 *
 * No error-tracking provider is configured for this project, so by default this only logs to the
 * console — deliberately NOT a no-op stub that pretends to work. Wiring a real provider is a
 * one-file change: install its SDK, initialise it in `initErrorReporting`, and forward to it in
 * `reportError`. Everything else in the app already calls through here.
 *
 * To enable (example, Sentry):
 *   1. npm install @sentry/react
 *   2. set VITE_SENTRY_DSN in the environment
 *   3. import * as Sentry from "@sentry/react" and fill in the two marked spots below
 */

const dsn = import.meta.env.VITE_SENTRY_DSN;

export const isErrorReportingEnabled = Boolean(dsn);

export function initErrorReporting() {
  if (!isErrorReportingEnabled) {
    return;
  }

  // Sentry.init({ dsn, environment: import.meta.env.MODE, tracesSampleRate: 0.1 });
  console.info("Error reporting DSN detected but no provider SDK is wired up yet.");
}

export function reportError(error, context = {}) {
  if (!isErrorReportingEnabled) {
    console.error("[error-reporting disabled]", error, context);
    return;
  }

  // Sentry.captureException(error, { extra: context });
  console.error("[error-reporting]", error, context);
}

/**
 * Catches errors that escape React entirely — async failures and unhandled promise rejections,
 * which an ErrorBoundary cannot see.
 */
export function installGlobalErrorHandlers() {
  window.addEventListener("error", (event) => {
    reportError(event.error ?? new Error(event.message), { source: "window.onerror" });
  });

  window.addEventListener("unhandledrejection", (event) => {
    reportError(event.reason ?? new Error("Unhandled promise rejection"), { source: "unhandledrejection" });
  });
}
