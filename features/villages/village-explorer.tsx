"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Compass,
  Map,
  MapPinned,
  SearchX,
  Sprout,
} from "lucide-react";
import { EmptyState } from "@/components/social/empty-state";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { VillageCard } from "@/features/villages/village-card";
import { isUnauthorizedError } from "@/lib/api/client";
import { logApiIssue } from "@/lib/api/error-message";
import { localeIntlTag } from "@/lib/i18n/config";
import { clearSession } from "@/lib/api/session";
import { getVillagesStrict } from "@/lib/api/villages.service";
import { cn } from "@/lib/utils";
import type { Village } from "@/lib/types";

const allRegions = "";

export function VillageExplorer({ villages: initialVillages }: { villages: Village[] }) {
  const { t, tPlural, locale } = useTranslations();
  const { token } = useAuthSession();
  const [authenticatedResult, setAuthenticatedResult] = useState<{
    failed?: boolean;
    token: string;
    villages?: Village[];
  }>();
  const [query, setQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState(allRegions);
  const currentResult =
    token && authenticatedResult?.token === token
      ? authenticatedResult
      : undefined;
  const villages = currentResult?.villages ?? initialVillages;

  useEffect(() => {
    if (!token) return;

    let active = true;

    getVillagesStrict(token)
      .then((nextVillages) => {
        if (active) {
          setAuthenticatedResult({ token, villages: nextVillages });
        }
      })
      .catch((error) => {
        logApiIssue("Unable to personalize the village list", error);
        if (!active) return;

        if (isUnauthorizedError(error)) {
          clearSession();
        } else {
          setAuthenticatedResult({ failed: true, token });
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  const regions = useMemo(
    () =>
      Array.from(
        new Set(
          villages
            .map((village) => village.region.trim())
            .filter((region) => region && region.toLowerCase() !== "sin región"),
        ),
      ).sort((left, right) => left.localeCompare(right, localeIntlTag[locale])),
    [villages, locale],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");

    return villages.filter((village) => {
      const matchesRegion = activeRegion === allRegions || village.region === activeRegion;
      const searchable = [
        village.name,
        village.province,
        village.region,
        village.description,
        village.tagline,
        village.highlights.join(" "),
      ]
        .join(" ")
        .toLocaleLowerCase("es");

      return matchesRegion && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [activeRegion, query, villages]);

  const firstVillages = filtered.slice(0, 3);
  const remainingVillages = filtered.slice(3);

  return (
    <div className="mt-5 grid gap-5 sm:mt-6">
      {currentResult?.failed ? (
        <Card className="border border-[#D7A63C45] bg-[#FFF8E8] p-4 text-sm font-bold leading-6 text-[#72551C]" role="status">
          {t("villages.explorer.personalizationError")}
        </Card>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <SearchInput
          label={t("villages.explorer.searchLabel")}
          placeholder={t("villages.explorer.searchPlaceholder")}
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
        />
        <a
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#184B3420] bg-white/90 px-5 text-sm font-extrabold text-[#184B34] shadow-[0_8px_24px_rgba(43,55,38,0.05)] transition hover:border-[#184B3438] hover:bg-white"
          href="#mapa-pendiente"
        >
          <Map aria-hidden="true" className="size-4" />
          {t("villages.explorer.viewOnMap")}
        </a>
      </div>

      {villages.length >= 100 ? (
        <p className="px-1 text-xs font-semibold leading-5 text-text-muted" role="status">
          {t("villages.explorer.resultsLimitNotice")}
        </p>
      ) : null}

      <div aria-label={t("villages.explorer.regionFilterAriaLabel")} className="flex max-w-full snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-x-visible [&::-webkit-scrollbar]:hidden">
        <button
          aria-pressed={activeRegion === allRegions}
          className={filterChipClass(activeRegion === allRegions)}
          type="button"
          onClick={() => setActiveRegion(allRegions)}
        >
          <Compass aria-hidden="true" className="size-4" />
          {t("villages.explorer.allRegionsLabel")}
        </button>
        {regions.map((region) => (
          <button
            key={region}
            aria-pressed={activeRegion === region}
            className={filterChipClass(activeRegion === region)}
            type="button"
            onClick={() => setActiveRegion(region)}
          >
            <MapPinned aria-hidden="true" className="size-4" />
            {region}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <>
          <Card className="overflow-hidden p-3 sm:p-4">
            <div className="grid gap-4 xl:grid-cols-[minmax(290px,0.72fr)_minmax(0,1.6fr)]">
              <TerritoryMapPending t={t} />

              <section aria-labelledby="pueblos-descubrir-title" className="min-w-0 p-1 sm:p-2">
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="eyebrow">{t("villages.explorer.exploreEyebrow")}</p>
                    <h2
                      className="mt-1.5 text-2xl font-extrabold tracking-[-0.035em] text-[#18231D]"
                      id="pueblos-descubrir-title"
                    >
                      {t("community.rightRail.villagesTitle")}
                    </h2>
                  </div>
                  <span className="hidden rounded-full bg-[#78947D17] px-3 py-1.5 text-xs font-bold text-[#184B34] sm:inline-flex">
                    {tPlural("villages.explorer.resultsCount", filtered.length)}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {firstVillages.map((village) => (
                    <VillageCard key={village.id} village={village} compact />
                  ))}
                </div>
              </section>
            </div>
          </Card>

          {remainingVillages.length ? (
            <section aria-labelledby="todos-pueblos-title" className="mt-1">
              <div className="mb-4 flex items-end justify-between gap-4 px-1">
                <div>
                  <p className="eyebrow">{t("villages.explorer.moreLocationsEyebrow")}</p>
                  <h2
                    className="mt-1.5 text-2xl font-extrabold tracking-[-0.035em] text-[#18231D]"
                    id="todos-pueblos-title"
                  >
                    {t("villages.explorer.keepExploringTitle")}
                  </h2>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {remainingVillages.map((village) => (
                  <VillageCard key={village.id} village={village} />
                ))}
              </div>
            </section>
          ) : null}

          <VillageLifeCard t={t} />
        </>
      ) : (
        <EmptyState
          actionHref={villages.length ? undefined : "/community"}
          actionLabel={villages.length ? t("community.feed.clearFilters") : t("common.backendPending.actionLabel")}
          description={t("villages.explorer.emptyDescription")}
          icon={SearchX}
          onAction={villages.length ? () => {
            setActiveRegion(allRegions);
            setQuery("");
          } : undefined}
          title={t("villages.explorer.emptyTitle")}
        />
      )}
    </div>
  );
}

function filterChipClass(active: boolean) {
  return cn(
    "inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-full border px-4 text-xs font-extrabold transition-colors focus:outline-none focus:ring-4 focus:ring-[#347A481c]",
    active
      ? "border-[#347A48] bg-[#347A48] text-white shadow-[0_8px_20px_rgba(52,122,72,0.18)]"
      : "border-[#184B341a] bg-white/82 text-[#184B34] hover:border-[#184B3430] hover:bg-white",
  );
}

function TerritoryMapPending({ t }: { t: ReturnType<typeof useTranslations>["t"] }) {
  return (
    <section
      className="topographic-pattern relative isolate min-h-[340px] overflow-hidden rounded-[22px] bg-[linear-gradient(145deg,#E8ECDD_0%,#F8F0DE_54%,#DFE8D9_100%)] p-4 sm:p-5"
      id="mapa-pendiente"
      aria-labelledby="mapa-pendiente-title"
    >
      <div className="absolute -left-16 top-8 size-52 rounded-full border border-[#60818A26]" />
      <div className="absolute -left-6 top-20 size-64 rounded-full border border-[#60818A1f]" />
      <div className="absolute -right-20 bottom-[-5rem] size-72 rounded-full border border-[#D7A63C33]" />
      <div className="relative z-10 flex h-full min-h-[300px] flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{t("villages.explorer.mapViewEyebrow")}</p>
            <h2
              className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] text-[#18231D]"
              id="mapa-pendiente-title"
            >
              {t("villages.explorer.mapViewTitle")}
            </h2>
          </div>
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/76 text-[#60818A] shadow-sm">
            <Map aria-hidden="true" className="size-5" />
          </span>
        </div>

        <div className="mt-auto pt-8">
          <BackendPendingAlert
            actionHref="#pueblos-descubrir-title"
            actionLabel={t("villages.explorer.mapPendingAction")}
            compact
            className="bg-[#FFFCF7]/88 backdrop-blur-md"
            description={t("villages.explorer.mapPendingDescription")}
            title={t("villages.explorer.mapPendingTitle")}
          />
        </div>
      </div>
    </section>
  );
}

function VillageLifeCard({ t }: { t: ReturnType<typeof useTranslations>["t"] }) {
  return (
    <section className="relative isolate mt-1 min-h-[230px] overflow-hidden rounded-[26px] border border-white/40 bg-[#184B34] shadow-[0_18px_52px_rgba(33,58,40,0.12)]">
      <Image
        alt={t("villages.explorer.lifeCardImageAlt")}
        className="object-cover"
        fill
        sizes="(max-width: 1024px) 100vw, 1160px"
        src="/images/raiz-market.webp"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,51,37,0.94)_0%,rgba(14,51,37,0.78)_42%,rgba(14,51,37,0.16)_78%)]" />
      <div className="relative z-10 flex min-h-[230px] max-w-xl flex-col justify-center p-6 text-white sm:p-8">
        <p className="inline-flex w-fit items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#F4D486]">
          <Sprout aria-hidden="true" className="size-4" />
          {t("villages.explorer.lifeCardEyebrow")}
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
          {t("villages.explorer.lifeCardTitle")}
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-6 text-white/76">
          {t("villages.explorer.lifeCardDescription")}
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-[#184B34] transition hover:bg-[#F7F2E8]"
          href="/community"
        >
          {t("common.backendPending.actionLabel")}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
