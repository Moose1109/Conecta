"use client";

import Image from "next/image";
import { Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { ProfileEmptyState } from "@/features/profile/profile-empty-state";
import type { CommunityPost } from "@/lib/types";

export function ProfilePhotoGrid({ posts }: { posts: CommunityPost[] }) {
  const { t } = useTranslations();
  const photos = posts.filter(
    (post): post is CommunityPost & { image: string } => Boolean(post.image),
  );

  if (!photos.length) {
    return (
      <ProfileEmptyState
        actionHref="/community#publicar"
        actionLabel={t("villages.detail.createPostAction")}
        description={t("profile.photoGrid.emptyDescription")}
        title={t("profile.photoGrid.emptyTitle")}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      {photos.map((post) => (
        <Card className="group overflow-hidden" key={post.id}>
          <figure>
            <div className="relative aspect-square overflow-hidden bg-[#E8E6DD]">
              <Image
                alt={t("profile.photoGrid.photoAlt", { title: post.title })}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 250px"
                src={post.image}
              />
            </div>
            <figcaption className="p-3 sm:p-4">
              <p className="line-clamp-2 text-sm font-extrabold leading-5 text-[#18231D]">
                {post.title}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#677168]">
                <Camera aria-hidden="true" className="size-3.5 shrink-0" />
                <span className="truncate">{post.villageName || post.date}</span>
              </p>
            </figcaption>
          </figure>
        </Card>
      ))}
    </div>
  );
}
