"use client";

import {
  CalendarDays,
  MapPinned,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/social/empty-state";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Button } from "@/components/ui/button";
import { Card, SectionHeader } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { getActivitiesStrict } from "@/lib/api/activities.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { logApiIssue } from "@/lib/api/error-message";
import { formatPopulation } from "@/lib/utils";
import { clearSession } from "@/lib/api/session";
import { getVillagesStrict } from "@/lib/api/villages.service";
import type { Activity, Village } from "@/lib/types";
import type { Translator } from "@/lib/i18n/translate";

type DashboardState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; activities: Activity[]; villages: Village[] };

export function AdminDashboard() {
  const { t, tPlural, locale } = useTranslations();
  const { token } = useAuthSession();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<DashboardState>({ status: "loading" });

  useEffect(() => {
    if (!token) {
      return;
    }

    let active = true;

    Promise.all([getActivitiesStrict(token), getVillagesStrict(token)])
      .then(([activities, villages]) => {
        if (active) {
          setState({ status: "ready", activities, villages });
        }
      })
      .catch((error) => {
        logApiIssue("Unable to load the admin dashboard", error);

        if (isUnauthorizedError(error)) {
          clearSession();
          return;
        }

        if (active) {
          setState({ status: "error" });
        }
      });

    return () => {
      active = false;
    };
  }, [attempt, token]);

  if (!token || state.status === "loading") {
    return (
      <section aria-labelledby="admin-loading-title">
        <span className="sr-only" id="admin-loading-title">
          {t("admin.loadingTitleSr")}
        </span>
        <LoadingState label={t("admin.loadingLabel")} variant="grid" />
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <Card className="p-7 text-center sm:p-9" role="alert">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#C96D4A1f] text-[#A95539]">
          <ShieldCheck aria-hidden="true" className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.025em] text-[#18231D]">
          {t("admin.loadErrorTitle")}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#687269]">
          {t("admin.loadErrorDescription")}
        </p>
        <Button
          className="mt-6"
          onClick={() => {
            setState({ status: "loading" });
            setAttempt((current) => current + 1);
          }}
          type="button"
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          {t("common.retry")}
        </Button>
      </Card>
    );
  }

  const { activities, villages } = state;

  return (
    <div>
      <SectionHeader
        eyebrow={t("admin.eyebrow")}
        title={t("admin.title")}
        description={t("admin.description")}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={MapPinned} label={t("admin.villagesLoadedLabel")} value={villages.length} />
        <Metric icon={CalendarDays} label={t("admin.activitiesLoadedLabel")} value={activities.length} />
        <PendingMetric label={t("admin.usersLabel")} t={t} />
        <PendingMetric label={t("admin.enrollmentsLabel")} t={t} />
      </div>

      <BackendPendingAlert
        actionHref="/community"
        actionLabel={t("common.backendPending.actionLabel")}
        compact
        className="mt-5"
        description={t("admin.pendingDescription")}
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <AdminList
          actionHref="/villages"
          emptyDescription={t("admin.noVillagesDescription")}
          emptyTitle={t("admin.noVillagesTitle")}
          icon={MapPinned}
          rows={villages.map((village) => ({
            id: village.id,
            main: village.name,
            meta: [
              village.province,
              village.population > 0
                ? t("community.rightRail.populationLabel", { population: formatPopulation(village.population, locale) })
                : t("admin.populationUnavailable"),
            ].join(" · "),
          }))}
          t={t}
          title={t("navigation.villages.label")}
        />
        <AdminList
          actionHref="/activities"
          emptyDescription={t("admin.noActivitiesDescription")}
          emptyTitle={t("admin.noActivitiesTitle")}
          icon={CalendarDays}
          rows={activities.map((activity) => ({
            id: activity.id,
            main: activity.title,
            meta: [
              activity.category,
              activity.capacity > 0 ? tPlural("admin.capacitySpots", activity.capacity) : t("admin.capacityUnavailable"),
            ].join(" · "),
          }))}
          t={t}
          title={t("navigation.activities.label")}
        />
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPinned;
  label: string;
  value: number;
}) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#78947D1f] text-[#184B34]">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div>
        <p className="text-sm font-bold text-[#687269]">{label}</p>
        <p className="mt-1 text-3xl font-black text-[#184B34]">{value}</p>
      </div>
    </Card>
  );
}

function PendingMetric({ label, t }: { label: string; t: Translator["t"] }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-bold text-[#687269]">{label}</p>
      <p className="mt-2 text-sm font-extrabold text-[#A95539]">{t("admin.noEndpointLabel")}</p>
    </Card>
  );
}

function AdminList({
  actionHref,
  emptyDescription,
  emptyTitle,
  icon,
  rows,
  t,
  title,
}: {
  actionHref: string;
  emptyDescription: string;
  emptyTitle: string;
  icon: typeof MapPinned;
  rows: Array<{ id: string; main: string; meta: string }>;
  t: Translator["t"];
  title: string;
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        actionHref={actionHref}
        actionLabel={t("admin.openCatalogAction")}
        description={emptyDescription}
        icon={icon}
        title={emptyTitle}
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[#184B341a] p-5">
        <h2 className="text-xl font-black text-[#18231D]">{title}</h2>
      </div>
      <div className="divide-y divide-[#184B341a]">
        {rows.map((row) => (
          <div className="p-5" key={row.id}>
            <p className="font-black text-[#18231D]">{row.main}</p>
            <p className="mt-1 text-sm text-[#687269]">{row.meta}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
