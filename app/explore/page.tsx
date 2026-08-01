import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { PageHeader } from "@/components/ui/page-header";
import { AuthGate } from "@/features/auth/auth-gate";
import { ExploreLoading } from "@/features/explore/explore-loading";
import {
  ExploreView,
  type ExploreType,
} from "@/features/explore/explore-view";
import { getActivitiesStrict } from "@/lib/api/activities.service";
import { getCommunityPostsStrict } from "@/lib/api/community.service";
import { getVillagesStrict } from "@/lib/api/villages.service";

export const metadata: Metadata = { title: "Explorar" };

type ExploreSearchParams = Promise<Record<string, string | string[] | undefined>>;

const allowedTypes = new Set<ExploreType>([
  "all",
  "villages",
  "activities",
  "posts",
]);

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: ExploreSearchParams;
}) {
  await connection();

  const rawParams = await searchParams;
  const filters = exploreFilters(rawParams);
  const canonicalHref = exploreHref(filters.query, filters.type);

  if (receivedSearch(rawParams) !== exploreSearch(filters.query, filters.type)) {
    redirect(canonicalHref);
  }

  return (
    <AuthenticatedShell>
      <AuthGate message="Para explorar el catálogo completo y las publicaciones de la comunidad necesitas iniciar sesión.">
        <PageHeader
          description="Explora pueblos, actividades y publicaciones disponibles en los catálogos públicos cargados."
          eyebrow="Descubrimiento"
          title="Explora la vida de los pueblos"
        />
        <Suspense fallback={<ExploreLoading />}>
          <ExploreData key={`${filters.query}:${filters.type}`} filters={filters} />
        </Suspense>
      </AuthGate>
    </AuthenticatedShell>
  );
}

async function ExploreData({
  filters,
}: {
  filters: { query: string; type: ExploreType };
}) {
  const [villagesResult, activitiesResult, postsResult] = await Promise.allSettled([
    getVillagesStrict(),
    getActivitiesStrict(),
    getCommunityPostsStrict(),
  ]);
  const loadedVillages = villagesResult.status === "fulfilled" ? villagesResult.value : [];
  const loadedActivities = activitiesResult.status === "fulfilled" ? activitiesResult.value : [];
  const loadedPosts = postsResult.status === "fulfilled" ? postsResult.value : [];

  if (process.env.NODE_ENV === "development") {
    if (villagesResult.status === "rejected") {
      console.warn("Unable to load villages for explore:", villagesResult.reason);
    }
    if (activitiesResult.status === "rejected") {
      console.warn("Unable to load activities for explore:", activitiesResult.reason);
    }
    if (postsResult.status === "rejected") {
      console.warn("Unable to load posts for explore:", postsResult.reason);
    }
  }

  return (
    <ExploreView
      activities={loadedActivities.filter((activity) => activity.dataSource === "persistent")}
      key={JSON.stringify([filters.query, filters.type])}
      limitedSources={{
        activities: loadedActivities.length >= 100,
        posts: loadedPosts.length >= 100,
        villages: loadedVillages.length >= 100,
      }}
      posts={loadedPosts.filter((post) => post.dataSource === "persistent")}
      query={filters.query}
      type={filters.type}
      unavailableSources={{
        activities: activitiesResult.status === "rejected",
        posts: postsResult.status === "rejected",
        villages: villagesResult.status === "rejected",
      }}
      villages={loadedVillages.filter((village) => village.dataSource === "persistent")}
    />
  );
}

function exploreFilters(params: Record<string, string | string[] | undefined>) {
  const query = firstValue(params.q).trim().slice(0, 160);
  const typeValue = firstValue(params.type);
  const type = allowedTypes.has(typeValue as ExploreType)
    ? typeValue as ExploreType
    : "all";

  return { query, type };
}

function exploreHref(query: string, type: ExploreType) {
  const search = exploreSearch(query, type);
  return `/explore${search ? `?${search}` : ""}`;
}

function exploreSearch(query: string, type: ExploreType) {
  const params = new URLSearchParams();

  if (query) params.set("q", query);
  if (type !== "all") params.set("type", type);

  return params.toString();
}

function receivedSearch(params: Record<string, string | string[] | undefined>) {
  const received = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((item) => received.append(key, item));
    } else if (value !== undefined) {
      received.set(key, value);
    }
  }

  return received.toString();
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}
