import { getVillageById as getMockVillageById, villages } from "@/data/villages";
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
  const mockVillage = villages.find((item) => item.id === id || item.id === slug);

  return {
    id,
    slug: slug || undefined,
    name,
    province: asString(village.province, mockVillage?.province),
    region: asString(village.region, mockVillage?.region),
    population: asNumber(village.population, mockVillage?.population),
    image: asString(village.image_url, asString(village.image, mockVillage?.image)),
    bannerImage: asString(village.banner_url) || undefined,
    tagline: asString(village.tagline, mockVillage?.tagline),
    description: asString(village.description, mockVillage?.description),
    highlights: asStringArray(village.highlights).length
      ? asStringArray(village.highlights)
      : (mockVillage?.highlights ?? []),
    followersCount: asNumber(village.followers_count, asNumber(stats?.followers_count)),
    activitiesCount: asNumber(village.activities_count, asNumber(stats?.activities_count)),
    postsCount: asNumber(village.posts_count, asNumber(stats?.posts_count)),
    isFollowing: asBoolean(village.is_following) ?? asBoolean(village.followed_by_me),
  };
}

function adaptVillages(response: ApiCollection<ApiVillage>) {
  const adapted = collectionItems(response).map(adaptVillage).filter((village): village is Village => Boolean(village));

  if (!adapted.length) {
    throw new Error("API villages response did not include valid villages");
  }

  return adapted;
}

export async function getVillages() {
  if (!hasApiBaseUrl()) {
    return villages;
  }

  try {
    const response = await apiFetch<ApiCollection<ApiVillage>>("/api/v1/villages");
    return adaptVillages(response);
  } catch (error) {
    console.error("Error loading villages from API:", error);
    return villages;
  }
}

export async function getVillageById(id: string) {
  if (!hasApiBaseUrl()) {
    return getMockVillageById(id);
  }

  try {
    const response = await apiFetch<ApiVillage>(`/api/v1/villages/${encodeURIComponent(id)}`);
    return adaptVillage(response) ?? getMockVillageById(id);
  } catch (error) {
    console.error("Error loading village from API:", error);
    return getMockVillageById(id);
  }
}
