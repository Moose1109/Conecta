import Image from "next/image";
import Link from "next/link";
import { Badge, Card } from "@/components/ui/card";
import { getVillageById } from "@/lib/api/villages.service";
import { formatDate } from "@/lib/utils";
import type { Activity } from "@/lib/types";

export function ActivityCard({ activity }: { activity: Activity }) {
  const village = getVillageById(activity.villageId);

  return (
    <Link href={`/activities/${activity.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-transform group-hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={activity.image}
            alt={activity.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute left-4 top-4">
            <Badge>{activity.category}</Badge>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-black text-[#1F3D2B]">{activity.title}</h3>
          <p className="mt-2 text-sm font-bold text-[#3A7D44]">
            {village?.name} · {formatDate(activity.date)} · {activity.time}
          </p>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#1E1E1E]/68">
            {activity.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#1F3D2B12] pt-3">
            <span className="text-xs font-black text-[#1F3D2B]/62">
              {activity.spots} plazas
            </span>
            <span className="rounded-full bg-[#3A7D4414] px-3 py-1 text-xs font-black text-[#3A7D44]">
              Guardar
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
