import type { AuthUser } from "@/lib/types";

export const AUTH_TOKEN_KEY = "conecta_token";
export const AUTH_USER_KEY = "conecta_user";
export const AUTH_SESSION_EVENT = "conecta-session-change";

function decodeJwtJsonSegment(segment: string) {
  const padding = "=".repeat((4 - (segment.length % 4)) % 4);
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/") + padding;

  return JSON.parse(atob(base64)) as unknown;
}

export function hasValidJwtStructure(token: string) {
  const segments = token.split(".");

  if (
    segments.length !== 3 ||
    segments.some((segment) => !segment || !/^[A-Za-z0-9_-]+$/.test(segment))
  ) {
    return false;
  }

  try {
    const header = decodeJwtJsonSegment(segments[0]);
    const payload = decodeJwtJsonSegment(segments[1]);

    return (
      typeof header === "object" &&
      header !== null &&
      typeof (header as { alg?: unknown }).alg === "string" &&
      typeof payload === "object" &&
      payload !== null
    );
  } catch {
    return false;
  }
}

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

    if (!user) {
      window.localStorage.removeItem(AUTH_USER_KEY);
      window.localStorage.removeItem("conecta-pueblos-user");
    }
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
