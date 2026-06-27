import Image from "next/image";
import Link from "next/link";
import { Badge, Card } from "@/components/ui/card";
import { JoinActivityButton } from "@/components/social/join-activity-button";
import { SaveButton } from "@/components/social/save-button";
import { getVillageById } from "@/lib/api/villages.service";
import { formatDate } from "@/lib/utils";
import type { Activity } from "@/lib/types";

export function ActivityCard({
  activity,
  compact = false,
}: {
  activity: Activity;
  compact?: boolean;
}) {
  const village = getVillageById(activity.villageId);

  return (
    <Card className="group h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_18px_52px_rgba(31,61,43,0.12)]">
      <Link href={`/activities/${activity.id}`} className="block">
        <div
          className={`relative overflow-hidden ${compact ? "aspect-[16/8]" : "aspect-[16/10]"}`}
        >
          <Image
            src={activity.image}
            alt={activity.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1F3D2B]/42 to-transparent" />
          <div className="absolute left-4 top-4">
            <Badge>{activity.category}</Badge>
          </div>
        </div>
      </Link>
      <div className={compact ? "p-4" : "p-5"}>
        <Link href={`/activities/${activity.id}`}>
          <h3
            className={
              compact
                ? "text-lg font-black leading-snug text-[#1F3D2B]"
                : "text-xl font-black leading-snug text-[#1F3D2B]"
            }
          >
            {activity.title}
          </h3>
        </Link>
        <p className="mt-2 text-sm font-bold text-[#3A7D44]">
          {village?.name} · {formatDate(activity.date)} · {activity.time}
        </p>
        <p
          className={`mt-3 text-sm leading-6 text-[#1E1E1E]/68 ${compact ? "line-clamp-1" : "line-clamp-2"}`}
        >
          {activity.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#1F3D2B12] pt-3">
          <span className="text-xs font-black text-[#1F3D2B]/62">
            {activity.spots} plazas
          </span>
          <div className="flex gap-2">
            {!compact ? (
              <SaveButton compact initialSaved={false} storageKey={`activity:${activity.id}`} />
            ) : null}
            <JoinActivityButton compact storageKey={activity.id} />
          </div>
        </div>
      </div>
    </Card>
  );
}
