import type { Activity, CommunityPost, EntityDataSource, Village } from "@/lib/types";

/**
 * The API does not currently expose source/capability metadata. These fixture
 * identities are therefore isolated here as a temporary compatibility layer.
 * Remove this registry when the API returns an explicit data_source/capabilities
 * field or when every environment serves only persistent entities.
 */
const DEMO_POST_IDS = new Set([
  "77777777-7777-4777-8777-777777777777",
  "88888888-8888-4888-8888-888888888888",
  "99999999-9999-4999-8999-999999999999",
]);

const DEMO_ACTIVITY_IDS = new Set([
  "44444444-4444-4444-8444-444444444444",
  "55555555-5555-4555-8555-555555555555",
  "66666666-6666-4666-8666-666666666666",
]);

const DEMO_ACTIVITY_SLUGS = new Set([
  "ruta-medieval-rupit",
  "mercado-local-besalu",
  "senderismo-siurana",
]);

const DEMO_VILLAGE_IDS = new Set([
  "11111111-1111-4111-8111-111111111111",
  "22222222-2222-4222-8222-222222222222",
  "33333333-3333-4333-8333-333333333333",
]);

const DEMO_VILLAGE_SLUGS = new Set(["rupit", "besalu", "siurana"]);
// FastAPI/Python UUID accepts the canonical 8-4-4-4-12 hexadecimal form even
// when seeded identifiers do not encode an RFC version/variant nibble.
const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const ID_OR_SLUG_PATTERN = /^(?:[0-9a-f-]{36}|[a-z0-9]+(?:-[a-z0-9]+)*)$/i;

export type PostCapabilities = {
  persisted: boolean;
  canLike: boolean;
  canSave: boolean;
  canComment: boolean;
  canShare: boolean;
  reason?: "demo-data" | "invalid-post-id" | "comments-and-shares-unavailable";
};

function explicitDataSource(value: unknown): EntityDataSource | undefined {
  return value === "demo" || value === "persistent" ? value : undefined;
}

export function postDataSource(id: string, source?: unknown): EntityDataSource {
  return explicitDataSource(source) ?? (DEMO_POST_IDS.has(id) ? "demo" : "persistent");
}

export function activityDataSource(
  id: string,
  slug?: string,
  source?: unknown,
): EntityDataSource {
  const declaredSource = explicitDataSource(source);
  if (declaredSource) return declaredSource;

  return DEMO_ACTIVITY_IDS.has(id) || Boolean(slug && id === slug && DEMO_ACTIVITY_SLUGS.has(slug))
    ? "demo"
    : "persistent";
}

export function villageDataSource(
  id: string,
  slug?: string,
  source?: unknown,
): EntityDataSource {
  const declaredSource = explicitDataSource(source);
  if (declaredSource) return declaredSource;

  return DEMO_VILLAGE_IDS.has(id) || Boolean(slug && id === slug && DEMO_VILLAGE_SLUGS.has(slug))
    ? "demo"
    : "persistent";
}

export function isPersistedPost(post: CommunityPost) {
  return post.dataSource === "persistent";
}

export function getPostCapabilities(post: CommunityPost): PostCapabilities {
  if (!isPersistedPost(post)) {
    return {
      persisted: false,
      canLike: false,
      canSave: false,
      canComment: false,
      canShare: false,
      reason: "demo-data",
    };
  }

  if (!UUID_PATTERN.test(post.id)) {
    return {
      persisted: true,
      canLike: false,
      canSave: false,
      canComment: false,
      canShare: false,
      reason: "invalid-post-id",
    };
  }

  return {
    persisted: true,
    canLike: true,
    canSave: true,
    canComment: false,
    canShare: false,
    reason: "comments-and-shares-unavailable",
  };
}

export function canInteractWithPost(post: CommunityPost) {
  const capabilities = getPostCapabilities(post);
  return capabilities.canLike && capabilities.canSave;
}

export function isPersistedActivity(activity: Activity) {
  return activity.dataSource === "persistent";
}

export function canJoinActivity(activity: Activity) {
  return ID_OR_SLUG_PATTERN.test(activity.id) && isPersistedActivity(activity);
}

export function isPersistedVillage(village: Village) {
  return village.dataSource === "persistent";
}

export function canFollowVillage(village: Village) {
  return ID_OR_SLUG_PATTERN.test(village.id) && isPersistedVillage(village);
}

export function containsDemoEntities(items: Array<Activity | CommunityPost | Village>) {
  return items.some((item) => item.dataSource === "demo");
}
