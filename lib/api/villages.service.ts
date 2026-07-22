import { apiFetch } from "@/lib/api/client";
import { villageDataSource } from "@/lib/api/entity-capabilities";
import { toRenderableImageUrl } from "@/lib/image-url";
import type { Village } from "@/lib/types";

type ApiVillage = {
  data_source?: unknown;
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
    dataSource: villageDataSource(id, slug || undefined, village.data_source),
    id,
    slug: slug || undefined,
    name,
    province: asString(village.province, "Sin provincia"),
    region: asString(village.region, "Sin región"),
    population: asNumber(village.population),
    image:
      toRenderableImageUrl(village.image_url) ??
      toRenderableImageUrl(village.image),
    bannerImage: toRenderableImageUrl(village.banner_url),
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
  return getVillagesStrict(token);
}

/** Canonical strict fetch retained as an explicit name for existing callers. */
export async function getVillagesStrict(token?: string) {
  const response = await apiFetch<ApiCollection<ApiVillage>>("/api/v1/villages?limit=100", {
    token,
  });

  return adaptVillages(response);
}

export async function getVillageById(id: string) {
  return getVillageByIdStrict(id);
}

export async function getVillageByIdStrict(id: string, token?: string) {
  const response = await apiFetch<ApiVillage>(
    `/api/v1/villages/${encodeURIComponent(id)}`,
    { token },
  );

  return adaptVillage(response) ?? undefined;
}

export async function followVillage(idOrSlug: string, token: string) {
  return apiFetch<{ followed?: boolean; is_following?: boolean; message?: string }>(
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
  return apiFetch<{ followed?: boolean; is_following?: boolean; message?: string }>(
    `/api/v1/villages/${encodeURIComponent(idOrSlug)}/follow`,
    {
      method: "DELETE",
      token,
    },
  );
}
