"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarSearch,
  ChevronDown,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { EmptyState } from "@/components/social/empty-state";
import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { ActivityCard } from "@/features/activities/activity-card";
import {
  ActivityCategoryIcon,
  activityCategoryPill,
} from "@/features/activities/activity-category-icon";
import { cn } from "@/lib/utils";
import { getActivitiesStrict } from "@/lib/api/activities.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { logApiIssue } from "@/lib/api/error-message";
import { clearSession } from "@/lib/api/session";
import { getVillagesStrict } from "@/lib/api/villages.service";
import type { Activity, ActivityCategory, Village } from "@/lib/types";

type CategoryFilter = ActivityCategory | "Todas";

export function ActivityExplorer({
  activities: initialActivities,
  activitiesUnavailable: initialActivitiesUnavailable = false,
  categories,
  villages: initialVillages,
  villagesUnavailable: initialVillagesUnavailable = false,
}: {
  activities: Activity[];
  activitiesUnavailable?: boolean;
  categories: ActivityCategory[];
  villages: Village[];
  villagesUnavailable?: boolean;
}) {
  const { token } = useAuthSession();
  const [authenticatedResult, setAuthenticatedResult] = useState<{
    activities?: Activity[];
    activitiesUnavailable?: boolean;
    failed?: boolean;
    token: string;
    villages?: Village[];
    villagesUnavailable?: boolean;
  }>();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("Todas");
  const [villageId, setVillageId] = useState("");
  const currentResult =
    token && authenticatedResult?.token === token
      ? authenticatedResult
      : undefined;
  const activities = currentResult?.activities ?? initialActivities;
  const villages = currentResult?.villages ?? initialVillages;
  const activitiesUnavailable =
    currentResult?.activities === undefined && initialActivitiesUnavailable;
  const villagesUnavailable =
    currentResult?.villages === undefined && initialVillagesUnavailable;

  useEffect(() => {
    if (!token) return;

    let active = true;

    Promise.allSettled([getActivitiesStrict(token), getVillagesStrict(token)])
      .then(([activitiesResult, villagesResult]) => {
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
          activities: activitiesResult.status === "fulfilled"
            ? activitiesResult.value
            : undefined,
          activitiesUnavailable:
            activitiesResult.status === "rejected" && initialActivitiesUnavailable,
          failed: rejectedResults.length > 0,
          token,
          villages: villagesResult.status === "fulfilled"
            ? villagesResult.value
            : undefined,
          villagesUnavailable:
            villagesResult.status === "rejected" && initialVillagesUnavailable,
        });
      });

    return () => {
      active = false;
    };
  }, [initialActivitiesUnavailable, initialVillagesUnavailable, token]);

  const visibleCategories = useMemo(
    () => categories.filter((item) => activities.some((activity) => activity.category === item)),
    [activities, categories],
  );

  const visibleVillages = useMemo(() => {
    const activityVillageIds = new Set(activities.map((activity) => activity.villageId));
    return villages.filter((village) => activityVillageIds.has(village.id));
  }, [activities, villages]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return activities.filter((activity) => {
      const village = villages.find((item) => item.id === activity.villageId);
      const matchesCategory = category === "Todas" || activity.category === category;
      const matchesVillage = !villageId || activity.villageId === villageId;
      const searchable = [
        activity.title,
        activity.description,
        activity.organizer,
        activity.category,
        activity.location,
        activity.villageName,
        village?.name,
        village?.province,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        matchesVillage &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [activities, category, query, villageId, villages]);

  const hasFilters = Boolean(query.trim() || villageId || category !== "Todas");

  function clearFilters() {
    setQuery("");
    setCategory("Todas");
    setVillageId("");
  }

  return (
    <section aria-labelledby="activities-list-title" className="mt-7 min-w-0">
      {currentResult?.failed ? (
        <Card className="mb-5 border border-[#D7A63C45] bg-[#FFF8E8] p-4 text-sm font-bold leading-6 text-[#72551C]" role="status">
          No hemos podido actualizar tus inscripciones y guardados. Mostramos la agenda pública disponible.
        </Card>
      ) : null}
      {villagesUnavailable ? (
        <Card className="mb-5 border border-[#D7A63C45] bg-[#FFF8E8] p-4 text-sm font-bold leading-6 text-[#72551C]" role="status">
          No hemos podido cargar el catálogo de pueblos. La agenda sigue disponible, pero el filtro por pueblo está temporalmente incompleto.
        </Card>
      ) : null}
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <p className="eyebrow">Explorar la agenda</p>
          <h2
            className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] text-[#18231D] sm:text-3xl"
            id="activities-list-title"
          >
            Actividades para descubrir
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#687269]">
            Busca por plan, pueblo o interés y encuentra la información publicada por la comunidad.
          </p>
        </div>
        <p aria-live="polite" className="shrink-0 text-xs font-extrabold text-[#687269]">
          {filtered.length} {filtered.length === 1 ? "actividad" : "actividades"}
        </p>
      </div>

      <div className="min-w-0 rounded-[22px] border border-[#184B341a] bg-[#FFFCF7]/92 p-3 shadow-[0_12px_34px_rgba(43,55,38,0.06)] sm:p-4">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-[minmax(0,1fr)_240px]">
          <label className="relative block min-w-0">
            <span className="sr-only">Buscar actividades</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-[#60818A]"
            />
            <input
              className="min-h-12 min-w-0 w-full rounded-[15px] border border-[#184B3420] bg-white/84 py-3 pl-11 pr-11 text-sm font-semibold text-[#18231D] outline-none transition placeholder:font-normal placeholder:text-[#687269]/72 hover:bg-white focus:border-[#347A48] focus:ring-4 focus:ring-[#347A481f]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar actividad, pueblo o categoría..."
              type="search"
              value={query}
            />
            {query ? (
              <button
                aria-label="Borrar búsqueda"
                className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-[#687269] transition hover:bg-[#184B340d] hover:text-[#184B34]"
                onClick={() => setQuery("")}
                type="button"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            ) : null}
          </label>

          <label className="relative block min-w-0">
            <span className="sr-only">Filtrar por pueblo</span>
            <MapPin
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 z-10 size-4.5 -translate-y-1/2 text-[#60818A]"
            />
            <select
              className="min-h-12 min-w-0 w-full appearance-none rounded-[15px] border border-[#184B3420] bg-white/84 py-3 pl-11 pr-10 text-sm font-bold text-[#18231D] outline-none transition hover:bg-white focus:border-[#347A48] focus:ring-4 focus:ring-[#347A481f]"
              onChange={(event) => setVillageId(event.target.value)}
              value={villageId}
            >
              <option value="">Todos los pueblos</option>
              {visibleVillages.map((village) => (
                <option key={village.id} value={village.id}>
                  {village.name}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#687269]"
            />
          </label>
        </div>

        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="mr-1 hidden shrink-0 items-center gap-1.5 text-xs font-extrabold text-[#687269] sm:inline-flex">
            <SlidersHorizontal aria-hidden="true" className="size-3.5" />
            Filtros
          </span>
          <button
            aria-pressed={category === "Todas"}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-extrabold transition",
              category === "Todas"
                ? "border-[#184B34] bg-[#184B34] text-white shadow-[0_8px_20px_rgba(24,75,52,0.17)]"
                : "border-[#184B341a] bg-white/84 text-[#526158] hover:border-[#184B3430] hover:text-[#184B34]",
            )}
            onClick={() => setCategory("Todas")}
            type="button"
          >
            Todas
          </button>
          {visibleCategories.map((item) => (
            <button
              aria-pressed={category === item}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-extrabold transition",
                category === item
                  ? "border border-[#184B34] bg-[#184B34] text-white shadow-[0_8px_20px_rgba(24,75,52,0.17)]"
                  : activityCategoryPill(item),
              )}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              <ActivityCategoryIcon category={item} className="size-3.5" />
              {item}
            </button>
          ))}
          {hasFilters ? (
            <button
              className="ml-auto inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-extrabold text-[#A95539] transition hover:bg-[#C96D4A12]"
              onClick={clearFilters}
              type="button"
            >
              <X aria-hidden="true" className="size-3.5" />
              Limpiar
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        {activitiesUnavailable ? (
          <ErrorState
            actionHref="/activities"
            actionLabel="Reintentar"
            description="No hemos recibido la agenda del servidor. Los filtros y el catálogo de pueblos siguen disponibles."
            network
            title="No hemos podido cargar las actividades"
          />
        ) : filtered.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((activity) => {
              const village = villages.find((item) => item.id === activity.villageId);

              return (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  villageName={activity.villageName ?? village?.name}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            actionHref={activities.length ? undefined : "/activities/create"}
            actionLabel={activities.length ? "Limpiar filtros" : "Publicar actividad"}
            description={
              activities.length
                ? "Prueba con otro pueblo, categoría o palabra clave para ampliar la búsqueda."
                : "Cuando la comunidad publique un nuevo plan, aparecerá aquí con su información."
            }
            icon={CalendarSearch}
            onAction={activities.length ? clearFilters : undefined}
            title={
              activities.length
                ? "No hay actividades con estos filtros"
                : "Aún no hay actividades publicadas"
            }
          />
        )}
      </div>
    </section>
  );
}
