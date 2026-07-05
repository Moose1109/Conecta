"use client";

import { useSyncExternalStore } from "react";
import {
  AUTH_SESSION_EVENT,
  getStoredToken,
  getStoredUser,
} from "@/lib/api/session";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(AUTH_SESSION_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(AUTH_SESSION_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  return JSON.stringify({
    token: getStoredToken(),
    user: getStoredUser(),
  });
}

function getServerSnapshot() {
  return JSON.stringify({
    token: undefined,
    user: undefined,
  });
}

export function useAuthSession() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return JSON.parse(snapshot) as {
    token?: string;
    user?: ReturnType<typeof getStoredUser>;
  };
}
