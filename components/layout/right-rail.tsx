"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  MapPin,
  Mountain,
  UsersRound,
} from "lucide-react";
import { FollowButton } from "@/components/social/follow-button";
import { Card } from "@/components/ui/card";
import { useCommunityData } from "@/features/community/community-data-provider";
import { canFollowVillage } from "@/lib/api/entity-capabilities";
import { formatPopulation } from "@/lib/utils";

function compactDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return { day: "--", weekday: "Próx." };
  }

  return {
    day: new Intl.DateTimeFormat("es-ES", { day: "2-digit" }).format(parsed),
    weekday: new Intl.DateTimeFormat("es-ES", { weekday: "short" })
      .format(parsed)
      .replace(".", "")
      .toUpperCase(),
  };
}

function RailHeader({
  href,
  title,
}: {
  href: string;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#184B3410] px-4 py-3.5">
      <h2 className="text-[15px] font-extrabold tracking-[-0.015em] text-[#0E3325]">{title}</h2>
      <Link
        className="inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-[11px] font-extrabold text-[#347A48] transition-colors hover:bg-[#184B3409] hover:text-[#184B34]"
        href={href}
      >
        Ver todas
        <ArrowRight aria-hidden="true" className="size-3" />
      </Link>
    </div>
  );
}

export function RightRail() {
  const { activities, posts, unavailableSources, villages } = useCommunityData();
  const villageById = new Map(villages.map((village) => [village.id, village]));
  const inspiringPosts = posts.filter((post) => Boolean(post.image?.trim())).slice(0, 3);

  return (
    <div className="grid content-start gap-4">
      <Card className="overflow-hidden">
        <RailHeader href="/activities" title="Actividades para descubrir" />
        {activities.length ? (
          <div className="divide-y divide-[#184B340d] px-3">
            {activities.slice(0, 3).map((activity) => {
              const date = compactDate(activity.date);
              const villageName =
                activity.villageName ?? villageById.get(activity.villageId)?.name ?? "Pueblo local";

              return (
                <article className="group flex gap-3 py-3" key={activity.id}>
                  <Link
                    aria-label={`Ver ${activity.title}`}
                    className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[14px] bg-[#D7A63C1a]"
                    href={`/activities/${activity.id}`}
                  >
                    {activity.image ? (
                      <Image
                        alt=""
                        className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                        fill
                        sizes="72px"
                        src={activity.image}
                      />
                    ) : (
                      <span className="grid h-full place-items-center text-[#9B7627]">
                        <CalendarDays aria-hidden="true" className="size-6" strokeWidth={1.7} />
                      </span>
                    )}
                  </Link>
                  <div className="flex min-w-0 flex-1 gap-2.5">
                    <div className="grid h-11 w-10 shrink-0 place-items-center self-start rounded-xl bg-[#F3F0E9] text-center">
                      <span className="block text-[9px] font-black leading-none text-[#347A48]">
                        {date.weekday}
                      </span>
                      <span className="block text-base font-extrabold leading-none text-[#18231D]">
                        {date.day}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <Link
                        className="line-clamp-2 text-[13px] font-extrabold leading-[1.25rem] text-[#18231D] transition-colors group-hover:text-[#184B34]"
                        href={`/activities/${activity.id}`}
                      >
                        {activity.title}
                      </Link>
                      <p className="mt-0.5 truncate text-[11px] font-semibold text-[#687269]">
                        {villageName} · {activity.time}
                      </p>
                      {typeof activity.spotsLeft === "number" ? (
                        <p className="mt-1 text-[10px] font-extrabold text-[#347A48]">
                          {activity.spotsLeft} plazas disponibles
                        </p>
                      ) : activity.capacity > 0 ? (
                        <p className="mt-1 text-[10px] font-extrabold text-[#347A48]">
                          Aforo: {activity.capacity} plazas
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="px-4 py-6 text-center">
            <CalendarDays aria-hidden="true" className="mx-auto size-5 text-[#78947D]" />
            <p className="mt-2 text-xs font-semibold leading-5 text-[#687269]">
              {unavailableSources.activities
                ? "No hemos podido cargar las actividades. Puedes reintentarlo desde la agenda."
                : "No hay actividades publicadas ahora mismo."}
            </p>
          </div>
        )}
        {activities.length ? (
          <div className="px-3 pb-3">
            <Link
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#184B3418] bg-white/72 px-4 text-xs font-extrabold text-[#184B34] transition-colors hover:bg-white"
              href="/activities"
            >
              Explorar más actividades
            </Link>
          </div>
        ) : null}
      </Card>

      <Card className="overflow-hidden">
        <RailHeader href="/villages" title="Pueblos para descubrir" />
        {villages.length ? (
          <div className="divide-y divide-[#184B340d] px-3">
            {villages.slice(0, 3).map((village) => (
              <article className="flex items-center gap-3 py-3" key={village.id}>
                <Link
                  aria-label={`Ver ${village.name}`}
                  className="relative size-14 shrink-0 overflow-hidden rounded-[14px] bg-[#78947D1c]"
                  href={`/villages/${village.id}`}
                >
                  {village.image ? (
                    <Image
                      alt=""
                      className="object-cover"
                      fill
                      sizes="56px"
                      src={village.image}
                    />
                  ) : (
                    <span className="grid h-full place-items-center text-[#347A48]">
                      <Mountain aria-hidden="true" className="size-5" strokeWidth={1.7} />
                    </span>
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    className="block truncate text-[13px] font-extrabold text-[#18231D] hover:text-[#184B34]"
                    href={`/villages/${village.id}`}
                  >
                    {village.name}
                  </Link>
                  <p className="mt-0.5 truncate text-[10px] font-semibold text-[#687269]">
                    {village.population > 0 ? `${formatPopulation(village.population)} hab. · ` : ""}
                    {village.province}
                  </p>
                </div>
                <FollowButton
                  className="min-h-11 px-3 text-[10px]"
                  demo={village.dataSource === "demo"}
                  followedLabel="Siguiendo"
                  initialFollowing={village.isFollowing}
                  interactionSupported={canFollowVillage(village)}
                  label="Seguir"
                  storageKey={village.id}
                />
              </article>
            ))}
          </div>
        ) : (
          <div className="px-4 py-6 text-center">
            <MapPin aria-hidden="true" className="mx-auto size-5 text-[#78947D]" />
            <p className="mt-2 text-xs font-semibold leading-5 text-[#687269]">
              {unavailableSources.villages
                ? "No hemos podido cargar los pueblos. Puedes reintentarlo desde explorar pueblos."
                : "No hay pueblos disponibles para recomendar."}
            </p>
          </div>
        )}
      </Card>

      {inspiringPosts.length ? (
        <Card className="overflow-hidden">
          <RailHeader href="/community" title="Momentos que inspiran" />
          <div className="grid grid-cols-3 gap-2 p-3">
            {inspiringPosts.map((post) => (
              <figure className="min-w-0" key={post.id}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-[14px] bg-[#78947D1c]">
                  <Image
                    alt={post.title || `Momento compartido por ${post.author}`}
                    className="object-cover"
                    fill
                    sizes="96px"
                    src={post.image!}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E3325]/62 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 grid size-6 place-items-center rounded-full bg-white/88 text-[#184B34]">
                    <Camera aria-hidden="true" className="size-3" />
                  </span>
                </div>
                <figcaption className="mt-2 line-clamp-2 text-[10px] font-bold leading-4 text-[#435048]">
                  {post.title}
                </figcaption>
                <p className="mt-0.5 truncate text-[9px] font-semibold text-[#78947D]">
                  {post.authorHandle ?? post.author}
                </p>
              </figure>
            ))}
          </div>
        </Card>
      ) : null}

      <Card className="flex items-start gap-3 bg-[#78947D12] p-4 shadow-none">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/82 text-[#347A48]">
          <UsersRound aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
        </span>
        <div>
          <p className="text-xs font-extrabold text-[#184B34]">Una plaza hecha entre todos</p>
          <p className="mt-1 text-[11px] font-medium leading-5 text-[#687269]">
            Sigue pueblos y participa para personalizar lo que ves en comunidad.
          </p>
        </div>
      </Card>
    </div>
  );
}
