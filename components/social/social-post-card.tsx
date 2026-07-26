import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { SocialPostActions } from "@/components/social/social-post-actions";
import { PostTrustMenu } from "@/components/social/post-trust-menu";
import { UserAvatar } from "@/components/social/user-avatar";
import { Card } from "@/components/ui/card";
import { getPostCapabilities } from "@/lib/api/entity-capabilities";
import type { CommunityPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function readableDate(value: string) {
  if (!value) {
    return "Fecha no disponible";
  }

  try {
    return formatDate(value);
  } catch {
    return "Fecha no disponible";
  }
}

export function SocialPostCard({
  hydrateFromApi = false,
  post,
}: {
  hydrateFromApi?: boolean;
  post: CommunityPost;
}) {
  const villageName = post.villageName ?? "Sin pueblo asociado";
  const comments = post.commentsCount ?? post.comments;
  const showTitle = Boolean(post.title.trim() && post.title.trim().toLowerCase() !== "publicación");
  const capabilities = getPostCapabilities(post);

  return (
    <article>
      <Card className="overflow-hidden transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#184B3426] hover:shadow-[0_20px_58px_rgba(43,55,38,0.1)]">
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <UserAvatar
              name={post.author}
              initials={post.avatar}
              imageUrl={post.authorAvatar}
              className="size-12 ring-2 ring-white"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <p className="font-extrabold tracking-[-0.01em] text-[#18231D]">{post.author}</p>
                {post.authorHandle ? (
                  <span className="truncate text-xs font-semibold text-[#687269] sm:text-sm">
                    {post.authorHandle}
                  </span>
                ) : null}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[#687269]">
                {post.villageId ? (
                  <Link
                    className="font-bold text-[#347A48] transition-colors hover:text-[#184B34] hover:underline"
                    href={`/villages/${post.villageId}`}
                  >
                    {villageName}
                  </Link>
                ) : (
                  <span>{villageName}</span>
                )}
                <span aria-hidden="true" className="size-1 rounded-full bg-[#78947D]/55" />
                <time dateTime={post.date}>{readableDate(post.date)}</time>
              </div>
            </div>
            <PostTrustMenu />
          </div>

          {showTitle ? (
            <h2 className="mt-4 text-lg font-extrabold leading-snug tracking-[-0.018em] text-[#0E3325] sm:text-xl">
              {post.title}
            </h2>
          ) : null}
          <p className="mt-2 whitespace-pre-line text-sm font-medium leading-6 text-[#435048] sm:text-[15px] sm:leading-7">
            {post.content}
          </p>
        </div>

        {post.image ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-[#E9E9E1] sm:mx-4 sm:mb-4 sm:aspect-[16/8] sm:rounded-[18px]">
            <Image
              alt={showTitle ? post.title : `Publicación de ${post.author}`}
              className="object-cover transition-transform duration-300 hover:scale-[1.015]"
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 720px, 650px"
              src={post.image}
            />
            {post.villageId || post.villageName ? (
              <Link
                className="absolute bottom-3 left-3 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/65 bg-white/92 px-3 py-1.5 text-xs font-extrabold text-[#184B34] shadow-[0_8px_20px_rgba(14,51,37,0.16)] backdrop-blur transition-colors hover:bg-white"
                href={post.villageId ? `/villages/${post.villageId}` : "/villages"}
              >
                <MapPin aria-hidden="true" className="size-3.5" strokeWidth={2} />
                {villageName}
              </Link>
            ) : null}
          </div>
        ) : null}

        <SocialPostActions
          comments={comments}
          hydrateFromApi={hydrateFromApi}
          initiallyLiked={post.isLiked}
          interactionSupported={capabilities.canLike && capabilities.canSave}
          demo={!capabilities.persisted}
          likes={post.likes}
          saved={post.isSaved ?? post.saved}
          shares={post.shares}
          storageKey={post.id}
        />
      </Card>
    </article>
  );
}
