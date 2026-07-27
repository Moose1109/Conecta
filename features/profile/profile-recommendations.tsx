import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Activity, Village } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ProfileRecommendationsRail({ activities, villages }: { activities: Activity[]; villages: Village[] }) {
  const followed = villages.filter((village) => village.isFollowing === true).slice(0, 3);
  const suggestedActivities = activities.filter((activity) => activity.isJoined !== true).slice(0, 3);

  return (
    <aside className="grid content-start gap-4 xl:sticky xl:top-[92px]">
      <Card className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-extrabold text-[#0E3325]">Pueblos que sigues</h2>
          <Link className="text-xs font-extrabold text-[#347A48]" href="/villages">Explorar</Link>
        </div>
        <p className="mt-1 text-[11px] font-medium text-[#687269]">Detectados en el catálogo actual.</p>
        {followed.length ? (
          <div className="mt-4 grid gap-3">
            {followed.map((village) => (
              <Link className="group flex items-center gap-3" href={`/villages/${village.id}`} key={village.id}>
                <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#184B34]">
                  <Image alt={village.name} className="object-cover transition-transform duration-200 group-hover:scale-[1.02]" fill sizes="56px" src={village.image || "/images/raiz-village-hero.webp"} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-extrabold text-[#18231D]">{village.name}</span>
                  <span className="mt-0.5 block truncate text-xs font-medium text-[#687269]">{village.province}</span>
                </span>
                <ArrowRight aria-hidden="true" className="size-4 text-[#78947D]" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl bg-[#F7F2E8] p-4 text-center">
            <MapPin aria-hidden="true" className="mx-auto size-5 text-[#347A48]" />
            <p className="mt-2 text-xs font-semibold leading-5 text-[#687269]">Los pueblos que sigas aparecerán aquí.</p>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-extrabold text-[#0E3325]">Para tu próxima salida</h2>
          <Link className="text-xs font-extrabold text-[#347A48]" href="/activities">Ver todas</Link>
        </div>
        {suggestedActivities.length ? (
          <div className="mt-4 grid gap-3">
            {suggestedActivities.map((activity) => (
              <Link className="group flex items-center gap-3" href={`/activities/${activity.id}`} key={activity.id}>
                <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#D7A63C]">
                  <Image alt={activity.title} className="object-cover transition-transform duration-200 group-hover:scale-[1.02]" fill sizes="56px" src={activity.image || "/images/raiz-market.webp"} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block line-clamp-1 text-sm font-extrabold text-[#18231D]">{activity.title}</span>
                  <span className="mt-0.5 block truncate text-[11px] font-medium text-[#687269]">{formatDate(activity.date)} · {activity.time}</span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl bg-[#FFF7E5] p-4 text-center">
            <CalendarDays aria-hidden="true" className="mx-auto size-5 text-[#B77F14]" />
            <p className="mt-2 text-xs font-semibold leading-5 text-[#687269]">No hay actividades recomendadas disponibles.</p>
          </div>
        )}
      </Card>
    </aside>
  );
}
