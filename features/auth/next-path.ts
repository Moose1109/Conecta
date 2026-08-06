/**
 * Shared helpers for the "return to where you were" behavior on
 * login/register. Only ever used for internal navigation — never sent
 * anywhere, never used to authorize anything server-side.
 */

const NEXT_PARAM = "next";

/** True for a same-origin, relative path we're willing to redirect back to. */
function isSafeInternalPath(value: string): boolean {
  if (!value.startsWith("/") || value.startsWith("//")) return false;
  if (value.includes("://")) return false;
  return true;
}

/**
 * Builds an href to `/login` or `/register` that preserves the visitor's
 * current location (pathname + query + hash) as a `next` param, so they can
 * return to it after authenticating. Omits the param entirely when the
 * current location is already an auth page, to avoid pointless loops.
 */
export function buildAuthHref(basePath: "/login" | "/register", returnTo?: string): string {
  if (!returnTo || returnTo === "/login" || returnTo === "/register" || !isSafeInternalPath(returnTo)) {
    return basePath;
  }

  return `${basePath}?${NEXT_PARAM}=${encodeURIComponent(returnTo)}`;
}

/** Resolves a `next` query value into a safe internal path, or `fallback` when absent/unsafe. */
export function resolveNextPath(rawNext: string | null | undefined, fallback = "/community"): string {
  if (!rawNext || !isSafeInternalPath(rawNext)) return fallback;
  return rawNext;
}
