"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, FileText, Landmark, MapPin } from "lucide-react";
import { FollowButton } from "@/components/social/follow-button";
import { Card } from "@/components/ui/card";
import { RemoteEntityImage } from "@/components/ui/remote-entity-image";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { canFollowVillage } from "@/lib/api/entity-capabilities";
import { formatPopulation } from "@/lib/utils";
import type { Village } from "@/lib/types";

export function VillageCard({
  village,
  compact = false,
  showFollowAction = true,
}: {
  village: Village;
  compact?: boolean;
  showFollowAction?: boolean;
}) {
  const { t, tPlural, locale } = useTranslations();
  const image = village.image ?? village.bannerImage;
  const hasPopulation = village.population > 0;
  const hasActivityCount =
    typeof village.activitiesCount === "number" && village.activitiesCount > 0;
  const hasPostCount = typeof village.postsCount === "number" && village.postsCount > 0;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-[#184B3429] hover:shadow-[0_22px_58px_rgba(33,58,40,0.13)]">
      <Link
        aria-label={t("community.rightRail.ariaViewVillage", { name: village.name })}
        className="relative block overflow-hidden"
        href={`/villages/${village.id}`}
      >
        <div className={compact ? "relative aspect-[16/8]" : "relative aspect-[16/10]"}>
          <RemoteEntityImage
            alt={village.name}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            fill
            sizes={compact ? "(max-width: 1024px) 100vw, 280px" : "(max-width: 768px) 100vw, 33vw"}
            src={image}
            fallback={
              <div className="topographic-pattern grid h-full place-items-center bg-[linear-gradient(145deg,#184B34,#78947D)] text-white">
                <span className="grid size-14 place-items-center rounded-[20px] border border-white/18 bg-white/12 backdrop-blur">
                  <Landmark aria-hidden="true" className="size-6" strokeWidth={1.7} />
                </span>
              </div>
            }
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E3325]/62 via-transparent to-black/5" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-[#FFFCF7]/92 px-3 py-1.5 text-[11px] font-extrabold text-[#184B34] shadow-sm backdrop-blur">
          <MapPin aria-hidden="true" className="size-3.5" />
          {village.region}
        </span>
      </Link>

      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-[#677168]">
          <span>{village.province}</span>
          {hasPopulation ? (
            <>
              <span aria-hidden="true" className="size-1 rounded-full bg-[#D7A63C]" />
              <span>{t("community.rightRail.populationLabel", { population: formatPopulation(village.population, locale) })}</span>
            </>
          ) : null}
        </div>

        <Link className="mt-2 inline-flex items-start gap-2" href={`/villages/${village.id}`}>
          <h2
            className={
              compact
                ? "text-lg font-extrabold leading-snug tracking-[-0.025em] text-[#18231D]"
                : "text-[1.35rem] font-extrabold leading-snug tracking-[-0.03em] text-[#18231D]"
            }
          >
            {village.name}
          </h2>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-1 size-4 shrink-0 text-[#347A48] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>

        {village.tagline ? (
          <p
            className={`mt-2 text-sm leading-6 text-[#677168] ${compact ? "line-clamp-1" : "line-clamp-2"}`}
          >
            {village.tagline}
          </p>
        ) : null}

        {!compact && (hasActivityCount || hasPostCount) ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {hasActivityCount ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#78947D17] px-2.5 py-1.5 text-[11px] font-bold text-[#184B34]">
                <CalendarDays aria-hidden="true" className="size-3.5" />
                {tPlural("villages.card.activitiesCount", village.activitiesCount ?? 0)}
              </span>
            ) : null}
            {hasPostCount ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D7A63C1c] px-2.5 py-1.5 text-[11px] font-bold text-[#745312]">
                <FileText aria-hidden="true" className="size-3.5" />
                {tPlural("villages.card.postsCount", village.postsCount ?? 0)}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className={`mt-auto flex items-end gap-3 border-t border-[#184B3414] pt-4 ${showFollowAction ? "justify-between" : "justify-end"}`}>
          {showFollowAction ? (
            <FollowButton
              className="min-h-11 px-3.5 text-xs"
              demo={village.dataSource === "demo"}
              initialFollowing={village.isFollowing}
              interactionSupported={canFollowVillage(village)}
              storageKey={village.id}
            />
          ) : null}
          <Link
            aria-label={t("villages.card.openVillageProfile", { name: village.name })}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-[#184B341c] bg-white text-[#184B34] transition-colors hover:bg-[#184B34] hover:text-white"
            href={`/villages/${village.id}`}
          >
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
