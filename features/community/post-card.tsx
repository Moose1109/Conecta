import { Badge, Card } from "@/components/ui/card";
import { getVillageById } from "@/lib/api/villages.service";
import { formatDate } from "@/lib/utils";
import type { CommunityPost } from "@/lib/types";

export function PostCard({ post }: { post: CommunityPost }) {
  const village = getVillageById(post.villageId);

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{village?.name}</Badge>
        <span className="text-xs font-bold text-[#1E1E1E]/52">{formatDate(post.date)}</span>
      </div>
      <h3 className="mt-4 text-xl font-black text-[#1F3D2B]">{post.title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#1E1E1E]/72">{post.content}</p>
      <p className="mt-4 text-sm font-bold text-[#3A7D44]">{post.author}</p>
    </Card>
  );
}
