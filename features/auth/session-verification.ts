"use client";

import { getCurrentUser } from "@/lib/api/auth.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { logApiIssue } from "@/lib/api/error-message";
import { AUTH_SESSION_EVENT, clearSession, saveSession } from "@/lib/api/session";

export type SessionVerificationStatus = "none" | "pending" | "verified" | "error";

type VerificationEntry = { status: "pending" | "verified" | "error" };

const verificationByToken = new Map<string, VerificationEntry>();

function notifyVerificationChanged() {
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function getSessionVerificationStatus(token: string | undefined): SessionVerificationStatus {
  if (!token) return "none";
  return verificationByToken.get(token)?.status ?? "pending";
}

/**
 * Ensures a cached token is confirmed against the backend at most once per
 * token during this app execution. Safe to call from every component that
 * reads the session (Navbar, UserMenu, AuthGate, ...): the module-level map
 * dedupes concurrent/duplicate calls into a single GET /users/me.
 */
export function ensureSessionVerified(token: string | undefined) {
  if (!token || typeof window === "undefined") return;
  if (verificationByToken.has(token)) return;

  verificationByToken.set(token, { status: "pending" });

  getCurrentUser(token)
    .then((currentUser) => {
      if (!currentUser) {
        verificationByToken.set(token, { status: "error" });
        notifyVerificationChanged();
        return;
      }

      verificationByToken.set(token, { status: "verified" });
      saveSession({ token, user: currentUser });
    })
    .catch((error) => {
      logApiIssue("Unable to verify the cached session", error);

      if (isUnauthorizedError(error)) {
        verificationByToken.delete(token);
        clearSession();
        return;
      }

      // Network/timeout/5xx/config errors are not proof the session is
      // invalid — keep the cached identity and let the caller offer a
      // manual retry instead of silently signing the user out.
      verificationByToken.set(token, { status: "error" });
      notifyVerificationChanged();
    });
}

/** Discards a stalled verification (network/timeout/5xx) so it can be retried. */
export function retrySessionVerification(token: string | undefined) {
  if (!token) return;
  verificationByToken.delete(token);
  ensureSessionVerified(token);
}

/** Marks a brand-new token as already verified right after login/register. */
export function markSessionVerified(token: string) {
  verificationByToken.set(token, { status: "verified" });
}
