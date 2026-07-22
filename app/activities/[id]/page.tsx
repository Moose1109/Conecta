import Link from "next/link";
import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  ShieldCheck,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { JoinActivityButton } from "@/components/social/join-activity-button";
import { SaveButton } from "@/components/social/save-button";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Card } from "@/components/ui/card";
import {
  ActivityCategoryIcon,
  activityCategoryPill,
} from "@/features/activities/activity-category-icon";
import { ActivityImage } from "@/features/activities/activity-image";
import { getActivityByIdStrict } from "@/lib/api/activities.service";
import { isNotFoundError } from "@/lib/api/client";
import { canJoinActivity } from "@/lib/api/entity-capabilities";
import { getVillageByIdStrict } from "@/lib/api/villages.service";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Detalle de actividad" };

function dateParts(date: string) {
  const value = new Date(`${date}T12:00:00`);

  return {
    day: new Intl.DateTimeFormat("es-ES", { day: "2-digit" }).format(value),
    month: new Intl.DateTimeFormat("es-ES", { month: "long" }).format(value),
    weekday: new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(value),
  };
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;
  const activity = await getActivityByIdStrict(id).catch((error: unknown) => {
    if (isNotFoundError(error)) notFound();
    throw error;
  });

  if (!activity) {
    notFound();
  }

  const village = await getVillageByIdStrict(activity.villageId).catch(
    (error: unknown) => {
      if (process.env.NODE_ENV === "development" && !isNotFoundError(error)) {
        console.warn("Unable to load the activity village:", error);
      }
      return undefined;
    },
  );
  const villageName = village?.name ?? activity.villageName;
  const date = dateParts(activity.date);

  return (
    <AuthenticatedShell>
      <article className="mx-auto max-w-6xl">
        <Link
          className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-extrabold text-[#526158] transition hover:bg-[#184B340d] hover:text-[#184B34]"
          href="/activities"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Volver a actividades
        </Link>

        <Card className="relative overflow-hidden rounded-[26px] border-white/20 bg-[#0E3325]">
          <div className="relative min-h-[360px] sm:min-h-[420px] lg:min-h-[460px]">
            <ActivityImage
              activity={activity}
              preferBanner
              preload
              sizes="(max-width: 1280px) 100vw, 1100px"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,51,37,0.10)_12%,rgba(14,51,37,0.22)_43%,rgba(7,28,20,0.93)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white sm:p-8 lg:p-10">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold shadow-sm backdrop-blur-md ${activityCategoryPill(activity.category)}`}
              >
                <ActivityCategoryIcon category={activity.category} className="size-3.5" />
                {activity.category}
              </span>
              <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-[1.04] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                {activity.title}
              </h1>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-white/80">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays aria-hidden="true" className="size-4 text-[#F1CA70]" />
                  {formatDate(activity.date)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 aria-hidden="true" className="size-4 text-[#F1CA70]" />
                  {activity.time}
                </span>
                {villageName ? (
                  <span className="inline-flex items-center gap-2">
                    <MapPin aria-hidden="true" className="size-4 text-[#F1CA70]" />
                    {villageName}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid min-w-0 content-start gap-6">
            <Card className="p-6 sm:p-8">
              <p className="eyebrow">Sobre la actividad</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#18231D]">
                Información para participar
              </h2>
              {activity.description ? (
                <p className="mt-4 whitespace-pre-line text-base leading-8 text-[#526158]">
                  {activity.description}
                </p>
              ) : (
                <p className="mt-4 text-sm leading-6 text-[#687269]">
                  La organización todavía no ha añadido una descripción.
                </p>
              )}
            </Card>

            <Card className="p-6 sm:p-8">
              <p className="eyebrow">Datos publicados</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#18231D]">
                Detalles de la convocatoria
              </h2>
              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                <DetailItem
                  icon={CalendarDays}
                  label="Fecha"
                  value={formatDate(activity.date)}
                />
                <DetailItem icon={Clock3} label="Hora" value={activity.time} />
                {activity.location ? (
                  <DetailItem icon={MapPin} label="Lugar" value={activity.location} />
                ) : null}
                {villageName ? (
                  <DetailItem
                    href={village ? `/villages/${village.id}` : undefined}
                    icon={MapPin}
                    label="Pueblo"
                    value={villageName}
                  />
                ) : null}
                <DetailItem
                  icon={UserRound}
                  label="Organiza"
                  value={activity.organizer}
                />
                {typeof activity.spotsLeft === "number" ? (
                  <DetailItem
                    icon={UsersRound}
                    label="Disponibles"
                    value={`${activity.spotsLeft}`}
                  />
                ) : activity.capacity > 0 ? (
                  <DetailItem
                    icon={UsersRound}
                    label="Aforo"
                    value={`${activity.capacity}`}
                  />
                ) : null}
                {typeof activity.participantsCount === "number" &&
                activity.participantsCount > 0 ? (
                  <DetailItem
                    icon={UsersRound}
                    label="Personas inscritas"
                    value={`${activity.participantsCount}`}
                  />
                ) : null}
              </dl>
            </Card>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden rounded-[22px]">
              <div className="flex items-stretch border-b border-[#184B3414] bg-[#F4EEE3]">
                <div className="grid w-24 shrink-0 place-items-center bg-[#D7A63C] px-3 py-5 text-center text-[#18231D]">
                  <span className="text-3xl font-extrabold leading-none">{date.day}</span>
                  <span className="mt-1 text-[0.65rem] font-extrabold uppercase tracking-[0.12em]">
                    {date.month}
                  </span>
                </div>
                <div className="min-w-0 p-5">
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#347A48]">
                    {date.weekday}
                  </p>
                  <p className="mt-1.5 flex items-center gap-2 text-lg font-extrabold text-[#18231D]">
                    <Clock3 aria-hidden="true" className="size-4 text-[#C96D4A]" />
                    {activity.time}
                  </p>
                  {activity.location ? (
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#687269]">
                      {activity.location}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <h2 className="text-xl font-extrabold tracking-[-0.025em] text-[#18231D]">
                  Participa en la actividad
                </h2>
                {typeof activity.spotsLeft === "number" ? (
                  <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#347A48]">
                    <UsersRound aria-hidden="true" className="size-4" />
                    {activity.spotsLeft} plazas disponibles
                  </p>
                ) : activity.capacity > 0 ? (
                  <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#347A48]">
                    <UsersRound aria-hidden="true" className="size-4" />
                    Aforo: {activity.capacity} plazas
                  </p>
                ) : null}

                <div className="mt-5 grid gap-2.5">
                  <div className="[&>span]:w-full [&>span>button]:w-full">
                    <JoinActivityButton
                      demo={activity.dataSource === "demo"}
                      hydrateFromApi
                      initialJoined={activity.isJoined}
                      interactionSupported={canJoinActivity(activity)}
                      storageKey={activity.id}
                    />
                  </div>
                  <div className="[&>span]:w-full [&>span>button]:w-full">
                    <SaveButton
                      demo={activity.dataSource === "demo"}
                      hydrateFromApi
                      initialSaved={activity.isSaved}
                      interactionSupported={canJoinActivity(activity)}
                      storageKey={`activity:${activity.id}`}
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-[#78947D17] p-3.5 text-xs leading-5 text-[#526158]">
                  <ShieldCheck
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-[#184B34]"
                  />
                  El guardado y la inscripción se vinculan a tu cuenta cuando has iniciado sesión.
                </div>
              </div>
            </Card>
          </aside>
        </div>

        <BackendPendingAlert
          actionHref="/activities"
          actionLabel="Explorar actividades"
          className="mt-6"
          description="Esta sección está preparada, pero necesita que el backend exponga recomendaciones relacionadas con esta actividad."
          title="Recomendaciones pendientes de backend"
        />
      </article>
    </AuthenticatedShell>
  );
}

function DetailItem({
  href,
  icon: Icon,
  label,
  value,
}: {
  href?: string;
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#184B3414] bg-white/70 p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#78947D1b] text-[#184B34]">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <span className="min-w-0">
        <dt className="text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-[#78947D]">
          {label}
        </dt>
        <dd className="mt-1 break-words text-sm font-extrabold text-[#18231D]">
          {href ? (
            <Link className="transition-colors hover:text-[#347A48]" href={href}>
              {value}
            </Link>
          ) : (
            value
          )}
        </dd>
      </span>
    </div>
  );
}
