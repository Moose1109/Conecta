import { apiFetch } from "@/lib/api/client";
import { activityDataSource } from "@/lib/api/entity-capabilities";
import { toRenderableImageUrl } from "@/lib/image-url";
import type { Activity, ActivityCategory } from "@/lib/types";

const activityCategories: ActivityCategory[] = [
  "Naturaleza",
  "Cultura",
  "Gastronomía",
  "Deporte",
  "Música",
  "Voluntariado",
  "Mercados",
  "Fiestas locales",
  "Otra",
];

type ApiActivity = {
  data_source?: unknown;
  id?: unknown;
  slug?: unknown;
  title?: unknown;
  description?: unknown;
  category?: unknown;
  village_id?: unknown;
  villageId?: unknown;
  village?: {
    id?: unknown;
    slug?: unknown;
    name?: unknown;
  };
  village_name?: unknown;
  organizer?: {
    name?: unknown;
  };
  organizer_name?: unknown;
  image?: unknown;
  image_url?: unknown;
  banner_url?: unknown;
  starts_at?: unknown;
  date?: unknown;
  time?: unknown;
  location?: unknown;
  capacity?: unknown;
  spots?: unknown;
  spots_left?: unknown;
  participants_count?: unknown;
  is_joined?: unknown;
  joined_by_me?: unknown;
  is_saved?: unknown;
  saved_by_me?: unknown;
};

type ApiCollection<T> = T[] | { items?: T[] };

export type CreateActivityPayload = {
  slug: string;
  title: string;
  description: string;
  village_id: string;
  category: string;
  image_url?: string | null;
  starts_at: string;
  ends_at?: string | null;
  capacity: number;
  location: string;
  status?: string;
};

export type GetActivitiesOptions = {
  limit?: number;
  villageId?: string;
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

function asCategory(value: unknown): ActivityCategory {
  return activityCategories.includes(value as ActivityCategory)
    ? (value as ActivityCategory)
    : "Otra";
}

function splitDateTime(value: unknown, fallbackDate: unknown, fallbackTime: unknown) {
  const startsAt = asString(value);

  if (startsAt) {
    const [datePart, timePart = ""] = startsAt.split("T");

    return {
      date: datePart || asString(fallbackDate),
      time: timePart.slice(0, 5) || asString(fallbackTime, "00:00"),
    };
  }

  return {
    date: asString(fallbackDate),
    time: asString(fallbackTime, "00:00"),
  };
}

function adaptActivity(activity: ApiActivity): Activity | null {
  const slug = asString(activity.slug);
  const id = asString(activity.id, slug);
  const title = asString(activity.title);
  const villageId = asString(
    activity.village?.id,
    asString(activity.village_id, asString(activity.villageId, asString(activity.village?.slug))),
  );
  const { date, time } = splitDateTime(activity.starts_at, activity.date, activity.time);
  const spotsLeft =
    typeof activity.spots_left === "number" && Number.isFinite(activity.spots_left)
      ? activity.spots_left
      : undefined;

  if (!id || !title || !villageId || !date) {
    return null;
  }

  return {
    dataSource: activityDataSource(id, slug || undefined, activity.data_source),
    id,
    slug: slug || undefined,
    title,
    category: asCategory(activity.category),
    villageId,
    villageName: asString(activity.village?.name, asString(activity.village_name)) || undefined,
    date,
    time,
    capacity: asNumber(activity.capacity, asNumber(activity.spots)),
    spotsLeft,
    participantsCount: asNumber(activity.participants_count) || undefined,
    image:
      toRenderableImageUrl(activity.image_url) ??
      toRenderableImageUrl(activity.image),
    bannerImage: toRenderableImageUrl(activity.banner_url),
    description: asString(activity.description),
    organizer: asString(
      activity.organizer?.name,
      asString(activity.organizer_name, "Organizador"),
    ),
    location: asOptionalString(activity.location),
    isJoined: asBoolean(activity.is_joined) ?? asBoolean(activity.joined_by_me),
    isSaved: asBoolean(activity.is_saved) ?? asBoolean(activity.saved_by_me),
  };
}

function adaptActivities(response: ApiCollection<ApiActivity>) {
  return collectionItems(response)
    .map(adaptActivity)
    .filter((activity): activity is Activity => Boolean(activity));
}

function activitiesPath({
  limit = 100,
  villageId,
}: GetActivitiesOptions = {}) {
  const params = new URLSearchParams({ limit: String(limit) });

  if (villageId) params.set("village_id", villageId);

  return `/api/v1/activities?${params.toString()}`;
}

export async function getActivities(token?: string, options?: GetActivitiesOptions) {
  return getActivitiesStrict(token, options);
}

/** Canonical strict fetch retained as an explicit name for existing callers. */
export async function getActivitiesStrict(
  token?: string,
  options?: GetActivitiesOptions,
) {
  const response = await apiFetch<ApiCollection<ApiActivity>>(
    activitiesPath(options),
    { token },
  );

  return adaptActivities(response);
}

export async function getActivityById(id: string) {
  return getActivityByIdStrict(id);
}

export async function getActivityByIdStrict(id: string, token?: string) {
  const response = await apiFetch<ApiActivity>(
    `/api/v1/activities/${encodeURIComponent(id)}`,
    { token },
  );

  return adaptActivity(response) ?? undefined;
}

export async function getActivitiesByVillageId(villageId: string) {
  return getActivitiesByVillageIdStrict(villageId);
}

export async function getActivitiesByVillageIdStrict(
  villageId: string,
  token?: string,
) {
  return getActivitiesStrict(token, { villageId });
}

export function getActivityCategories() {
  return activityCategories;
}

export async function joinActivity(idOrSlug: string, token: string) {
  return apiFetch<{ is_joined?: boolean; joined?: boolean; message?: string }>(
    `/api/v1/activities/${encodeURIComponent(idOrSlug)}/join`,
    {
      method: "POST",
      token,
    },
  );
}

export async function createActivity(payload: CreateActivityPayload, token: string) {
  return apiFetch<ApiActivity>("/api/v1/activities", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function leaveActivity(idOrSlug: string, token: string) {
  return apiFetch<{ is_joined?: boolean; joined?: boolean; message?: string }>(
    `/api/v1/activities/${encodeURIComponent(idOrSlug)}/join`,
    {
      method: "DELETE",
      token,
    },
  );
}

export async function saveActivity(idOrSlug: string, token: string) {
  return apiFetch<{ is_saved?: boolean; saved?: boolean; message?: string }>(
    `/api/v1/activities/${encodeURIComponent(idOrSlug)}/save`,
    {
      method: "POST",
      token,
    },
  );
}

export async function unsaveActivity(idOrSlug: string, token: string) {
  return apiFetch<{ is_saved?: boolean; saved?: boolean; message?: string }>(
    `/api/v1/activities/${encodeURIComponent(idOrSlug)}/save`,
    {
      method: "DELETE",
      token,
    },
  );
}
