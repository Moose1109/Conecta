import { Suspense } from "react";
import type { Metadata } from "next";
import { CalendarSearch, Plus } from "lucide-react";
import { connection } from "next/server";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { ActivitiesHero } from "@/features/activities/activities-hero";
import { ActivityExplorer } from "@/features/activities/activity-explorer";
import type { ActivityExplorerFilters } from "@/features/activities/activity-explorer";
import { ActivitiesPageSkeleton } from "@/features/activities/activities-loading";
import { ProtectedLinkButton } from "@/features/auth/protected-link-button";
import {
  getActivitiesStrict,
  getActivityCategories,
} from "@/lib/api/activities.service";
import { getVillagesStrict } from "@/lib/api/villages.service";
import { getTranslations } from "@/lib/i18n/get-translations";
import type { ActivityCategory } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t("navigation.activities.label") };
}

type ActivityPageSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: ActivityPageSearchParams;
}) {
  await connection();

  return (
    <AuthenticatedShell>
      <Suspense fallback={<ActivitiesPageSkeleton />}>
        <ActivitiesContent searchParams={searchParams} />
      </Suspense>
    </AuthenticatedShell>
  );
}

async function ActivitiesContent({ searchParams }: { searchParams: ActivityPageSearchParams }) {
  const { t } = await getTranslations();
  const activityCategories = getActivityCategories();
  const filters = activityFilters(await searchParams, activityCategories);
  const [activitiesResult, villagesResult] = await Promise.allSettled([
    getActivitiesStrict(undefined, {
      category: filters.category || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      search: filters.search || undefined,
      villageId: filters.villageId || undefined,
    }),
    getVillagesStrict(),
  ]);
  const activitiesUnavailable = activitiesResult.status === "rejected";
  const villagesUnavailable = villagesResult.status === "rejected";
  const activities = activitiesResult.status === "fulfilled" ? activitiesResult.value : [];
  const villages = villagesResult.status === "fulfilled" ? villagesResult.value : [];

  if (process.env.NODE_ENV === "development") {
    if (activitiesResult.status === "rejected") {
      console.warn("Unable to load the public activity list:", activitiesResult.reason);
    }
    if (villagesResult.status === "rejected") {
      console.warn("Unable to load villages for activity filters:", villagesResult.reason);
    }
  }
  const featuredActivity = activities[0];

  return (
    <>
      <ActivitiesHero
        activity={featuredActivity}
        action={
          <>
            <ProtectedLinkButton
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#D7A63C] px-5 py-2.5 text-sm font-extrabold text-[#18231D] shadow-[0_10px_26px_rgba(215,166,60,0.22)] transition hover:-translate-y-0.5 hover:bg-[#E1B550] focus:outline-none focus:ring-4 focus:ring-white/20"
              href="/activities/create"
              message={t("villages.detail.createActivityAuthRequired")}
            >
              <Plus aria-hidden="true" className="size-4" />
              {t("activities.createForm.submit")}
            </ProtectedLinkButton>
            <a
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/24 bg-white/9 px-5 py-2.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/15"
              href="#agenda"
            >
              <CalendarSearch aria-hidden="true" className="size-4" />
              {t("activities.exploreAgendaAction")}
            </a>
          </>
        }
      />
      <div className="min-w-0" id="agenda">
        <ActivityExplorer
          key={JSON.stringify(filters)}
          activities={activities}
          activitiesUnavailable={activitiesUnavailable}
          categories={activityCategories}
          filters={filters}
          villages={villages}
          villagesUnavailable={villagesUnavailable}
        />
      </div>
    </>
  );
}

function activityFilters(
  params: Record<string, string | string[] | undefined>,
  categories: ActivityCategory[],
): ActivityExplorerFilters {
  const search = firstValue(params.search).trim().slice(0, 160);
  const categoryValue = firstValue(params.category);
  const category = categories.includes(categoryValue as ActivityCategory)
    ? categoryValue as ActivityCategory
    : "";
  const villageValue = firstValue(params.village_id);
  const villageId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(villageValue)
    ? villageValue
    : "";

  return {
    category,
    dateFrom: validDate(firstValue(params.date_from)),
    dateTo: validDate(firstValue(params.date_to)),
    search,
    villageId,
  };
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}
