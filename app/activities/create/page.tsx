import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  MapPin,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { connection } from "next/server";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { CreateActivityForm } from "@/features/activities/create-activity-form";
import { AuthGate } from "@/features/auth/auth-gate";
import { getActivityCategories } from "@/lib/api/activities.service";
import { getVillagesStrict } from "@/lib/api/villages.service";
import { getTranslations } from "@/lib/i18n/get-translations";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t("activities.create.metaTitle") };
}

export default async function CreateActivityPage() {
  await connection();

  const { t } = await getTranslations();
  const publishingTips = [
    { icon: CalendarDays, text: t("activities.create.tipDate") },
    { icon: MapPin, text: t("activities.create.tipLocation") },
    { icon: UsersRound, text: t("activities.create.tipCapacity") },
  ];
  const activityCategories = getActivityCategories();
  const villagesResult = await getVillagesStrict()
    .then((villages) => ({ ok: true as const, villages }))
    .catch((error: unknown) => {
      if (process.env.NODE_ENV === "development") {
        console.warn("Unable to load villages for activity creation:", error);
      }
      return { ok: false as const, villages: [] };
    });

  return (
    <AuthenticatedShell>
      <AuthGate message={t("villages.detail.createActivityAuthRequired")}>
        <div className="mx-auto max-w-6xl">
          <Link
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-extrabold text-[#526158] transition hover:bg-[#184B340d] hover:text-[#184B34]"
            href="/activities"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {t("activities.detail.backToActivities")}
          </Link>

          <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">
            <div className="min-w-0">
              <header className="mb-6 rounded-[24px] border border-[#184B3418] bg-[#FFFCF7]/72 p-6 shadow-[0_12px_34px_rgba(43,55,38,0.05)] sm:p-7">
                <p className="eyebrow flex items-center gap-2">
                  <Sparkles aria-hidden="true" className="size-3.5" />
                  {t("activities.create.newActivityEyebrow")}
                </p>
                <h1 className="mt-3 max-w-2xl text-3xl font-extrabold leading-[1.08] tracking-[-0.04em] text-[#18231D] sm:text-4xl">
                  {t("activities.create.title")}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#677168] sm:text-base sm:leading-7">
                  {t("activities.create.description")}
                </p>
              </header>

              {villagesResult.ok ? (
                <Card className="p-5 sm:p-7 lg:p-8">
                  <CreateActivityForm
                    categories={activityCategories}
                    villages={villagesResult.villages}
                  />
                </Card>
              ) : (
                <ErrorState
                  actionHref="/activities/create"
                  actionLabel={t("common.retry")}
                  description={t("activities.create.formErrorDescription")}
                  network
                  title={t("activities.create.formErrorTitle")}
                />
              )}
            </div>

            <aside className="min-w-0 xl:sticky xl:top-24 xl:self-start">
              <Card className="overflow-hidden rounded-[22px]">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#D9E0D7]">
                  <Image
                    alt={t("activities.hero.editorialImageAlt")}
                    className="object-cover"
                    fill
                    sizes="(max-width: 1280px) 100vw, 310px"
                    src="/images/raiz-market.webp"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E3325]/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full border border-white/24 bg-[#0E3325]/72 px-2.5 py-1 text-[0.65rem] font-extrabold text-white backdrop-blur-md">
                    {t("activities.hero.editorialImageBadge")}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-[#347A48]">
                    {t("activities.create.beforePublishingLabel")}
                  </p>
                  <h2 className="mt-2 text-xl font-extrabold tracking-[-0.025em] text-[#18231D]">
                    {t("activities.create.clearFormTitle")}
                  </h2>
                  <div className="mt-5 grid gap-4">
                    {publishingTips.map(({ icon: Icon, text }) => (
                      <div className="flex items-start gap-3" key={text}>
                        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#78947D1f] text-[#184B34]">
                          <Icon aria-hidden="true" className="size-4" />
                        </span>
                        <p className="pt-1 text-sm leading-5 text-[#677168]">{text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-[#D7A63C17] p-3.5 text-xs font-bold leading-5 text-[#6D5215]">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                    {t("activities.create.reviewNotice")}
                  </div>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </AuthGate>
    </AuthenticatedShell>
  );
}
