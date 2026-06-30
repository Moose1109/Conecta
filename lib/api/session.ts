export const AUTH_TOKEN_KEY = "conecta_token";
export const AUTH_USER_KEY = "conecta_user";

export function getStoredToken() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return (
    window.localStorage.getItem(AUTH_TOKEN_KEY) ??
    window.localStorage.getItem("conecta-pueblos-token") ??
    undefined
  );
}

export function saveSession({ token, user }: { token?: string; user?: unknown }) {
  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    window.localStorage.setItem("conecta-pueblos-token", token);
  }

  if (user) {
    const serializedUser = JSON.stringify(user);
    window.localStorage.setItem(AUTH_USER_KEY, serializedUser);
    window.localStorage.setItem("conecta-pueblos-user", serializedUser);
  }
}
