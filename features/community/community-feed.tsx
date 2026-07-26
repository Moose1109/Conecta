"use client";

import {
  CalendarDays,
  ChevronDown,
  MapPin,
  Megaphone,
  Search,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import { EmptyState } from "@/components/social/empty-state";
import { PostComposer } from "@/components/social/post-composer";
import { SocialPostCard } from "@/components/social/social-post-card";
import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { SearchInput } from "@/components/ui/search-input";
import { useCommunityData } from "@/features/community/community-data-provider";
import { cn } from "@/lib/utils";
import type { AuthUser, CommunityPost } from "@/lib/types";

type ComposerUser = {
  name: string;
  avatar?: string;
  avatarUrl?: AuthUser["avatarUrl"];
};

type FeedFilter = "for-you" | "following" | "notices" | "activities" | "villages";
type SortMode = "recent" | "popular";

const filters = [
  { id: "for-you", label: "Para ti", icon: Sparkles },
  { id: "following", label: "Siguiendo", icon: UsersRound },
  { id: "notices", label: "Avisos", icon: Megaphone },
  { id: "activities", label: "Actividades", icon: CalendarDays },
  { id: "villages", label: "Pueblos", icon: MapPin },
] satisfies Array<{ id: FeedFilter; label: string; icon: LucideIcon }>;

const noticePattern = /\b(aviso|comunicado|importante|incidencia|corte|alerta|informaci[oó]n)\b/i;
const activityPattern =
  /\b(actividad|taller|ruta|mercado|fiesta|evento|encuentro|concierto|visita|jornada)\b/i;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function postTimestamp(post: CommunityPost) {
  const value = Date.parse(post.date);
  return Number.isFinite(value) ? value : 0;
}

export function CommunityFeed({
  initialQuery = "",
  user,
}: {
  initialQuery?: string;
  user: ComposerUser;
}) {
  const router = useRouter();
  const {
    personalizationUnavailable,
    posts,
    unavailableSources,
    villages,
  } = useCommunityData();
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("for-you");
  const [sortMode, setSortMode] = useState<SortMode>("recent");

  const visiblePosts = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    const villageById = new Map(villages.map((village) => [village.id, village]));

    const matchingPosts = posts.filter((post) => {
      const village = post.villageId ? villageById.get(post.villageId) : undefined;
      const searchable = normalize(
        [
          post.title,
          post.content,
          post.author,
          post.authorHandle,
          post.villageName,
          village?.name,
          village?.province,
        ]
          .filter(Boolean)
          .join(" "),
      );

      if (normalizedQuery && !searchable.includes(normalizedQuery)) {
        return false;
      }

      const sourceText = `${post.title} ${post.content}`;

      switch (activeFilter) {
        case "following":
          return village?.isFollowing === true;
        case "notices":
          return noticePattern.test(sourceText);
        case "activities":
          return activityPattern.test(sourceText);
        case "villages":
          return Boolean(post.villageId || post.villageName);
        default:
          return true;
      }
    });

    return matchingPosts.toSorted((left, right) => {
      if (sortMode === "popular") {
        const leftScore = (left.likes ?? 0) + (left.commentsCount ?? left.comments ?? 0);
        const rightScore = (right.likes ?? 0) + (right.commentsCount ?? right.comments ?? 0);
        return rightScore - leftScore;
      }

      return postTimestamp(right) - postTimestamp(left);
    });
  }, [activeFilter, posts, query, sortMode, villages]);

  const activeFilterLabel = filters.find((filter) => filter.id === activeFilter)?.label ?? "Para ti";

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuery = query.trim();
    const params = new URLSearchParams();
    if (normalizedQuery) params.set("q", normalizedQuery);
    router.replace(`/community${params.size ? `?${params.toString()}` : ""}#community-search`, {
      scroll: false,
    });
  }

  function clearSearch() {
    setQuery("");
    if (initialQuery) router.replace("/community#community-search", { scroll: false });
  }

  return (
    <div className="grid gap-4 sm:gap-5">
      {personalizationUnavailable ? (
        <Card className="border border-[#D7A63C45] bg-[#FFF8E8] p-4 text-sm font-bold leading-6 text-[#72551C]" role="status">
          No hemos podido actualizar ahora tus seguimientos y guardados. Mostramos el contenido público disponible.
        </Card>
      ) : null}
      <Card className="p-2">
        <form action="/community" onSubmit={submitSearch}>
          <SearchInput
            appearance="embedded"
            id="community-search"
            label="Buscar publicaciones"
            name="q"
            onChange={setQuery}
            onClear={clearSearch}
            placeholder="Buscar publicaciones..."
            showFilterHint
            value={query}
          />
        </form>
      </Card>

      <PostComposer
        demoFeed={posts.some((post) => post.dataSource === "demo")}
        user={user}
        villages={villages}
      />

      <Card className="overflow-hidden">
        <div
          aria-label="Filtros de publicaciones"
          className="flex gap-1 overflow-x-auto border-b border-[#184B3412] px-2 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="group"
        >
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;

            return (
              <button
                key={filter.id}
                aria-pressed={isActive}
                className={cn(
                  "relative inline-flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-t-xl px-3.5 text-xs font-extrabold text-[#687269] transition-colors hover:bg-[#184B3408] hover:text-[#184B34] sm:text-sm",
                  isActive && "text-[#184B34]",
                )}
                onClick={() => setActiveFilter(filter.id)}
                type="button"
              >
                <Icon aria-hidden="true" className="size-4" strokeWidth={1.9} />
                {filter.label}
                {isActive ? (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#347A48]" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="flex min-h-12 items-center justify-between gap-3 px-4 py-2">
          <p aria-live="polite" className="text-xs font-semibold text-[#687269]">
            {visiblePosts.length === 1
              ? "1 publicación"
              : `${visiblePosts.length} publicaciones`}
            {query ? ` para “${query.trim()}”` : ""}
          </p>
          <label className="relative shrink-0">
            <span className="sr-only">Ordenar publicaciones</span>
            <select
              aria-label="Ordenar publicaciones"
              className="min-h-11 appearance-none rounded-full border-0 bg-transparent py-2 pl-3 pr-8 text-xs font-extrabold text-[#435048] outline-none transition-colors hover:bg-[#184B3408] focus:ring-4 focus:ring-[#347A4818]"
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              value={sortMode}
            >
              <option value="recent">Más recientes</option>
              <option value="popular">Más populares</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#687269]"
            />
          </label>
        </div>
      </Card>

      {posts.length >= 100 ? (
        <p className="px-1 text-xs font-semibold leading-5 text-text-muted" role="status">
          Se muestran hasta 100 publicaciones disponibles; la búsqueda se aplica sobre ese conjunto.
        </p>
      ) : null}

      <div className="grid gap-4 sm:gap-5">
        {unavailableSources.posts ? (
          <ErrorState
            actionHref="/community"
            actionLabel="Reintentar"
            description="La plaza digital sigue disponible, pero no hemos podido obtener sus publicaciones del servidor."
            network
            title="No hemos podido cargar las publicaciones"
          />
        ) : visiblePosts.length ? (
          visiblePosts.map((post) => <SocialPostCard key={post.id} post={post} />)
        ) : (
          <EmptyState
            actionHref={posts.length ? undefined : "/community#publicar"}
            actionLabel={posts.length ? "Limpiar filtros" : "Crear publicación"}
            icon={Search}
            onAction={posts.length ? () => {
              setActiveFilter("for-you");
              setQuery("");
            } : undefined}
            title={`No hay publicaciones en “${activeFilterLabel}”`}
            description={
              query
                ? "Prueba con otro pueblo, autor o tema comunitario, o limpia la búsqueda."
                : "Todavía no hay contenido real que coincida con este filtro. Explora otra sección del feed."
            }
          />
        )}
      </div>
    </div>
  );
}
