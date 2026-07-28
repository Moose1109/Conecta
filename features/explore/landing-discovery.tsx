import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ActivityCard } from "@/features/activities/activity-card";
import { VillageCard } from "@/features/villages/village-card";
import type { Activity, Village } from "@/lib/types";

const LANDING_RESULT_LIMIT = 3;

export function LandingDiscovery({
  activities,
  activitiesLimited,
  activitiesUnavailable,
  villages,
  villagesLimited,
  villagesUnavailable,
}: {
  activities: Activity[];
  activitiesLimited: boolean;
  activitiesUnavailable: boolean;
  villages: Village[];
  villagesLimited: boolean;
  villagesUnavailable: boolean;
}) {
  const visibleVillages = villages
    .filter(
      (village) =>
        hasAdministrativeValue(village.province) &&
        hasAdministrativeValue(village.region),
    )
    .slice(0, LANDING_RESULT_LIMIT);
  const visibleActivities = orderDatedActivities(activities).slice(
    0,
    LANDING_RESULT_LIMIT,
  );

  return (
    <div className="grid gap-10 sm:gap-12">
      <section aria-labelledby="landing-villages-title">
        <DiscoveryHeading
          description="Una muestra del catálogo público disponible ahora, sin rankings ni recomendaciones inventadas."
          eyebrow="Territorio"
          href="/villages"
          linkLabel="Ver todos los pueblos"
          title="Descubre algunos pueblos"
        />
        {villagesLimited ? (
          <SourceLimitNotice label="pueblos" />
        ) : null}
        {villagesUnavailable ? (
          <LandingSourceState
            description="La landing sigue disponible, pero el catálogo público de pueblos no ha respondido."
            title="No hemos podido cargar los pueblos"
          />
        ) : visibleVillages.length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleVillages.map((village) => (
              <VillageCard
                compact
                key={village.id}
                showFollowAction={false}
                village={village}
              />
            ))}
          </div>
        ) : (
          <LandingSourceState
            description="No hay pueblos persistentes con provincia y región disponibles entre los resultados cargados."
            icon={MapPin}
            title="Todavía no hay pueblos para mostrar aquí"
          />
        )}
      </section>

      <section aria-labelledby="landing-activities-title">
        <DiscoveryHeading
          description="Planes publicados en la agenda real. Mostramos primero fechas válidas próximas, sin presentar esta muestra como la agenda completa."
          eyebrow="Agenda pública"
          href="/activities"
          linkLabel="Explorar actividades"
          title="Actividades disponibles para explorar"
        />
        {activitiesLimited ? (
          <SourceLimitNotice label="actividades" />
        ) : null}
        {activitiesUnavailable ? (
          <LandingSourceState
            description="Los pueblos siguen disponibles, pero no hemos recibido la agenda pública del servidor."
            title="No hemos podido cargar las actividades"
          />
        ) : visibleActivities.length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleActivities.map((activity) => (
              <ActivityCard activity={activity} hydrateFromApi key={activity.id} />
            ))}
          </div>
        ) : (
          <LandingSourceState
            description="No hay actividades persistentes con una fecha válida entre los resultados cargados."
            icon={CalendarDays}
            title="No hay actividades fechadas para mostrar"
          />
        )}
      </section>
    </div>
  );
}

export function LandingDiscoveryLoading() {
  return (
    <div aria-busy="true" className="grid gap-10 sm:gap-12">
      {["pueblos", "actividades"].map((label) => (
        <section aria-label={`Cargando ${label}`} key={label}>
          <div className="skeleton-shimmer h-3 w-24 rounded-full" />
          <div className="skeleton-shimmer mt-3 h-8 w-80 max-w-full rounded-full" />
          <div className="skeleton-shimmer mt-3 h-4 w-[34rem] max-w-full rounded-full" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: LANDING_RESULT_LIMIT }, (_, index) => (
              <Card className="overflow-hidden" key={index}>
                <div className="skeleton-shimmer aspect-[16/9]" />
                <div className="p-4">
                  <div className="skeleton-shimmer h-3 w-28 rounded-full" />
                  <div className="skeleton-shimmer mt-3 h-6 w-3/4 rounded-full" />
                  <div className="skeleton-shimmer mt-3 h-4 w-full rounded-full" />
                  <div className="skeleton-shimmer mt-5 h-11 w-32 rounded-full" />
                </div>
              </Card>
            ))}
          </div>
        </section>
      ))}
      <span className="sr-only">Cargando contenido público de descubrimiento</span>
    </div>
  );
}

function DiscoveryHeading({
  description,
  eyebrow,
  href,
  linkLabel,
  title,
}: {
  description: string;
  eyebrow: string;
  href: string;
  linkLabel: string;
  title: string;
}) {
  const titleId = href === "/villages"
    ? "landing-villages-title"
    : "landing-activities-title";

  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2
          className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-text-primary sm:text-4xl"
          id={titleId}
        >
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-text-muted sm:text-base sm:leading-7">
          {description}
        </p>
      </div>
      <Link
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-[#184B3424] bg-white/88 px-5 py-2.5 text-sm font-extrabold text-primary transition-colors hover:border-[#184B3438] hover:bg-white sm:self-auto"
        href={href}
      >
        {linkLabel}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}

function SourceLimitNotice({ label }: { label: string }) {
  return (
    <p
      className="mt-4 rounded-2xl border border-[#D7A63C38] bg-[#FFF8E8] px-4 py-3 text-xs font-semibold leading-5 text-[#6C531B]"
      role="status"
    >
      La fuente alcanzó su límite de 100 {label}; esta muestra puede ser parcial.
    </p>
  );
}

function LandingSourceState({
  description,
  icon: Icon = AlertTriangle,
  title,
}: {
  description: string;
  icon?: typeof AlertTriangle;
  title: string;
}) {
  return (
    <Card className="mt-5 flex items-start gap-3 p-5" role="status">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#78947D1f] text-primary">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div>
        <h3 className="font-extrabold text-text-primary">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-text-muted">{description}</p>
      </div>
    </Card>
  );
}

function hasAdministrativeValue(value: string) {
  const normalized = value.trim().toLocaleLowerCase("es");
  return Boolean(normalized && !normalized.startsWith("sin "));
}

function activityTimestamp(activity: Activity) {
  const candidate = activity.endsAt ?? activity.startsAt ?? `${activity.date}T${activity.time}`;
  const timestamp = Date.parse(candidate);
  return Number.isFinite(timestamp) ? timestamp : undefined;
}

function orderDatedActivities(activities: Activity[]) {
  const now = Date.now();

  return activities
    .map((activity) => ({ activity, timestamp: activityTimestamp(activity) }))
    .filter(
      (item): item is { activity: Activity; timestamp: number } =>
        item.timestamp !== undefined,
    )
    .toSorted((left, right) => {
      const leftFinished = left.timestamp < now;
      const rightFinished = right.timestamp < now;

      if (leftFinished !== rightFinished) return leftFinished ? 1 : -1;
      return leftFinished
        ? right.timestamp - left.timestamp
        : left.timestamp - right.timestamp;
    })
    .map(({ activity }) => activity);
}
