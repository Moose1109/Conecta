import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Clock3,
  MapPin,
  Sparkles,
} from "lucide-react";
import {
  ActivityCategoryIcon,
  activityCategoryLabelKey,
  activityCategoryPill,
} from "@/features/activities/activity-category-icon";
import { ActivityImage } from "@/features/activities/activity-image";
import { getTranslations } from "@/lib/i18n/get-translations";
import { formatDate } from "@/lib/utils";
import type { Activity } from "@/lib/types";

export async function ActivitiesHero({
  action,
  activity,
}: {
  action: ReactNode;
  activity?: Activity;
}) {
  const { t, locale } = await getTranslations();

  return (
    <section className="relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[#0E3325] text-white shadow-[0_24px_70px_rgba(14,51,37,0.18)]">
      <div className="topographic-pattern absolute inset-0 opacity-30" />
      <div className="absolute -left-24 -top-32 size-80 rounded-full bg-[#347A48]/38 blur-3xl" />
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
        <div className="relative z-10 flex min-w-0 flex-col justify-center px-6 py-8 sm:px-8 lg:min-h-[310px] lg:px-10 lg:py-9">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D7A63C]/25 bg-[#D7A63C]/12 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.13em] text-[#F1CA70]">
            <Sparkles aria-hidden="true" className="size-3.5" />
            {t("activities.hero.agendaEyebrow")}
          </p>
          <h1 className="mt-5 max-w-xl text-3xl font-extrabold leading-[1.06] tracking-[-0.04em] sm:text-4xl xl:text-5xl">
            {t("activities.hero.title")}
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/72 sm:text-base sm:leading-7">
            {t("activities.hero.description")}
          </p>
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {action}
          </div>
        </div>

        <div className="relative min-h-[285px] min-w-0 overflow-hidden border-t border-white/10 lg:min-h-[310px] lg:border-l lg:border-t-0">
          {activity ? (
            <ActivityImage
              activity={activity}
              className="transition-transform duration-700 hover:scale-[1.025]"
              eager
              preferBanner
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
          ) : (
            <>
              <Image
                alt={t("activities.hero.editorialImageAlt")}
                className="object-cover"
                fill
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 58vw"
                src="/images/raiz-market.webp"
              />
              <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-[#0E3325]/72 px-2.5 py-1 text-[0.66rem] font-extrabold text-white backdrop-blur-md">
                <Camera aria-hidden="true" className="size-3" />
                {t("activities.hero.editorialImageBadge")}
              </span>
            </>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,51,37,0.06)_10%,rgba(14,51,37,0.24)_48%,rgba(7,30,21,0.92)_100%)]" />

          {activity ? (
            <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full bg-[#FFFCF7]/94 px-3 py-1.5 text-xs font-extrabold shadow-sm ${activityCategoryPill(activity.category)}`}>
                  <ActivityCategoryIcon category={activity.category} className="size-3.5" />
                  {t(activityCategoryLabelKey(activity.category))}
                </span>
                <span className="rounded-full border border-white/20 bg-black/22 px-3 py-1.5 text-xs font-extrabold text-white backdrop-blur-md">
                  {t("activities.hero.featuredBadge")}
                </span>
              </div>
              <Link href={`/activities/${activity.id}`} className="group mt-3 block max-w-2xl">
                <h2 className="text-2xl font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-3xl">
                  {activity.title}
                </h2>
                <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-bold text-white/78 sm:text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays aria-hidden="true" className="size-4 text-[#F1CA70]" />
                    {formatDate(activity.date, locale)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 aria-hidden="true" className="size-4 text-[#F1CA70]" />
                    {activity.time}
                  </span>
                  {activity.location ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin aria-hidden="true" className="size-4 text-[#F1CA70]" />
                      {activity.location}
                    </span>
                  ) : null}
                </span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-white">
                  {t("activities.hero.viewActivity")}
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          ) : (
            <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#F1CA70]">
                {t("activities.hero.openAgendaEyebrow")}
              </p>
              <h2 className="mt-2 max-w-xl text-2xl font-extrabold tracking-[-0.025em]">
                {t("activities.hero.emptyTitle")}
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-white/72">
                {t("activities.hero.emptyDescription")}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
