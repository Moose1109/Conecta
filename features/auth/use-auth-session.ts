"use client";

import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import {
  AUTH_SESSION_EVENT,
  getStoredToken,
  getStoredUser,
} from "@/lib/api/session";
import {
  ensureSessionVerified,
  getSessionVerificationStatus,
  type SessionVerificationStatus,
} from "@/features/auth/session-verification";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(AUTH_SESSION_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(AUTH_SESSION_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  const token = getStoredToken();

  return JSON.stringify({
    token,
    user: getStoredUser(),
    status: getSessionVerificationStatus(token),
  });
}

function getServerSnapshot() {
  return JSON.stringify({
    token: undefined,
    user: undefined,
    status: "none" as SessionVerificationStatus,
  });
}

export function useAuthSession() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const parsed = JSON.parse(snapshot) as {
    token?: string;
    user?: ReturnType<typeof getStoredUser>;
    status: SessionVerificationStatus;
  };

  useEffect(() => {
    ensureSessionVerified(parsed.token);
  }, [parsed.token]);

  return parsed;
}
