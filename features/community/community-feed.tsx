"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/social/empty-state";
import { PostComposer } from "@/components/social/post-composer";
import { SocialPostCard } from "@/components/social/social-post-card";
import { SearchInput } from "@/components/ui/search-input";
import type { CommunityPost, MockUser, Village } from "@/lib/types";

export function CommunityFeed({
  posts,
  user,
  villages,
}: {
  posts: CommunityPost[];
  user: MockUser;
  villages: Village[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return posts;
    }

    return posts.filter((post) => {
      const village = villages.find((item) => item.id === post.villageId);
      const searchable = [
        post.title,
        post.content,
        post.author,
        post.authorHandle,
        post.villageName,
        village?.name,
        village?.province,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [posts, query, villages]);

  return (
    <>
      <div className="mb-5">
        <SearchInput
          label="Buscar publicaciones"
          placeholder="Buscar posts, pueblos o personas"
          value={query}
          onChange={setQuery}
        />
      </div>
      <div className="grid gap-5">
        <PostComposer user={user} />
        {filtered.length ? (
          filtered.map((post) => <SocialPostCard key={post.id} post={post} />)
        ) : (
          <EmptyState
            title="No hay publicaciones con esa búsqueda"
            description="Prueba con otro pueblo, autor o tema comunitario."
          />
        )}
      </div>
    </>
  );
}
