"use client";

import Image from "next/image";
import { PencilLine } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/social/user-avatar";
import { useTranslations } from "@/components/i18n/i18n-provider";
import type { Translator } from "@/lib/i18n/translate";
import type { AuthUser } from "@/lib/types";

type ProfileStats = {
  posts?: number;
  activities?: number;
  followedVillages?: number;
};

function profileHandle(user: AuthUser | undefined, t: Translator["t"]) {
  if (user?.username) return `@${user.username.replace(/^@/, "")}`;
  return t("profile.header.defaultIdentity");
}

export function ProfileHeader({ user, stats }: { user?: AuthUser; stats: ProfileStats }) {
  const { t } = useTranslations();
  const name = user?.name ?? t("profile.header.defaultName");
  const customBannerUrl = user?.bannerUrl?.trim();

  return (
    <Card className="overflow-hidden rounded-[24px]">
      <div className="relative h-44 bg-[#0E3325] sm:h-52 lg:h-60">
        {customBannerUrl ? (
          <>
            <span className="sr-only">{t("profile.header.coverAlt", { name })}</span>
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${JSON.stringify(customBannerUrl)})` }}
            />
          </>
        ) : (
          <Image
            alt={t("profile.header.defaultCoverAlt")}
            className="object-cover"
            fill
            sizes="(max-width: 1024px) 100vw, 1100px"
            src="/images/raiz-village-hero.webp"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E3325]/52 via-transparent to-black/5" />
      </div>

      <div className="relative px-4 pb-6 sm:px-7 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="-mt-12 flex min-w-0 items-end gap-4 sm:-mt-14">
            <UserAvatar
              className="size-24 shrink-0 border-4 border-[#FFFCF7] bg-[#D7A63C] text-3xl ring-0 sm:size-28"
              imageUrl={user?.avatarUrl}
              name={name}
            />
            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="break-words text-3xl font-extrabold tracking-[-0.04em] text-[#0E3325] sm:text-4xl">{name}</h1>
              </div>
              <p className="mt-1 truncate text-sm font-extrabold text-[#347A48]">{profileHandle(user, t)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:mt-4">
            <LinkButton className="gap-2" href="/settings" variant="secondary">
              <PencilLine aria-hidden="true" className="size-4" />
              {t("userMenu.editProfile.label")}
            </LinkButton>
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <p className="max-w-2xl text-sm leading-6 text-[#687269]">
            {user?.bio ?? t("profile.header.defaultBio")}
          </p>
          <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-[#184B3412] bg-[#F8F5EE] px-4 py-3 text-center min-[430px]:grid-cols-3 sm:gap-8 sm:px-6">
            <Metric label={t("explore.postsLabel")} t={t} value={stats.posts} />
            <Metric label={t("profile.header.activitiesMetricLabel")} t={t} value={stats.activities} />
            <Metric className="col-span-2 min-[430px]:col-span-1" label={t("profile.header.followedVillagesLabel")} t={t} value={stats.followedVillages} />
          </dl>
        </div>
      </div>
    </Card>
  );
}

function Metric({ className = "", label, t, value }: { className?: string; label: string; t: Translator["t"]; value?: number }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <dt className="text-[10px] font-bold text-[#687269] sm:text-xs">{label}</dt>
      <dd
        aria-label={value === undefined ? t("profile.header.metricUnavailable", { label }) : undefined}
        className="order-first mb-0.5 text-lg font-extrabold text-[#0E3325] sm:text-xl"
      >
        {value ?? "—"}
      </dd>
    </div>
  );
}
