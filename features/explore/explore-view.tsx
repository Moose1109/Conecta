"use client";

import { useRouter } from "next/navigation";
import {
  type FormEvent,
  type ReactNode,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Compass,
  FileText,
  Info,
  MapPin,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { SocialPostCard } from "@/components/social/social-post-card";
import { ActivityCard } from "@/features/activities/activity-card";
import { VillageCard } from "@/features/villages/village-card";
import { cn } from "@/lib/utils";
import type { Activity, CommunityPost, Village } from "@/lib/types";

export type ExploreType = "all" | "villages" | "activities" | "posts";

type SourceFlags = {
  activities: boolean;
  posts: boolean;
  villages: boolean;
};

const typeFilters = [
  { id: "all", icon: Compass, label: "Todo" },
  { id: "villages", icon: MapPin, label: "Pueblos" },
  { id: "activities", icon: CalendarDays, label: "Actividades" },
  { id: "posts", icon: FileText, label: "Publicaciones" },
] satisfies Array<{ id: ExploreType; icon: LucideIcon; label: string }>;

const ALL_RESULT_LIMIT = 3;
const FOCUSED_VILLAGE_LIMIT = 9;
const FOCUSED_ACTIVITY_LIMIT = 6;
const FOCUSED_POST_LIMIT = 6;

export function ExploreView({
  activities,
  limitedSources,
  posts,
  query,
  type,
  unavailableSources,
  villages,
}: {
  activities: Activity[];
  limitedSources: SourceFlags;
  posts: CommunityPost[];
  query: string;
  type: ExploreType;
  unavailableSources: SourceFlags;
  villages: Village[];
}) {
  const router = useRouter();
  const [draftQuery, setDraftQuery] = useState(query);
  const [isNavigating, startNavigation] = useTransition();
  const villageById = useMemo(
    () => new Map(villages.map((village) => [village.id, village])),
    [villages],
  );
  const results = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query);

    if (!normalizedQuery) {
      return { activities, posts, villages };
    }

    return {
      villages: villages.filter((village) =>
        matchesQuery(normalizedQuery, [
          village.name,
          village.province,
          village.region,
          village.tagline,
          village.description,
        ])),
      activities: activities.filter((activity) =>
        matchesQuery(normalizedQuery, [
          activity.title,
          activity.description,
          activity.villageName ?? villageById.get(activity.villageId)?.name,
          activity.category,
        ])),
      posts: posts.filter((post) =>
        matchesQuery(normalizedQuery, [
          post.title,
          post.content,
          post.author,
          post.villageName,
        ])),
    };
  }, [activities, posts, query, villageById, villages]);
  const availableMatches =
    (unavailableSources.villages ? 0 : results.villages.length) +
    (unavailableSources.activities ? 0 : results.activities.length) +
    (unavailableSources.posts ? 0 : results.posts.length);
  const unavailableCount = Object.values(unavailableSources).filter(Boolean).length;
  const hasFilters = Boolean(query || type !== "all");
  const focused = type !== "all";

  function navigate(nextQuery: string, nextType: ExploreType) {
    startNavigation(() => {
      router.push(exploreHref(nextQuery, nextType), { scroll: false });
    });
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(draftQuery, type);
  }

  function clearSearch() {
    setDraftQuery("");
    navigate("", type);
  }

  return (
    <div className="min-w-0">
      <Card className="p-4 sm:p-5">
        <form action="/explore" onSubmit={submitSearch}>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <SearchInput
              label="Buscar en los resultados públicos cargados"
              name="q"
              onChange={setDraftQuery}
              onClear={clearSearch}
              placeholder="Buscar pueblos, actividades o publicaciones..."
              value={draftQuery}
            />
            {type !== "all" ? <input name="type" type="hidden" value={type} /> : null}
            <Button className="min-h-12 px-6" disabled={isNavigating} type="submit">
              <Search aria-hidden="true" className="size-4" />
              {isNavigating ? "Buscando…" : "Buscar"}
            </Button>
          </div>
        </form>

        <div
          aria-label="Filtrar resultados por tipo"
          className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="group"
        >
          {typeFilters.map((filter) => {
            const active = type === filter.id;
            const Icon = filter.icon;

            return (
              <button
                aria-pressed={active}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-extrabold transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(24,75,52,0.17)]"
                    : "border-[#184B341a] bg-white/84 text-text-muted hover:border-[#184B3430] hover:bg-white hover:text-primary",
                )}
                key={filter.id}
                type="button"
                onClick={() => {
                  if (!active) navigate(draftQuery, filter.id);
                }}
              >
                <Icon aria-hidden="true" className="size-4" />
                {filter.label}
              </button>
            );
          })}
          {hasFilters ? (
            <button
              className="ml-auto inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-xs font-extrabold text-primary hover:bg-[#184B340d]"
              type="button"
              onClick={() => {
                setDraftQuery("");
                navigate("", "all");
              }}
            >
              <X aria-hidden="true" className="size-4" />
              Limpiar
            </button>
          ) : null}
        </div>
      </Card>

      <div className="mt-4 flex items-start gap-3 rounded-[20px] border border-[#184B3417] bg-[#78947D12] p-4 text-sm leading-6 text-text-muted">
        <Info aria-hidden="true" className="mt-0.5 size-4.5 shrink-0 text-mineral" />
        <p>
          La búsqueda se aplica únicamente a los catálogos públicos cargados en esta
          pantalla. Los resultados pueden ser parciales y no sustituyen una búsqueda
          global con paginación y relevancia.
        </p>
      </div>

      <div className="mt-5 flex flex-col justify-between gap-2 px-1 text-xs font-semibold text-text-muted sm:flex-row sm:items-center">
        <p aria-live="polite">
          {isNavigating
            ? "Actualizando resultados…"
            : `${availableMatches} ${resultCountLabel(availableMatches, Boolean(query))}${query ? ` para “${query}”` : ""}`}
        </p>
        {unavailableCount ? (
          <p role="status">
            {unavailableCount} {unavailableCount === 1 ? "fuente no disponible" : "fuentes no disponibles"}
          </p>
        ) : null}
      </div>

      <div className="mt-7 grid gap-9 sm:gap-11">
        {type === "all" || type === "villages" ? (
          <ResultSection
            catalogHref="/villages"
            description="Coincidencias por nombre, provincia, región, lema o descripción."
            emptyDescription={emptyDescription("pueblos", query)}
            emptyIcon={MapPin}
            emptyTitle={emptyTitle("pueblos", query)}
            gridClassName="sm:grid-cols-2 xl:grid-cols-3"
            items={results.villages}
            limited={limitedSources.villages}
            moreHref={exploreHref(query, "villages")}
            moreLabel="Ver más pueblos"
            query={query}
            renderItem={(village) => (
              <VillageCard
                compact={!focused}
                key={village.id}
                showFollowAction={false}
                village={village}
              />
            )}
            renderLimit={focused ? FOCUSED_VILLAGE_LIMIT : ALL_RESULT_LIMIT}
            sourceLabel="pueblos"
            title="Pueblos"
            unavailable={unavailableSources.villages}
            onRetry={() => router.refresh()}
          />
        ) : null}

        {type === "all" || type === "activities" ? (
          <ResultSection
            catalogHref={activityCatalogHref(query)}
            description="Coincidencias por título, descripción, pueblo o categoría publicada."
            emptyDescription={emptyDescription("actividades", query)}
            emptyIcon={CalendarDays}
            emptyTitle={emptyTitle("actividades", query)}
            gridClassName="sm:grid-cols-2 xl:grid-cols-3"
            items={results.activities}
            limited={limitedSources.activities}
            moreHref={exploreHref(query, "activities")}
            moreLabel="Ver más actividades"
            query={query}
            renderItem={(activity) => (
              <ActivityCard
                activity={activity}
                hydrateFromApi
                key={activity.id}
                villageName={activity.villageName ?? villageById.get(activity.villageId)?.name}
              />
            )}
            renderLimit={focused ? FOCUSED_ACTIVITY_LIMIT : ALL_RESULT_LIMIT}
            sourceLabel="actividades"
            title="Actividades"
            unavailable={unavailableSources.activities}
            onRetry={() => router.refresh()}
          />
        ) : null}

        {type === "all" || type === "posts" ? (
          <ResultSection
            catalogHref={postCatalogHref(query)}
            description="Coincidencias por título, contenido, autor o pueblo asociado."
            emptyDescription={emptyDescription("publicaciones", query)}
            emptyIcon={FileText}
            emptyTitle={emptyTitle("publicaciones", query)}
            gridClassName="mx-auto max-w-3xl"
            items={results.posts}
            limited={limitedSources.posts}
            moreHref={exploreHref(query, "posts")}
            moreLabel="Ver más publicaciones"
            query={query}
            renderItem={(post) => (
              <SocialPostCard hydrateFromApi key={post.id} post={post} />
            )}
            renderLimit={focused ? FOCUSED_POST_LIMIT : ALL_RESULT_LIMIT}
            sourceLabel="publicaciones"
            title="Publicaciones"
            unavailable={unavailableSources.posts}
            onRetry={() => router.refresh()}
          />
        ) : null}
      </div>
    </div>
  );
}

