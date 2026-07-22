import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Camera,
  Clock3,
  MapPin,
  UsersRound,
} from "lucide-react";
import { JoinActivityButton } from "@/components/social/join-activity-button";
import { SaveButton } from "@/components/social/save-button";
import { Card } from "@/components/ui/card";
import {
  ActivityCategoryIcon,
  activityCategoryPill,
} from "@/features/activities/activity-category-icon";
import { ActivityImage } from "@/features/activities/activity-image";
import { canJoinActivity } from "@/lib/api/entity-capabilities";
import { formatDate } from "@/lib/utils";
import type { Activity } from "@/lib/types";

function activityDateParts(date: string) {
  const value = new Date(`${date}T12:00:00`);

  return {
    day: new Intl.DateTimeFormat("es-ES", { day: "2-digit" }).format(value),
    month: new Intl.DateTimeFormat("es-ES", { month: "short" })
      .format(value)
      .replace(".", ""),
  };
}

export function ActivityCard({
  activity,
  compact = false,
  hydrateFromApi = false,
  villageName: villageNameOverride,
}: {
  activity: Activity;
  compact?: boolean;
  hydrateFromApi?: boolean;
  villageName?: string;
}) {
  const date = activityDateParts(activity.date);
  const villageName = villageNameOverride ?? activity.villageName;

  if (compact) {
    return (
      <Card className="group overflow-hidden rounded-[18px] shadow-[0_10px_30px_rgba(43,55,38,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-[#184B3430] hover:shadow-[0_16px_36px_rgba(43,55,38,0.10)]">
        <Link href={`/activities/${activity.id}`} className="grid grid-cols-[104px_minmax(0,1fr)]">
          <div className="relative min-h-[116px] overflow-hidden bg-[#D9E0D7]">
            {activity.image ? (
              <Image
                alt={activity.title}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                fill
                sizes="104px"
                src={activity.image}
              />
            ) : (
              <>
                <Image
                  alt=""
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  fill
                  sizes="104px"
                  src="/images/raiz-market.webp"
                />
                <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-[#0E3325]/74 px-1.5 py-0.5 text-[0.52rem] font-extrabold text-white backdrop-blur">
                  <Camera aria-hidden="true" className="size-2.5" />
                  Editorial
                </span>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E3325]/30 to-transparent" />
          </div>
          <div className="flex min-w-0 flex-col p-3.5">
            <span className="flex items-center gap-1.5 text-[0.67rem] font-extrabold uppercase tracking-[0.1em] text-[#347A48]">
              <ActivityCategoryIcon category={activity.category} className="size-3.5" />
              <span className="truncate">{activity.category}</span>
            </span>
            <h3 className="mt-1.5 line-clamp-2 text-sm font-extrabold leading-[1.35] tracking-[-0.015em] text-[#18231D]">
              {activity.title}
            </h3>
            <span className="mt-auto flex items-end justify-between gap-2 pt-2 text-[0.68rem] font-bold text-[#687269]">
              <span className="inline-flex min-w-0 items-center gap-1">
                <CalendarDays aria-hidden="true" className="size-3.5 shrink-0 text-[#C96D4A]" />
                <span className="truncate">{formatDate(activity.date)}</span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 shrink-0 text-[#184B34] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-[20px] shadow-[0_12px_36px_rgba(43,55,38,0.065)] transition duration-200 hover:-translate-y-1 hover:border-[#184B3430] hover:shadow-[0_22px_52px_rgba(43,55,38,0.12)]">
      <Link href={`/activities/${activity.id}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-[#D9E0D7]">
          <ActivityImage
            activity={activity}
            className="transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(14,51,37,0.55)_100%)]" />
          <span className="absolute left-3 top-3 grid min-w-12 place-items-center rounded-[13px] border border-white/55 bg-[#FFFCF7]/94 px-2 py-1.5 text-[#184B34] shadow-[0_6px_18px_rgba(14,51,37,0.16)] backdrop-blur-md">
            <span className="text-lg font-extrabold leading-none">{date.day}</span>
            <span className="mt-0.5 text-[0.58rem] font-extrabold uppercase tracking-[0.11em]">
              {date.month}
            </span>
          </span>
          <span
            className={`absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-extrabold shadow-sm backdrop-blur-md ${activityCategoryPill(activity.category)}`}
          >
            <ActivityCategoryIcon category={activity.category} className="size-3.5" />
            {activity.category}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-[18px]">
        {villageName ? (
          <p className="flex items-center gap-1.5 text-xs font-extrabold text-[#347A48]">
            <MapPin aria-hidden="true" className="size-3.5" />
            <span className="truncate">{villageName}</span>
          </p>
        ) : null}
        <Link href={`/activities/${activity.id}`}>
          <h3 className="mt-2 line-clamp-2 text-lg font-extrabold leading-[1.25] tracking-[-0.025em] text-[#18231D] transition-colors group-hover:text-[#184B34]">
            {activity.title}
          </h3>
        </Link>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-bold text-[#687269]">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" className="size-3.5 text-[#C96D4A]" />
            {formatDate(activity.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 aria-hidden="true" className="size-3.5 text-[#C96D4A]" />
            {activity.time}
          </span>
        </div>

        {activity.description ? (
          <p className="mt-3 line-clamp-2 text-sm leading-5 text-[#687269]">
            {activity.description}
          </p>
        ) : null}

        {activity.location ? (
          <p className="mt-3 flex items-start gap-1.5 text-xs font-bold leading-5 text-[#526158]">
            <MapPin aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-[#60818A]" />
            <span className="line-clamp-1">{activity.location}</span>
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-[#184B3414] pt-4">
          <div className="min-h-8">
            {typeof activity.spotsLeft === "number" ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#184B34]">
                <UsersRound aria-hidden="true" className="size-3.5" />
                {activity.spotsLeft} disponibles
              </span>
            ) : activity.capacity > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#184B34]">
                <UsersRound aria-hidden="true" className="size-3.5" />
                Aforo: {activity.capacity}
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <SaveButton
              compact
              demo={activity.dataSource === "demo"}
              hydrateFromApi={hydrateFromApi}
              initialSaved={activity.isSaved}
              interactionSupported={canJoinActivity(activity)}
              storageKey={`activity:${activity.id}`}
            />
            <JoinActivityButton
              compact
              demo={activity.dataSource === "demo"}
              hydrateFromApi={hydrateFromApi}
              initialJoined={activity.isJoined}
              interactionSupported={canJoinActivity(activity)}
              storageKey={activity.id}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
