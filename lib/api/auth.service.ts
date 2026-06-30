import type { MockUser } from "@/lib/types";
import { apiFetch } from "@/lib/api/client";

export type RegisterPayload = {
  name: string;
  username?: string;
  email: string;
  password: string;
  favorite_village_id?: string;
};

export type AuthResponse = {
  access_token?: string;
  token?: string;
  token_type?: string;
  user?: unknown;
};

export const currentUserMock: MockUser = {
  id: "ana-morales",
  name: "Ana Morales",
  email: "ana@pueblo.es",
  handle: "@ana.conecta",
  role: "Vecina colaboradora",
  location: "Barcelona",
  avatar: "AM",
  banner:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
  favoriteVillageId: "rupit",
  interests: ["Naturaleza", "Mercados", "Cultura"],
  stats: {
    activities: 3,
    posts: 8,
    followedVillages: 5,
  },
};

export function loginMock() {
  return { user: currentUserMock, token: "mock-token-conecta-pueblos" };
}

export function registerMock() {
  return { user: currentUserMock, token: "mock-token-conecta-pueblos" };
}

export function getCurrentUserMock() {
  return currentUserMock;
}

export async function registerUser(payload: RegisterPayload) {
  return apiFetch<AuthResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