function ResultSection<T extends { id: string }>({
  catalogHref,
  description,
  emptyDescription: emptyStateDescription,
  emptyIcon,
  emptyTitle: emptyStateTitle,
  gridClassName,
  items,
  limited,
  moreHref,
  moreLabel,
  onRetry,
  query,
  renderItem,
  renderLimit,
  sourceLabel,
  title,
  unavailable,
}: {
  catalogHref: string;
  description: string;
  emptyDescription: string;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  gridClassName: string;
  items: T[];
  limited: boolean;
  moreHref: string;
  moreLabel: string;
  onRetry: () => void;
  query: string;
  renderItem: (item: T) => ReactNode;
  renderLimit: number;
  sourceLabel: string;
  title: string;
  unavailable: boolean;
}) {
  const titleId = `explore-${sourceLabel}-title`;
  const visibleItems = items.slice(0, renderLimit);
  const hasMore = items.length > visibleItems.length;
  const focused = renderLimit > ALL_RESULT_LIMIT;

  return (
    <section aria-labelledby={titleId}>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Resultados cargados</p>
          <h2
            className="mt-1.5 text-2xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-3xl"
            id={titleId}
          >
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>
        </div>
        <span className="w-fit rounded-full bg-[#78947D17] px-3 py-1.5 text-xs font-extrabold text-primary">
          {unavailable
            ? "Fuente no disponible"
            : `${items.length} ${resultCountLabel(items.length, Boolean(query))}`}
        </span>
      </div>

      {limited ? (
        <p
          className="mt-4 rounded-2xl border border-[#D7A63C38] bg-[#FFF8E8] px-4 py-3 text-xs font-semibold leading-5 text-[#6C531B]"
          role="status"
        >
          Esta fuente alcanzó el límite de 100 resultados. La búsqueda y el recuento
          describen únicamente el conjunto cargado.
        </p>
      ) : null}

      {unavailable ? (
        <SourceState
          action={<Button onClick={onRetry}>Reintentar</Button>}
          description={`No hemos podido obtener ${sourceLabel} del servidor. Las demás fuentes siguen disponibles.`}
          icon={AlertTriangle}
          title={`No hemos podido cargar ${sourceLabel}`}
          tone="error"
        />
      ) : visibleItems.length ? (
        <>
          <div className={cn("mt-5 grid gap-4", gridClassName)}>
            {visibleItems.map(renderItem)}
          </div>
          {hasMore || focused ? (
            <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-[20px] border border-border bg-surface-muted p-4 sm:flex-row sm:items-center">
              <p className="text-xs font-semibold leading-5 text-text-muted">
                {hasMore
                  ? `Mostramos ${visibleItems.length} de ${items.length} ${query ? "coincidencias" : "elementos"} dentro del conjunto cargado.`
                  : "Esta vista no representa un catálogo completo ni añade paginación simulada."}
              </p>
              <LinkButton
                className="shrink-0"
                href={focused ? catalogHref : moreHref}
                variant="secondary"
              >
                {focused ? `Continuar en ${title}` : moreLabel}
                <ArrowRight aria-hidden="true" className="size-4" />
              </LinkButton>
            </div>
          ) : null}
        </>
      ) : (
        <SourceState
          description={emptyStateDescription}
          icon={emptyIcon}
          title={emptyStateTitle}
        />
      )}
    </section>
  );
}

