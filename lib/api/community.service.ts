import { apiFetch } from "@/lib/api/client";
import { postDataSource } from "@/lib/api/entity-capabilities";
import { toRenderableImageUrl } from "@/lib/image-url";
import type { CommunityPost } from "@/lib/types";

type ApiPost = {
  data_source?: unknown;
  id?: unknown;
  title?: unknown;
  content?: unknown;
  author_id?: unknown;
  village_id?: unknown;
  villageId?: unknown;
  village_name?: unknown;
  village?: {
    id?: unknown;
    slug?: unknown;
    name?: unknown;
  };
  author?: {
    id?: unknown;
    name?: unknown;
    username?: unknown;
    handle?: unknown;
    avatar_url?: unknown;
  };
  author_name?: unknown;
  author_username?: unknown;
  authorHandle?: unknown;
  avatar?: unknown;
  authorAvatar?: unknown;
  image?: unknown;
  image_url?: unknown;
  date?: unknown;
  created_at?: unknown;
  likes?: unknown;
  likes_count?: unknown;
  comments?: unknown;
  comments_count?: unknown;
  commentsCount?: unknown;
  shares?: unknown;
  shares_count?: unknown;
  saved?: unknown;
  is_liked?: unknown;
  liked_by_me?: unknown;
  is_saved?: unknown;
  saved_by_me?: unknown;
};

type ApiCollection<T> = T[] | { items?: T[] };

export type CreateCommunityPostPayload = {
  village_id?: string | null;
  title?: string | null;
  content: string;
  image_url?: string | null;
};

export type GetCommunityPostsOptions = {
  authorId?: string;
  limit?: number;
  villageId?: string;
};

function collectionItems<T>(response: ApiCollection<T>): T[] {
  return Array.isArray(response) ? response : response.items ?? [];
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function isUrlLike(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

function asDisplayString(value: unknown, fallback = "") {
  const text = asString(value, fallback);
  return text && !isUrlLike(text) ? text : fallback;
}

function asImageUrl(value: unknown, fallback = "") {
  const text = asString(value, fallback);
  return text && isUrlLike(text) ? text : "";
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown) {
  return typeof value === "boolean" ? value : undefined;
}

function dateOnly(value: unknown, fallback: unknown) {
  const raw = asString(value, asString(fallback));
  return raw.includes("T") ? raw.split("T")[0] : raw;
}

function adaptPost(post: ApiPost): CommunityPost | null {
  const id = asString(post.id);
  const title = asString(post.title, "Publicación");
  const content = asString(post.content);
  const authorId = asString(post.author?.id, asString(post.author_id));
  const villageId = asString(
    post.village?.id,
    asString(post.village_id, asString(post.villageId, asString(post.village?.slug))),
  );
  const author = asDisplayString(post.author?.name, asDisplayString(post.author_name, "Usuario"));

  if (!id || !title || !content) {
    return null;
  }

  const authorHandle = asDisplayString(
    post.author?.username,
    asDisplayString(
      post.author?.handle,
      asDisplayString(post.author_username, asDisplayString(post.authorHandle)),
    ),
  );
  const commentsCount = asNumber(
    post.comments_count,
    asNumber(post.commentsCount, asNumber(post.comments)),
  );
  const saved = asBoolean(post.is_saved) ?? asBoolean(post.saved_by_me) ?? asBoolean(post.saved);

  return {
    dataSource: postDataSource(id, post.data_source),
    id,
    title,
    content,
    authorId: authorId || undefined,
    villageId: villageId || undefined,
    villageName:
      asDisplayString(post.village?.name, asDisplayString(post.village_name)) ||
      undefined,
    author,
    authorHandle: authorHandle ? `@${authorHandle.replace(/^@/, "")}` : undefined,
    handle: authorHandle,
    avatar: asDisplayString(post.avatar) || undefined,
    authorAvatar:
      asImageUrl(post.author?.avatar_url, asImageUrl(post.authorAvatar)) ||
      undefined,
    image:
      toRenderableImageUrl(post.image_url) ??
      toRenderableImageUrl(post.image),
    date: dateOnly(post.created_at, asString(post.date)),
    likes: asNumber(post.likes_count, asNumber(post.likes)),
    isLiked: asBoolean(post.is_liked) ?? asBoolean(post.liked_by_me),
    comments: commentsCount,
    commentsCount,
    shares: asNumber(post.shares_count, asNumber(post.shares)),
    saved,
    isSaved: saved,
  };
}

function adaptPosts(response: ApiCollection<ApiPost>) {
  return collectionItems(response)
    .map(adaptPost)
    .filter((post): post is CommunityPost => Boolean(post));
}

function postsPath({
  authorId,
  limit = 100,
  villageId,
}: GetCommunityPostsOptions = {}) {
  const params = new URLSearchParams({ limit: String(limit) });

  if (authorId) params.set("author_id", authorId);
  if (villageId) params.set("village_id", villageId);

  return `/api/v1/posts?${params.toString()}`;
}

export async function getCommunityPosts(
  token?: string,
  options?: GetCommunityPostsOptions,
) {
  return getCommunityPostsStrict(token, options);
}

/** Canonical strict fetch retained as an explicit name for existing callers. */
export async function getCommunityPostsStrict(
  token?: string,
  options?: GetCommunityPostsOptions,
) {
  const response = await apiFetch<ApiCollection<ApiPost>>(postsPath(options), {
    token,
  });

  return adaptPosts(response);
}

export async function getCommunityPostById(id: string) {
  return getCommunityPostByIdStrict(id);
}

export async function getCommunityPostByIdStrict(id: string, token?: string) {
  const response = await apiFetch<ApiPost>(`/api/v1/posts/${encodeURIComponent(id)}`, {
    token,
  });

  return adaptPost(response) ?? undefined;
}

export async function getPostsByVillageId(villageId: string) {
  return getPostsByVillageIdStrict(villageId);
}

export async function getPostsByVillageIdStrict(villageId: string, token?: string) {
  return getCommunityPostsStrict(token, { villageId });
}

export async function likePost(id: string, token: string) {
  return apiFetch<{
    is_liked?: boolean;
    liked?: boolean;
    likes_count?: number;
    message?: string;
  }>(
    `/api/v1/posts/${encodeURIComponent(id)}/like`,
    {
      method: "POST",
      token,
    },
  );
}

export async function createCommunityPost(payload: CreateCommunityPostPayload, token: string) {
  return apiFetch<ApiPost>("/api/v1/posts", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function unlikePost(id: string, token: string) {
  return apiFetch<{
    is_liked?: boolean;
    liked?: boolean;
    likes_count?: number;
    message?: string;
  }>(
    `/api/v1/posts/${encodeURIComponent(id)}/like`,
    {
      method: "DELETE",
      token,
    },
  );
}

export async function savePost(id: string, token: string) {
  return apiFetch<{ is_saved?: boolean; saved?: boolean; message?: string }>(
    `/api/v1/posts/${encodeURIComponent(id)}/save`,
    {
      method: "POST",
      token,
    },
  );
}

export async function unsavePost(id: string, token: string) {
  return apiFetch<{ is_saved?: boolean; saved?: boolean; message?: string }>(
    `/api/v1/posts/${encodeURIComponent(id)}/save`,
    {
      method: "DELETE",
      token,
    },
  );
}
