import type { AuthUser } from "@/lib/types";
import { apiFetch } from "@/lib/api/client";

export type RegisterPayload = {
  name: string;
  username?: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  access_token?: string;
  token?: string;
  token_type?: string;
  user?: AuthUser;
};

type ApiUser = {
  id?: unknown;
  name?: unknown;
  email?: unknown;
  username?: unknown;
  avatar_url?: unknown;
  banner_url?: unknown;
  bio?: unknown;
  role?: unknown;
  favorite_village_id?: unknown;
  created_at?: unknown;
};

type ApiAuthResponse = {
  access_token?: unknown;
  token?: unknown;
  token_type?: unknown;
  user?: ApiUser | null;
};

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function adaptUser(user: unknown): AuthUser | undefined {
  if (!user || typeof user !== "object") {
    return undefined;
  }

  const rawUser = user as ApiUser;
  const id = asString(rawUser.id);
  const name = asString(rawUser.name, asString(rawUser.username, "Usuario"));

  if (!id) {
    return undefined;
  }

  return {
    id,
    name,
    email: asString(rawUser.email) || undefined,
    username: asString(rawUser.username) || undefined,
    avatarUrl: asString(rawUser.avatar_url) || undefined,
    bannerUrl: asString(rawUser.banner_url) || undefined,
    bio: asString(rawUser.bio) || undefined,
    role: asString(rawUser.role) || undefined,
    favoriteVillageId: asString(rawUser.favorite_village_id) || null,
    createdAt: asString(rawUser.created_at) || undefined,
  };
}

function adaptAuthResponse(response: ApiAuthResponse): AuthResponse {
  const accessToken = asString(response.access_token) || undefined;
  const token = asString(response.token) || undefined;

  return {
    access_token: accessToken,
    token,
    token_type: asString(response.token_type) || undefined,
    user: adaptUser(response.user),
  };
}

export async function registerUser(payload: RegisterPayload) {
  const response = await apiFetch<ApiAuthResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return adaptAuthResponse(response);
}

export async function loginUser(payload: LoginPayload) {
  const response = await apiFetch<ApiAuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return adaptAuthResponse(response);
}

export async function getCurrentUser(token: string) {
  const response = await apiFetch<ApiUser>("/api/v1/auth/me", {
    token,
  });

  return adaptUser(response);
}
