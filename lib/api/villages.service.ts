import { apiFetch, hasApiBaseUrl } from "@/lib/api/client";
import type { Village } from "@/lib/types";

type ApiVillage = {
  id?: unknown;
  slug?: unknown;
  name?: unknown;
  province?: unknown;
  region?: unknown;
  population?: unknown;
  image?: unknown;
  image_url?: unknown;
  banner_url?: unknown;
  tagline?: unknown;
  description?: unknown;
  highlights?: unknown;
  followers_count?: unknown;
  activities_count?: unknown;
  posts_count?: unknown;
  stats?: {
    followers_count?: unknown;
    activities_count?: unknown;
    posts_count?: unknown;
  };
  is_following?: unknown;
  followed_by_me?: unknown;
};

type ApiCollection<T> = T[] | { items?: T[] };

export type CreateVillagePayload = {
  name: string;
  slug: string;
  province: string;
  region: string;
  population?: number | null;
  tagline?: string | null;
  description?: string | null;
  image_url?: string | null;
  banner_url?: string | null;
  highlights?: string[] | null;
};

function collectionItems<T>(response: ApiCollection<T>): T[] {
  return Array.isArray(response) ? response : response.items ?? [];
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asOptionalString(value: unknown) {
  const text = asString(value);
  return text || undefined;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown) {
  return typeof value === "boolean" ? value : undefined;
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function adaptVillage(village: ApiVillage): Village | null {
  const slug = asString(village.slug);
  const id = asString(village.id, slug);
  const name = asString(village.name);

  if (!id || !name) {
    return null;
  }

  const stats = village.stats;

  return {
    id,
    slug: slug || undefined,
    name,
    province: asString(village.province, "Sin provincia"),
    region: asString(village.region, "Sin región"),
    population: asNumber(village.population),
    image: asOptionalString(village.image_url) ?? asOptionalString(village.image),
    bannerImage: asString(village.banner_url) || undefined,
    tagline: asString(village.tagline),
    description: asString(village.description),
    highlights: asStringArray(village.highlights),
    followersCount: asNumber(village.followers_count, asNumber(stats?.followers_count)),
    activitiesCount: asNumber(village.activities_count, asNumber(stats?.activities_count)),
    postsCount: asNumber(village.posts_count, asNumber(stats?.posts_count)),
    isFollowing: asBoolean(village.is_following) ?? asBoolean(village.followed_by_me),
  };
}

function adaptVillages(response: ApiCollection<ApiVillage>) {
  return collectionItems(response)
    .map(adaptVillage)
    .filter((village): village is Village => Boolean(village));
}

export async function getVillages(token?: string) {
  if (!hasApiBaseUrl()) {
    return [];
  }

  try {
    const response = await apiFetch<ApiCollection<ApiVillage>>("/api/v1/villages", {
      token,
    });
    return adaptVillages(response);
  } catch (error) {
    console.error("Error loading villages from API:", error);
    return [];
  }
}

export async function getVillageById(id: string) {
  if (!hasApiBaseUrl()) {
    return undefined;
  }

  try {
    const response = await apiFetch<ApiVillage>(`/api/v1/villages/${encodeURIComponent(id)}`);
    return adaptVillage(response) ?? undefined;
  } catch (error) {
    console.error("Error loading village from API:", error);
    return undefined;
  }
}

export async function followVillage(idOrSlug: string, token: string) {
  return apiFetch<{ followed?: boolean; message?: string }>(
    `/api/v1/villages/${encodeURIComponent(idOrSlug)}/follow`,
    {
      method: "POST",
      token,
    },
  );
}

export async function createVillage(payload: CreateVillagePayload, token: string) {
  return apiFetch<ApiVillage>("/api/v1/villages", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function unfollowVillage(idOrSlug: string, token: string) {
  return apiFetch<{ followed?: boolean; message?: string }>(
    `/api/v1/villages/${encodeURIComponent(idOrSlug)}/follow`,
    {
      method: "DELETE",
      token,
    },
  );
}
