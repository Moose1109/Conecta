import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Landmark,
  MapPin,
  MessageSquareText,
  Mountain,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { FollowButton } from "@/components/social/follow-button";
import { SocialPostCard } from "@/components/social/social-post-card";
import { EmptyState } from "@/components/social/empty-state";
import { Badge, Card, SectionHeader } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { ActivityCard } from "@/features/activities/activity-card";
import { getActivitiesByVillageIdStrict } from "@/lib/api/activities.service";
import { isNotFoundError } from "@/lib/api/client";
import { getPostsByVillageIdStrict } from "@/lib/api/community.service";
import { canFollowVillage } from "@/lib/api/entity-capabilities";
import { getVillageByIdStrict } from "@/lib/api/villages.service";
import { formatPopulation } from "@/lib/utils";

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

  const [activitiesResult, postsResult] = await Promise.allSettled([
    getActivitiesByVillageIdStrict(village.id),
    getPostsByVillageIdStrict(village.id),
  ]);
  const activitiesUnavailable = activitiesResult.status === "rejected";
  const postsUnavailable = postsResult.status === "rejected";
  const relatedActivities = activitiesResult.status === "fulfilled"
    ? activitiesResult.value
    : [];
  const villagePosts = postsResult.status === "fulfilled" ? postsResult.value : [];

  if (process.env.NODE_ENV === "development") {
    if (activitiesResult.status === "rejected") {
      console.warn("Unable to load village activities:", activitiesResult.reason);
    }
    if (postsResult.status === "rejected") {
      console.warn("Unable to load village posts:", postsResult.reason);
    }
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

        <section aria-label="Datos del pueblo" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {village.population > 0 ? (
            <VillageFact
              icon={UsersRound}
              label="Habitantes"
              value={formatPopulation(village.population)}
            />
          ) : null}
          <VillageFact icon={CalendarDays} label="Actividades publicadas" value={activitiesUnavailable ? "—" : relatedActivities.length} />
          <VillageFact icon={FileText} label="Publicaciones" value={postsUnavailable ? "—" : villagePosts.length} />
          <VillageFact icon={MapPin} label="Provincia" value={village.province} />
        </section>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-8">
            <Card className="p-6 sm:p-8">
              <p className="eyebrow">Conoce el lugar</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#18231D]">
                Sobre {village.name}
              </h2>
              {village.description ? (
                <p className="mt-4 max-w-3xl text-base leading-8 text-[#687269]">
                  {village.description}
                </p>
              ) : (
                <p className="mt-4 text-sm leading-6 text-[#687269]">
                  Este pueblo todavía no tiene una descripción publicada.
                </p>
              )}
            </Card>

            <section aria-label={`Muro de ${village.name}`}>
              <SectionHeader
                eyebrow="Comunidad"
                title="Muro del pueblo"
                description="Publicaciones vinculadas a este pueblo por la comunidad."
              />
              {postsUnavailable ? (
                <ErrorState
                  actionHref="/community"
                  actionLabel="Ir a comunidad"
                  description="La ficha del pueblo sigue disponible, pero no hemos podido conectar con su muro."
                  network
                  title="No hemos podido cargar las publicaciones"
                />
              ) : villagePosts.length ? (
                <div className="grid gap-5">
                  {villagePosts.map((post) => (
                    <SocialPostCard hydrateFromApi key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  actionHref="/community"
                  actionLabel="Ir a comunidad"
                  description="Cuando haya publicaciones asociadas a este pueblo aparecerán aquí."
                  icon={MessageSquareText}
                  title="El muro todavía está por estrenar"
                />
              )}
            </section>
          </div>

          <aside className="grid gap-5 xl:sticky xl:top-24">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-[#78947D1f] text-[#184B34]">
                  <Mountain aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <p className="eyebrow">Ficha local</p>
                  <h2 className="mt-1 text-xl font-extrabold tracking-[-0.025em] text-[#18231D]">
                    El territorio
                  </h2>
                </div>
              </div>
              <dl className="mt-5 divide-y divide-[#184B3412]">
                <VillageDetail label="Pueblo" value={village.name} />
                <VillageDetail label="Provincia" value={village.province} />
                <VillageDetail label="Región" value={village.region} />
                {village.population > 0 ? (
                  <VillageDetail
                    label="Población"
                    value={`${formatPopulation(village.population)} habitantes`}
                  />
                ) : null}
              </dl>
            </Card>

            {village.highlights.length ? (
              <Card className="p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-[#D7A63C24] text-[#8A6418]">
                    <Landmark aria-hidden="true" className="size-5" />
                  </span>
                  <h2 className="text-xl font-extrabold tracking-[-0.025em] text-[#18231D]">
                    Señas del pueblo
                  </h2>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {village.highlights.map((highlight) => (
                    <Badge key={highlight}>{highlight}</Badge>
                  ))}
                </div>
              </Card>
            ) : null}
          </aside>
        </div>

        <section aria-label={`Actividades publicadas en ${village.name}`}>
          <SectionHeader
            eyebrow="Planes locales"
            title={`Actividades en ${village.name}`}
            description="Solo mostramos actividades que el backend vincula con este pueblo."
          />
          {activitiesUnavailable ? (
            <ErrorState
              actionHref="/activities"
              actionLabel="Explorar agenda"
              description="La ficha del pueblo sigue disponible, pero su agenda local no ha podido cargarse."
              network
              title="No hemos podido cargar las actividades"
            />
          ) : relatedActivities.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedActivities.map((activity) => (
                <ActivityCard hydrateFromApi key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <EmptyState
              actionHref="/activities"
              actionLabel="Explorar actividades"
              description="No hay actividades vinculadas a este pueblo en este momento."
              icon={CalendarDays}
              title="Aún no hay actividades publicadas aquí"
            />
          )}
        </section>
      </div>
    </AuthenticatedShell>
  );
}

function VillageFact({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="flex min-h-24 items-center gap-3 p-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#78947D1a] text-[#184B34]">
        <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold text-[#687269]">{label}</p>
        <p className="mt-1 truncate text-xl font-extrabold tracking-[-0.025em] text-[#18231D]">
          {value}
        </p>
      </div>
    </Card>
  );
}

function VillageDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 text-sm first:pt-0 last:pb-0">
      <dt className="font-semibold text-[#687269]">{label}</dt>
      <dd className="text-right font-extrabold text-[#18231D]">{value}</dd>
    </div>
  );
}
