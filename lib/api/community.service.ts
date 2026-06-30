import { communityPosts } from "@/data/community";
import { apiFetch, hasApiBaseUrl } from "@/lib/api/client";
import type { CommunityPost } from "@/lib/types";

type ApiPost = {
  id?: unknown;
  title?: unknown;
  content?: unknown;
  village_id?: unknown;
  villageId?: unknown;
  village_name?: unknown;
  village?: {
    id?: unknown;
    slug?: unknown;
    name?: unknown;
  };
  author?: {
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

function dateOnly(value: unknown, fallback: unknown) {
  const raw = asString(value, asString(fallback));
  return raw.includes("T") ? raw.split("T")[0] : raw;
}

function adaptPost(post: ApiPost): CommunityPost | null {
  const id = asString(post.id);
  const title = asString(post.title);
  const villageId = asString(
    post.village?.id,
    asString(post.village_id, asString(post.villageId, asString(post.village?.slug))),
  );
  const author = asString(post.author?.name, asString(post.author_name, "Vecino/a"));

  if (!id || !title || !villageId) {
    return null;
  }

  const mockPost = communityPosts.find((item) => item.id === id);
  const authorHandle = asString(
    post.author?.username,
    asString(post.author?.handle, asString(post.author_username, asString(post.authorHandle))),
  );
  const commentsCount = asNumber(
    post.comments_count,
    asNumber(post.commentsCount, asNumber(post.comments)),
  );
  const saved = asBoolean(post.is_saved) ?? asBoolean(post.saved_by_me) ?? asBoolean(post.saved);

  return {
    id,
    title,
    content: asString(post.content, mockPost?.content),
    villageId,
    villageName:
      asString(post.village?.name, asString(post.village_name, mockPost?.villageName)) ||
      undefined,
    author,
    authorHandle: authorHandle ? `@${authorHandle.replace(/^@/, "")}` : undefined,
    handle: authorHandle,
    avatar: asString(post.avatar, mockPost?.avatar) || undefined,
    authorAvatar:
      asString(post.author?.avatar_url, asString(post.authorAvatar, mockPost?.authorAvatar)) ||
      undefined,
    image: asString(post.image_url, asString(post.image, mockPost?.image)) || undefined,
    date: dateOnly(post.created_at, asString(post.date, mockPost?.date)),
    likes: asNumber(post.likes_count, asNumber(post.likes, mockPost?.likes)),
    isLiked: asBoolean(post.is_liked) ?? asBoolean(post.liked_by_me),
    comments: commentsCount || mockPost?.comments,
    commentsCount: commentsCount || mockPost?.commentsCount,
    shares: asNumber(post.shares_count, asNumber(post.shares, mockPost?.shares)),
    saved,
    isSaved: saved,
  };
}

function adaptPosts(response: ApiCollection<ApiPost>) {
  const adapted = collectionItems(response)
    .map(adaptPost)
    .filter((post): post is CommunityPost => Boolean(post));

  if (!adapted.length) {
    throw new Error("API posts response did not include valid posts");
  }

  return adapted;
}

export async function getCommunityPosts() {
  if (!hasApiBaseUrl()) {
    return communityPosts;
  }

  try {
    const response = await apiFetch<ApiCollection<ApiPost>>("/api/v1/posts");
    return adaptPosts(response);
  } catch (error) {
    console.error("Error loading community posts from API:", error);
    return communityPosts;
  }
}

export async function getCommunityPostById(id: string) {
  if (!hasApiBaseUrl()) {
    return communityPosts.find((post) => post.id === id);
  }

  try {
    const response = await apiFetch<ApiPost>(`/api/v1/posts/${encodeURIComponent(id)}`);
    return adaptPost(response) ?? communityPosts.find((post) => post.id === id);
  } catch (error) {
    console.error("Error loading community post from API:", error);
    return communityPosts.find((post) => post.id === id);
  }
}

export async function getPostsByVillageId(villageId: string) {
  if (!hasApiBaseUrl()) {
    return communityPosts.filter((post) => post.villageId === villageId);
  }

  const posts = await getCommunityPosts();
  return posts.filter((post) => post.villageId === villageId);
}
