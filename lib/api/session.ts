import type { AuthUser } from "@/lib/types";

export const AUTH_TOKEN_KEY = "conecta_token";
export const AUTH_USER_KEY = "conecta_user";
export const AUTH_SESSION_EVENT = "conecta-session-change";

export function getStoredToken() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY) ?? undefined;
}

export function getStoredUser() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const serializedUser = window.localStorage.getItem(AUTH_USER_KEY);

  if (!serializedUser) {
    return undefined;
  }

  try {
    return JSON.parse(serializedUser) as AuthUser;
  } catch {
    return undefined;
  }
}

function notifySessionChanged() {
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function saveSession({ token, user }: { token?: string; user?: AuthUser }) {
  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    window.localStorage.removeItem("conecta-pueblos-token");
  }

  if (user) {
    const serializedUser = JSON.stringify(user);
    window.localStorage.setItem(AUTH_USER_KEY, serializedUser);
    window.localStorage.removeItem("conecta-pueblos-user");
  }

  notifySessionChanged();
}

export function clearSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.localStorage.removeItem("conecta-pueblos-token");
  window.localStorage.removeItem("conecta-pueblos-user");
  notifySessionChanged();
}
