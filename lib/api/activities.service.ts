import {
  activities,
  activityCategories,
  getActivitiesByVillage,
  getActivityById as getMockActivityById,
} from "@/data/activities";
import { apiFetch, hasApiBaseUrl } from "@/lib/api/client";
import type { Activity, ActivityCategory } from "@/lib/types";

type ApiActivity = {
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
  starts_at?: unknown;
  date?: unknown;
  time?: unknown;
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

function asCategory(value: unknown): ActivityCategory {
  return activityCategories.includes(value as ActivityCategory)
    ? (value as ActivityCategory)
    : "Cultura";
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

  if (!id || !title || !villageId || !date) {
    return null;
  }

  const mockActivity = activities.find((item) => item.id === id || item.id === slug);

  return {
    id,
    slug: slug || undefined,
    title,
    category: asCategory(activity.category),
    villageId,
    villageName: asString(activity.village?.name, asString(activity.village_name)) || undefined,
    date,
    time,
    spots: asNumber(
      activity.spots_left,
      asNumber(activity.capacity, asNumber(activity.spots, mockActivity?.spots)),
    ),
    spotsLeft: asNumber(activity.spots_left) || undefined,
    participantsCount: asNumber(activity.participants_count) || undefined,
    image: asString(activity.image_url, asString(activity.image, mockActivity?.image)),
    description: asString(activity.description, mockActivity?.description),
    organizer: asString(
      activity.organizer?.name,
      asString(activity.organizer_name, mockActivity?.organizer),
    ),
    isJoined: asBoolean(activity.is_joined) ?? asBoolean(activity.joined_by_me),
    isSaved: asBoolean(activity.is_saved) ?? asBoolean(activity.saved_by_me),
  };
}

function adaptActivities(response: ApiCollection<ApiActivity>) {
  const adapted = collectionItems(response)
    .map(adaptActivity)
    .filter((activity): activity is Activity => Boolean(activity));

  if (!adapted.length) {
    throw new Error("API activities response did not include valid activities");
  }

  return adapted;
}

export async function getActivities() {
  if (!hasApiBaseUrl()) {
    return activities;
  }

  try {
    const response = await apiFetch<ApiCollection<ApiActivity>>("/api/v1/activities");
    return adaptActivities(response);
  } catch (error) {
    console.error("Error loading activities from API:", error);
    return activities;
  }
}

export async function getActivityById(id: string) {
  if (!hasApiBaseUrl()) {
    return getMockActivityById(id);
  }

  try {
    const response = await apiFetch<ApiActivity>(`/api/v1/activities/${encodeURIComponent(id)}`);
    return adaptActivity(response) ?? getMockActivityById(id);
  } catch (error) {
    console.error("Error loading activity from API:", error);
    return getMockActivityById(id);
  }
}

export async function getActivitiesByVillageId(villageId: string) {
  if (!hasApiBaseUrl()) {
    return getActivitiesByVillage(villageId);
  }

  const allActivities = await getActivities();
  return allActivities.filter((activity) => activity.villageId === villageId);
}

export function getActivityCategories() {
  return activityCategories;
}
