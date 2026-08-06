"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import {
  CalendarDays,
  CalendarSearch,
  ChevronDown,
  MapPin,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { EmptyState } from "@/components/social/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { SearchInput } from "@/components/ui/search-input";
import { ActivityCard } from "@/features/activities/activity-card";
import {
  ActivityCategoryIcon,
  activityCategoryLabelKey,
  activityCategoryPill,
} from "@/features/activities/activity-category-icon";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { getActivitiesStrict } from "@/lib/api/activities.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { logApiIssue } from "@/lib/api/error-message";
import { clearSession } from "@/lib/api/session";
import { getVillagesStrict } from "@/lib/api/villages.service";
import { cn } from "@/lib/utils";
import type { Activity, ActivityCategory, Village } from "@/lib/types";

export type ActivityExplorerFilters = {
  category: ActivityCategory | "";
  dateFrom: string;
  dateTo: string;
  search: string;
  villageId: string;
};

type FilterChanges = Partial<ActivityExplorerFilters>;

export function ActivityExplorer({
  activities: initialActivities,
  activitiesUnavailable: initialActivitiesUnavailable = false,
  categories,
  filters,
  villages: initialVillages,
  villagesUnavailable: initialVillagesUnavailable = false,
}: {
  activities: Activity[];
  activitiesUnavailable?: boolean;
  categories: ActivityCategory[];
  filters: ActivityExplorerFilters;
  villages: Village[];
  villagesUnavailable?: boolean;
}) {
  const router = useRouter();
  const { t, tPlural } = useTranslations();
  const { token } = useAuthSession();
  const [isNavigating, startNavigation] = useTransition();
  const [search, setSearch] = useState(filters.search);
  const [villageId, setVillageId] = useState(filters.villageId);
  const [dateFrom, setDateFrom] = useState(filters.dateFrom);
  const [dateTo, setDateTo] = useState(filters.dateTo);
  const [authenticatedResult, setAuthenticatedResult] = useState<{
    activities?: Activity[];
    activitiesUnavailable?: boolean;
    failed?: boolean;
    token: string;
    villages?: Village[];
    villagesUnavailable?: boolean;
  }>();
  const currentResult = token && authenticatedResult?.token === token
    ? authenticatedResult
    : undefined;
  const activities = currentResult?.activities ?? initialActivities;
  const villages = currentResult?.villages ?? initialVillages;
  const activitiesUnavailable =
    currentResult?.activities === undefined && initialActivitiesUnavailable;
  const villagesUnavailable =
    currentResult?.villages === undefined && initialVillagesUnavailable;
  const dateRangeInvalid = Boolean(dateFrom && dateTo && dateFrom > dateTo);
  const hasFilters = Boolean(
    search.trim() || filters.category || villageId || dateFrom || dateTo,
  );

  useEffect(() => {
    if (!token) return;

    let active = true;

    Promise.allSettled([
      getActivitiesStrict(token, {
        category: filters.category || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        search: filters.search || undefined,
        villageId: filters.villageId || undefined,
      }),
      getVillagesStrict(token),
    ]).then(([activitiesResult, villagesResult]) => {
      if (!active) return;

      const rejectedResults = [activitiesResult, villagesResult]
        .filter((result): result is PromiseRejectedResult => result.status === "rejected");

      if (rejectedResults.some((result) => isUnauthorizedError(result.reason))) {
        clearSession();
        return;
      }

      rejectedResults.forEach((result) => {
        logApiIssue("Unable to personalize part of the activity list", result.reason);
      });

      setAuthenticatedResult({
        activities: activitiesResult.status === "fulfilled" ? activitiesResult.value : undefined,
        activitiesUnavailable:
          activitiesResult.status === "rejected" && initialActivitiesUnavailable,
        failed: rejectedResults.length > 0,
        token,
        villages: villagesResult.status === "fulfilled" ? villagesResult.value : undefined,
        villagesUnavailable:
          villagesResult.status === "rejected" && initialVillagesUnavailable,
      });
    });

    return () => {
      active = false;
    };
  }, [
    filters.category,
    filters.dateFrom,
    filters.dateTo,
    filters.search,
    filters.villageId,
    initialActivitiesUnavailable,
    initialVillagesUnavailable,
    token,
  ]);

  const villageName = useMemo(
    () => villages.find((village) => village.id === villageId)?.name,
    [villageId, villages],
  );

  function filterHref(changes: FilterChanges = {}) {
    const next = {
      ...filters,
      dateFrom,
      dateTo,
      search,
      villageId,
      ...changes,
    };
    const params = new URLSearchParams();

    if (next.search.trim()) params.set("search", next.search.trim());
    if (next.category) params.set("category", next.category);
    if (next.villageId) params.set("village_id", next.villageId);
    if (next.dateFrom) params.set("date_from", next.dateFrom);
    if (next.dateTo) params.set("date_to", next.dateTo);

    const query = params.toString();
    return `/activities${query ? `?${query}` : ""}#agenda`;
  }

  function navigate(changes: FilterChanges) {
    startNavigation(() => router.push(filterHref(changes)));
  }

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (dateRangeInvalid) return;

    navigate({ dateFrom, dateTo, search, villageId });
  }

  function clearSearch() {
    setSearch("");
    if (filters.search) navigate({ search: "" });
  }

  function clearAllFilters() {
    setSearch("");
    setVillageId("");
    setDateFrom("");
    setDateTo("");
    navigate({ category: "", dateFrom: "", dateTo: "", search: "", villageId: "" });
  }

  return (
    <section aria-labelledby="activities-list-title" className="mt-7 min-w-0">
      {currentResult?.failed ? (
        <Card className="mb-5 border border-[#D7A63C45] bg-[#FFF8E8] p-4 text-sm font-bold leading-6 text-[#72551C]" role="status">
          {t("activities.explorer.personalizationError")}
        </Card>
      ) : null}
      {villagesUnavailable ? (
        <Card className="mb-5 border border-[#D7A63C45] bg-[#FFF8E8] p-4 text-sm font-bold leading-6 text-[#72551C]" role="status">
          {t("activities.explorer.villagesLoadError")}
        </Card>
      ) : null}

      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <p className="eyebrow">{t("activities.explorer.exploreEyebrow")}</p>
          <h2 className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] text-text-primary sm:text-3xl" id="activities-list-title">
            {t("activities.explorer.title")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-muted">
            {t("activities.explorer.description")}
          </p>
        </div>
        <div className="shrink-0 text-right text-xs font-extrabold text-text-muted">
          <p aria-live="polite">
            {isNavigating
              ? t("activities.explorer.searching")
              : tPlural("villages.card.activitiesCount", activities.length)}
          </p>
          {activities.length >= 100 ? (
            <p className="mt-1 max-w-xs font-semibold leading-5">
              {t("activities.explorer.resultsLimitNotice")}
            </p>
          ) : null}
        </div>
      </div>

      <form
        action="/activities#agenda"
        className="min-w-0 rounded-[22px] border border-[#184B341a] bg-[#FFFCF7]/92 p-3 shadow-[0_12px_34px_rgba(43,55,38,0.06)] sm:p-4"
        onSubmit={applyFilters}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_minmax(180px,0.65fr)_minmax(145px,0.5fr)_minmax(145px,0.5fr)_auto]">
          <SearchInput
            className="sm:col-span-2 md:col-span-1 xl:col-span-1"
            label={t("activities.explorer.searchLabel")}
            name="search"
            onChange={setSearch}
            onClear={clearSearch}
            placeholder={t("activities.explorer.searchPlaceholder")}
            value={search}
          />

          <label className="relative block min-w-0 sm:col-span-2 md:col-span-1 xl:col-span-1">
            <span className="sr-only">{t("activities.explorer.villageFilterSrLabel")}</span>
            <MapPin aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 size-4.5 -translate-y-1/2 text-mineral" />
            <select
              aria-label={t("activities.explorer.villageFilterAriaLabel")}
              className="min-h-12 w-full appearance-none rounded-full border border-[#184B3420] bg-white/90 py-3 pl-11 pr-10 text-sm font-bold text-text-primary outline-none transition hover:bg-white focus:border-forest-mid focus:ring-4 focus:ring-[#347A481f]"
              name="village_id"
              onChange={(event) => setVillageId(event.target.value)}
              value={villageId}
            >
              <option value="">{t("activities.explorer.allVillagesOption")}</option>
              {villages.map((village) => (
                <option key={village.id} value={village.id}>{village.name}</option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          </label>

          <label className="relative block min-w-0">
            <span className="sr-only">{t("activities.explorer.dateFromSrLabel")}</span>
            <CalendarDays aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-mineral" />
            <input
              aria-label={t("activities.explorer.dateFromSrLabel")}
              className="min-h-12 w-full rounded-full border border-[#184B3420] bg-white/90 py-2 pl-11 pr-3 text-sm font-bold text-text-primary outline-none focus:border-forest-mid focus:ring-4 focus:ring-[#347A481f]"
              max={dateTo || undefined}
              name="date_from"
              onChange={(event) => setDateFrom(event.target.value)}
              type="date"
              value={dateFrom}
            />
          </label>

          <label className="relative block min-w-0">
            <span className="sr-only">{t("activities.explorer.dateToSrLabel")}</span>
            <CalendarDays aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-mineral" />
            <input
              aria-describedby={dateRangeInvalid ? "activity-date-error" : undefined}
              aria-invalid={dateRangeInvalid || undefined}
              aria-label={t("activities.explorer.dateToSrLabel")}
              className="min-h-12 w-full rounded-full border border-[#184B3420] bg-white/90 py-2 pl-11 pr-3 text-sm font-bold text-text-primary outline-none focus:border-forest-mid focus:ring-4 focus:ring-[#347A481f]"
              min={dateFrom || undefined}
              name="date_to"
              onChange={(event) => setDateTo(event.target.value)}
              type="date"
              value={dateTo}
            />
          </label>

          <Button className="min-h-12 w-full px-5 sm:col-span-2 xl:col-span-1 xl:w-auto" disabled={dateRangeInvalid || isNavigating} type="submit">
            <SlidersHorizontal aria-hidden="true" className="size-4" />
            {t("activities.explorer.applyAction")}
          </Button>
        </div>

        {filters.category ? <input name="category" type="hidden" value={filters.category} /> : null}
        {dateRangeInvalid ? (
          <p className="mt-2 text-xs font-bold text-danger" id="activity-date-error" role="alert">
            {t("activities.explorer.dateRangeError")}
          </p>
        ) : null}

        <div className="mt-3 flex snap-x items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-x-visible [&::-webkit-scrollbar]:hidden">
          <span className="mr-1 hidden shrink-0 items-center gap-1.5 text-xs font-extrabold text-text-muted sm:inline-flex">
            <SlidersHorizontal aria-hidden="true" className="size-3.5" /> {t("activities.explorer.filtersLabel")}
          </span>
          <Link
            aria-current={!filters.category ? "true" : undefined}
            className={cn(
              "inline-flex min-h-11 shrink-0 snap-start items-center rounded-full border px-3.5 text-xs font-extrabold transition",
              !filters.category
                ? "border-primary bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(24,75,52,0.17)]"
                : "border-[#184B341a] bg-white/84 text-[#526158] hover:border-[#184B3430] hover:text-primary",
            )}
            href={filterHref({ category: "" })}
          >
            {t("activities.explorer.allCategoriesLabel")}
          </Link>
          {categories.map((item) => (
            <Link
              aria-current={filters.category === item ? "true" : undefined}
              className={cn(
                "inline-flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-full px-3.5 text-xs font-extrabold transition",
                filters.category === item
                  ? "border border-primary bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(24,75,52,0.17)]"
                  : activityCategoryPill(item),
              )}
              href={filterHref({ category: item })}
              key={item}
            >
              <ActivityCategoryIcon category={item} className="size-3.5" />
              {t(activityCategoryLabelKey(item))}
            </Link>
          ))}
        </div>

        {hasFilters ? (
          <div aria-label={t("activities.explorer.activeFiltersLabel")} className="mt-3 flex flex-wrap items-center gap-2">
            {search.trim() ? <ActiveFilter label={t("activities.explorer.textFilterLabel", { value: search.trim() })} href={filterHref({ search: "" })} onClick={() => setSearch("")} t={t} /> : null}
            {filters.category ? <ActiveFilter label={t(activityCategoryLabelKey(filters.category))} href={filterHref({ category: "" })} t={t} /> : null}
            {villageId ? <ActiveFilter label={villageName ?? t("activities.explorer.villageSelectedFallback")} href={filterHref({ villageId: "" })} onClick={() => setVillageId("")} t={t} /> : null}
            {dateFrom ? <ActiveFilter label={t("activities.explorer.fromDateLabel", { date: dateFrom })} href={filterHref({ dateFrom: "" })} onClick={() => setDateFrom("")} t={t} /> : null}
            {dateTo ? <ActiveFilter label={t("activities.explorer.toDateLabel", { date: dateTo })} href={filterHref({ dateTo: "" })} onClick={() => setDateTo("")} t={t} /> : null}
            <Button className="ml-auto min-h-11 px-3 text-xs" onClick={clearAllFilters} type="button" variant="ghost">
              <X aria-hidden="true" className="size-3.5" /> {t("activities.explorer.clearAllAction")}
            </Button>
          </div>
        ) : null}
      </form>

      <div className="mt-5">
        {activitiesUnavailable ? (
          <ErrorState
            actionHref={filterHref()}
            actionLabel={t("common.retry")}
            description={t("activities.explorer.loadErrorDescription")}
            network
            title={t("villages.detail.activitiesErrorTitle")}
          />
        ) : activities.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {activities.map((activity, index) => {
              const village = villages.find((item) => item.id === activity.villageId);

              return (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  eager={index === 0}
                  villageName={activity.villageName ?? village?.name}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            actionHref={hasFilters ? undefined : "/activities/create"}
            actionLabel={hasFilters ? t("community.feed.clearFilters") : t("activities.createForm.submit")}
            description={
              hasFilters
                ? t("activities.explorer.emptyFilteredDescription")
                : t("activities.explorer.emptyNoActivitiesDescription")
            }
            icon={CalendarSearch}
            onAction={hasFilters ? () => navigate({ category: "", dateFrom: "", dateTo: "", search: "", villageId: "" }) : undefined}
            title={hasFilters ? t("activities.explorer.emptyFilteredTitle") : t("activities.hero.emptyTitle")}
          />
        )}
      </div>
    </section>
  );
}

function ActiveFilter({
  href,
  label,
  onClick,
  t,
}: {
  href: string;
  label: string;
  onClick?: () => void;
  t: ReturnType<typeof useTranslations>["t"];
}) {
  return (
    <Link
      aria-label={t("activities.explorer.removeFilterAria", { label })}
      className="inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-full border border-[#184B341a] bg-[#78947D12] px-3 text-xs font-extrabold text-primary hover:border-[#184B3430] hover:bg-[#78947D1c]"
      href={href}
      onClick={onClick}
    >
      <span className="max-w-52 truncate">{label}</span>
      <X aria-hidden="true" className="size-3.5 shrink-0" />
    </Link>
  );
}