function SourceState({
  action,
  description,
  icon: Icon,
  title,
  tone = "neutral",
}: {
  action?: ReactNode;
  description: string;
  icon: LucideIcon;
  title: string;
  tone?: "error" | "neutral";
}) {
  return (
    <Card className="mt-5 p-6 text-center sm:p-8" role={tone === "error" ? "alert" : "status"}>
      <span
        className={cn(
          "mx-auto grid size-13 place-items-center rounded-2xl",
          tone === "error"
            ? "bg-[#C96D4A1f] text-[#A95539]"
            : "bg-[#78947D1f] text-primary",
        )}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <h3 className="mt-4 text-lg font-extrabold text-text-primary">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-text-muted">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}

function matchesQuery(query: string, fields: Array<string | undefined>) {
  return normalizeSearchText(fields.filter(Boolean).join(" ")).includes(query);
}

function exploreHref(query: string, type: ExploreType) {
  const params = new URLSearchParams();
  const normalizedQuery = query.trim().slice(0, 160);

  if (normalizedQuery) params.set("q", normalizedQuery);
  if (type !== "all") params.set("type", type);

  const search = params.toString();
  return `/explore${search ? `?${search}` : ""}`;
}

function activityCatalogHref(query: string) {
  const params = new URLSearchParams();
  if (query) params.set("search", query);
  const search = params.toString();
  return `/activities${search ? `?${search}` : ""}#agenda`;
}

function postCatalogHref(query: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  const search = params.toString();
  return `/community${search ? `?${search}` : ""}#community-search`;
}

function emptyTitle(label: string, query: string) {
  return query
    ? `No hay coincidencias de ${label}`
    : `No hay ${label} disponibles`;
}

function emptyDescription(label: string, query: string) {
  return query
    ? `No hay coincidencias de ${label} para “${query}” entre los resultados públicos cargados.`
    : `La fuente está disponible, pero no contiene ${label} persistentes en el conjunto cargado.`;
}

function resultCountLabel(count: number, hasQuery: boolean) {
  if (hasQuery) return count === 1 ? "coincidencia cargada" : "coincidencias cargadas";
  return count === 1 ? "elemento cargado" : "elementos cargados";
}
