import { communityPosts } from "@/data/community";

export function getCommunityPosts() {
  return communityPosts;
}

export function getPostsByVillageId(villageId: string) {
  return communityPosts.filter((post) => post.villageId === villageId);
}
