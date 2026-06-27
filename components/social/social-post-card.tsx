import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SocialPostActions } from "@/components/social/social-post-actions";
import { UserAvatar } from "@/components/social/user-avatar";
import { getVillageById } from "@/lib/api/villages.service";
import type { CommunityPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function SocialPostCard({ post }: { post: CommunityPost }) {
  const village = getVillageById(post.villageId);
  const villageName = post.villageName ?? village?.name;
  const avatar = post.authorAvatar ?? post.avatar;
  const comments = post.commentsCount ?? post.comments;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-[0_18px_52px_rgba(31,61,43,0.11)]">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <UserAvatar name={post.author} initials={avatar} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="font-black text-[#1F3D2B]">{post.author}</p>
              {post.authorHandle ? (
                <span className="text-sm font-bold text-[#1E1E1E]/44">
                  {post.authorHandle}
                </span>
              ) : null}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold text-[#1E1E1E]/52">
              {village ? (
                <Link href={`/villages/${village.id}`} className="text-[#3A7D44]">
                  {villageName}
                </Link>
              ) : villageName ? (
                <span className="text-[#3A7D44]">{villageName}</span>
              ) : null}
              <span>{formatDate(post.date)}</span>
            </div>
          </div>
          <button
            className="grid size-9 place-items-center rounded-full text-[#1F3D2B]/60 hover:bg-[#1F3D2B0d] focus:outline-none focus:ring-4 focus:ring-[#3A7D4420]"
            type="button"
            aria-label="Más opciones"
          >
            ...
          </button>
        </div>

        <h3 className="mt-4 text-lg font-black leading-snug text-[#1F3D2B]">
          {post.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#1E1E1E]/72">{post.content}</p>
      </div>

      {post.image ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F3F4F6] sm:aspect-[16/9]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 680px"
          />
        </div>
      ) : null}

      <SocialPostActions
        comments={comments}
        likes={post.likes}
        saved={post.saved}
        shares={post.shares}
        storageKey={post.id}
      />
    </Card>
  );
}
