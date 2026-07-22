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
import { useAuthSession } from "@/features/auth/use-auth-session";
import { getActivitiesStrict } from "@/lib/api/activities.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { logApiIssue } from "@/lib/api/error-message";
import { clearSession } from "@/lib/api/session";
import { getVillagesStrict } from "@/lib/api/villages.service";
import type { Activity, Village } from "@/lib/types";

type DashboardState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; activities: Activity[]; villages: Village[] };

export function AdminDashboard() {
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
          Cargando panel operativo
        </span>
        <LoadingState label="Cargando datos del panel de administración" variant="grid" />
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
          No hemos podido cargar el panel
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#687269]">
          Tus permisos ya están confirmados, pero los catálogos no están disponibles ahora mismo.
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
          Reintentar
        </Button>
      </Card>
    );
  }

  const { activities, villages } = state;

  return (
    <div>
      <SectionHeader
        eyebrow="Administración"
        title="Panel operativo"
        description="Consulta los catálogos disponibles después de validar tus permisos de administración."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={MapPinned} label="Pueblos cargados" value={villages.length} />
        <Metric icon={CalendarDays} label="Actividades cargadas" value={activities.length} />
        <PendingMetric label="Usuarios" />
        <PendingMetric label="Inscripciones" />
      </div>

      <BackendPendingAlert
        actionHref="/community"
        actionLabel="Ir a comunidad"
        compact
        className="mt-5"
        description="El catálogo de usuarios, los totales globales y las métricas de inscripciones necesitan endpoints administrativos. Los valores visibles corresponden solo a la página cargada (máximo 100 registros)."
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <AdminList
          actionHref="/villages"
          emptyDescription="Todavía no hay pueblos disponibles en el catálogo."
          emptyTitle="No hay pueblos"
          icon={MapPinned}
          rows={villages.map((village) => ({
            id: village.id,
            main: village.name,
            meta: [
              village.province,
              village.population > 0
                ? `${new Intl.NumberFormat("es-ES").format(village.population)} hab.`
                : "Población no disponible",
            ].join(" · "),
          }))}
          title="Pueblos"
        />
        <AdminList
          actionHref="/activities"
          emptyDescription="Todavía no hay actividades disponibles en el catálogo."
          emptyTitle="No hay actividades"
          icon={CalendarDays}
          rows={activities.map((activity) => ({
            id: activity.id,
            main: activity.title,
            meta: [
              activity.category,
              activity.capacity > 0 ? `${activity.capacity} plazas` : "Aforo no indicado",
            ].join(" · "),
          }))}
          title="Actividades"
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

function PendingMetric({ label }: { label: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-bold text-[#687269]">{label}</p>
      <p className="mt-2 text-sm font-extrabold text-[#A95539]">Sin endpoint disponible</p>
    </Card>
  );
}

function AdminList({
  actionHref,
  emptyDescription,
  emptyTitle,
  icon,
  rows,
  title,
}: {
  actionHref: string;
  emptyDescription: string;
  emptyTitle: string;
  icon: typeof MapPinned;
  rows: Array<{ id: string; main: string; meta: string }>;
  title: string;
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        actionHref={actionHref}
        actionLabel="Abrir catálogo"
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
