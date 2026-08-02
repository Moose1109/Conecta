import type { CommunityPost } from "@/lib/types";

export function isOwnPost(post: CommunityPost, currentUserId?: string): boolean {
  return Boolean(currentUserId && post.authorId && post.authorId === currentUserId);
}
