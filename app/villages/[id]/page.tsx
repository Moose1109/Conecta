import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Landmark,
  MapPin,
} from "lucide-react";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { FollowButton } from "@/components/social/follow-button";
import { Badge } from "@/components/ui/card";
import {
  VillageDetailSections,
  VillageDetailSectionsLoading,
} from "@/features/villages/village-detail-sections";
import { getActivitiesByVillageIdStrict } from "@/lib/api/activities.service";
import { isNotFoundError } from "@/lib/api/client";
import { getPostsByVillageIdStrict } from "@/lib/api/community.service";
import { canFollowVillage } from "@/lib/api/entity-capabilities";
import { getVillageByIdStrict, getVillagesStrict } from "@/lib/api/villages.service";
import type { Village } from "@/lib/types";

export const metadata: Metadata = { title: "Detalle de pueblo" };

export default async function VillageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;
  const village = await getVillageByIdStrict(id).catch((error: unknown) => {
    if (isNotFoundError(error)) notFound();
    throw error;
  });

  if (!village) {
    notFound();
  }

  const heroImage = village.bannerImage ?? village.image;

  return (
    <AuthenticatedShell>
      <div className="grid gap-6 sm:gap-8">
        <section className="relative isolate min-h-[430px] overflow-hidden rounded-[28px] border border-white/30 bg-[#0E3325] shadow-[0_24px_72px_rgba(14,51,37,0.18)] sm:min-h-[500px]">
          {heroImage ? (
            <Image
              alt={village.name}
              className="object-cover"
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 1160px"
              src={heroImage}
            />
          ) : (
            <div className="topographic-pattern absolute inset-0 bg-[linear-gradient(145deg,#0E3325_0%,#347A48_55%,#78947D_100%)]">
              <Landmark
                aria-hidden="true"
                className="absolute right-[10%] top-1/2 size-32 -translate-y-1/2 text-white/12 sm:size-44"
                strokeWidth={1.1}
              />
            </div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,36,26,0.36)_0%,rgba(10,36,26,0.10)_34%,rgba(10,36,26,0.90)_100%)]" />
          <div className="topographic-pattern absolute inset-0 opacity-35" />

          <div className="relative z-10 flex min-h-[430px] flex-col justify-between p-5 text-white sm:min-h-[500px] sm:p-8">
            <Link
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-white/22 bg-[#0E3325]/42 px-4 py-2 text-sm font-extrabold text-white backdrop-blur-md transition hover:bg-[#0E3325]/66"
              href="/villages"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Volver a pueblos
            </Link>

            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-2">
                <Badge className="border border-white/24 bg-white/14 text-white backdrop-blur">
                  <MapPin aria-hidden="true" className="mr-1.5 size-3.5" />
                  {village.province}
                </Badge>
                <Badge className="border border-white/24 bg-white/14 text-white backdrop-blur">
                  {village.region}
                </Badge>
              </div>
              <h1 className="mt-4 text-5xl font-extrabold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                {village.name}
              </h1>
              {village.tagline ? (
                <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/78 sm:text-lg sm:leading-8">
                  {village.tagline}
                </p>
              ) : null}
              <div className="mt-6">
                <FollowButton
                  className="min-h-11 border border-white/28 px-5 shadow-[0_10px_28px_rgba(0,0,0,0.14)]"
                  demo={village.dataSource === "demo"}
                  hydrateFromApi
                  initialFollowing={village.isFollowing}
                  interactionSupported={canFollowVillage(village)}
                  storageKey={village.id}
                />
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={<VillageDetailSectionsLoading />}>
          <VillageDetailData village={village} />
        </Suspense>
      </div>
    </AuthenticatedShell>
  );
}

async function VillageDetailData({ village }: { village: Village }) {
  const [activitiesResult, postsResult, villagesResult] = await Promise.allSettled([
    getActivitiesByVillageIdStrict(village.id),
    getPostsByVillageIdStrict(village.id),
    getVillagesStrict(),
  ]);
  const activitiesUnavailable = activitiesResult.status === "rejected";
  const postsUnavailable = postsResult.status === "rejected";
  const relatedCatalogUnavailable = villagesResult.status === "rejected";
  const relatedActivities = activitiesResult.status === "fulfilled"
    ? activitiesResult.value
    : [];
  const villagePosts = postsResult.status === "fulfilled" ? postsResult.value : [];
  const relatedCatalog = villagesResult.status === "fulfilled" ? villagesResult.value : [];

  if (process.env.NODE_ENV === "development") {
    if (activitiesResult.status === "rejected") {
      console.warn("Unable to load village activities:", activitiesResult.reason);
    }
    if (postsResult.status === "rejected") {
      console.warn("Unable to load village posts:", postsResult.reason);
    }
    if (villagesResult.status === "rejected") {
      console.warn("Unable to load villages for related locations:", villagesResult.reason);
    }
  }

  return (
    <VillageDetailSections
      activities={relatedActivities}
      activitiesUnavailable={activitiesUnavailable}
      posts={villagePosts}
      postsUnavailable={postsUnavailable}
      relatedCatalog={relatedCatalog}
      relatedCatalogUnavailable={relatedCatalogUnavailable}
      village={village}
    />
  );
}
