import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Landmark,
  MapPin,
  UsersRound,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ActivityCategoryIcon, activityCategoryPill } from "@/features/activities/activity-category-icon";
import { ActivityImage } from "@/features/activities/activity-image";
import { LandingAuthActions } from "@/features/auth/auth-landing-actions";
import {
  AccessibleCarousel,
} from "@/features/explore/accessible-carousel";
import { formatDate } from "@/lib/utils";
import type { Activity, Village } from "@/lib/types";

const LANDING_RESULT_LIMIT = 5;
const carouselItemClass =
  "flex min-w-0 shrink-0 snap-start basis-[86%] sm:basis-[46%] xl:basis-[calc(33.333%-0.667rem)]";

export function LandingDiscovery({
  activities,
  activitiesUnavailable,
  villages,
  villagesUnavailable,
}: {
  activities: Activity[];
  activitiesUnavailable: boolean;
  villages: Village[];
  villagesUnavailable: boolean;
}) {
  const visibleVillages = villages
    .filter(
      (village) =>
        hasAdministrativeValue(village.province) &&
        hasAdministrativeValue(village.region),
    )
    .slice(0, LANDING_RESULT_LIMIT);
  const visibleActivities = upcomingActivities(activities).slice(
    0,
    LANDING_RESULT_LIMIT,
  );

  return (
    <div className="grid min-w-0 gap-12 pb-8 sm:gap-16 sm:pb-12">
      <section className="min-w-0" aria-labelledby="landing-villages-title">
        <DiscoveryHeading
          description="Una selección limitada de pueblos reales del catálogo, sin rankings ni recomendaciones inventadas."
          eyebrow="Territorio"
          id="landing-villages-title"
          title="Pueblos para descubrir"
        />
        {villagesUnavailable ? (
          <LandingSourceState
            description="La landing sigue disponible, pero el catálogo público de pueblos no ha respondido."
            title="No hemos podido cargar los pueblos"
          />
        ) : visibleVillages.length ? null : (
          <LandingSourceState
            description="La fuente está disponible, pero no contiene pueblos persistentes con provincia y región entre los resultados recibidos."
            icon={MapPin}
            title="Todavía no hay pueblos para mostrar aquí"
          />
        )}
        <AccessibleCarousel
          itemCount={visibleVillages.length + 1}
          label="Pueblos para descubrir"
        >
          {visibleVillages.map((village) => (
            <li className={carouselItemClass} key={village.id}>
              <PublicVillagePreview village={village} />
            </li>
          ))}
          <li className={carouselItemClass}>
            <DiscoveryAuthCard
              description="Regístrate o inicia sesión para conocer más pueblos y formar parte de sus comunidades."
              eyebrow="Tu próximo lugar"
              title="Sigue descubriendo"
            />
          </li>
        </AccessibleCarousel>
      </section>

      <section className="min-w-0" aria-labelledby="landing-activities-title">
        <DiscoveryHeading
          description="Hasta cinco planes futuros publicados en la agenda real, ordenados por la fecha más próxima."
          eyebrow="Agenda pública"
          id="landing-activities-title"
          title="Próximas actividades"
        />
        {activitiesUnavailable ? (
          <LandingSourceState
            description="Los pueblos siguen disponibles, pero no hemos recibido la agenda pública del servidor."
            title="No hemos podido cargar las actividades"
          />
        ) : visibleActivities.length ? null : (
          <LandingSourceState
            description="La agenda está disponible, pero no contiene actividades futuras persistentes entre los resultados recibidos."
            icon={CalendarDays}
            title="No hay próximas actividades para mostrar"
          />
        )}
        <AccessibleCarousel
          itemCount={visibleActivities.length + 1}
          label="Próximas actividades"
        >
          {visibleActivities.map((activity) => (
            <li className={carouselItemClass} key={activity.id}>
              <PublicActivityPreview activity={activity} />
            </li>
          ))}
          <li className={carouselItemClass}>
            <DiscoveryAuthCard
              description="Crea tu cuenta para consultar todas las actividades y participar."
              eyebrow="Agenda completa"
              title="Hay más planes esperándote"
            />
          </li>
        </AccessibleCarousel>
      </section>
    </div>
  );
}

export function LandingDiscoveryLoading() {
  return (
    <div aria-busy="true" className="grid min-w-0 gap-12 pb-8 sm:gap-16 sm:pb-12">
      {["pueblos", "actividades"].map((label) => (
        <section className="min-w-0" aria-label={`Cargando ${label}`} key={label}>
          <div className="px-2 sm:px-0">
            <div className="skeleton-shimmer h-3 w-24 rounded-full" />
            <div className="skeleton-shimmer mt-3 h-8 w-80 max-w-full rounded-full" />
            <div className="skeleton-shimmer mt-3 h-4 w-[34rem] max-w-full rounded-full" />
          </div>
          <div className="mt-5 flex gap-4 overflow-hidden px-2 sm:px-0">
            {Array.from({ length: 4 }, (_, index) => (
              <Card className="min-w-0 shrink-0 basis-[86%] overflow-hidden sm:basis-[46%] xl:basis-[calc(33.333%-0.667rem)]" key={index}>
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
  id,
  title,
}: {
  description: string;
  eyebrow: string;
  id: string;
  title: string;
}) {
  return (
    <div className="max-w-3xl px-2 sm:px-0">
      <p className="eyebrow">{eyebrow}</p>
      <h2
        className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-text-primary sm:text-4xl"
        id={id}
      >
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-text-muted sm:text-base sm:leading-7">
        {description}
      </p>
    </div>
  );
}

function PublicVillagePreview({ village }: { village: Village }) {
  const image = village.image ?? village.bannerImage;

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden rounded-[20px]" data-public-village-preview>
      <Link
        aria-label={`Conocer ${village.name}`}
        className="relative block aspect-[16/9] overflow-hidden bg-[#D9E0D7]"
        href={`/villages/${village.id}`}
      >
        {image ? (
          <Image
            alt={village.name}
            className="object-cover transition-transform duration-500 hover:scale-[1.025]"
            fill
            sizes="(max-width: 639px) 86vw, (max-width: 1279px) 46vw, 33vw"
            src={image}
          />
        ) : (
          <span className="topographic-pattern grid h-full place-items-center bg-[linear-gradient(145deg,#184B34,#78947D)] text-white">
            <Landmark aria-hidden="true" className="size-8" />
          </span>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-[#FFFCF7]/92 px-3 py-1.5 text-[11px] font-extrabold text-[#184B34] shadow-sm backdrop-blur">
          <MapPin aria-hidden="true" className="size-3.5" />
          {village.region}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-bold text-text-muted">{village.province}</p>
        <h3 className="mt-2 text-xl font-extrabold tracking-[-0.025em] text-text-primary">
          {village.name}
        </h3>
        {village.tagline || village.description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-muted">
            {village.tagline || village.description}
          </p>
        ) : null}
        <Link
          className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-4 text-sm font-extrabold text-primary hover:text-forest-mid"
          href={`/villages/${village.id}`}
        >
          Conocer el pueblo
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </Card>
  );
}

function PublicActivityPreview({ activity }: { activity: Activity }) {
  const complete = activity.spotsLeft === 0 || ["full", "completo"].includes(activity.status?.toLocaleLowerCase("es") ?? "");

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden rounded-[20px]" data-public-activity-preview>
      <div className="relative aspect-[16/9] overflow-hidden bg-[#D9E0D7]">
        <ActivityImage
          activity={activity}
          sizes="(max-width: 639px) 86vw, (max-width: 1279px) 46vw, 33vw"
        />
        <span className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-extrabold shadow-sm backdrop-blur ${complete ? "border-[#C96D4A45] bg-[#FFF7F1]/94 text-[#873E29]" : "border-white/40 bg-[#FFFCF7]/94 text-[#184B34]"}`}>
          <UsersRound aria-hidden="true" className="size-3.5" />
          {complete ? "Completo" : "Disponible"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${activityCategoryPill(activity.category)}`}>
            <ActivityCategoryIcon category={activity.category} className="size-3.5" />
            {activity.category}
          </span>
          <span className="text-xs font-bold text-text-muted">{formatDate(activity.date)}</span>
        </div>
        <h3 className="mt-3 line-clamp-2 text-xl font-extrabold leading-tight tracking-[-0.025em] text-text-primary">
          {activity.title}
        </h3>
        {activity.villageName ? (
          <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs font-extrabold text-[#347A48]">
            <MapPin aria-hidden="true" className="size-3.5" />
            {activity.villageName}
          </p>
        ) : null}
      </div>
    </Card>
  );
}

function DiscoveryAuthCard({
  description,
  eyebrow,
  title,
}: {
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <Card className="topographic-pattern flex h-full w-full flex-col justify-center overflow-hidden rounded-[20px] border-[#184B3424] bg-[linear-gradient(145deg,#F1E9D9,#FFFCF7)] p-5 sm:p-6" data-discovery-auth-card>
      <span className="grid size-12 place-items-center rounded-2xl bg-[#184B34] text-white shadow-[0_12px_28px_rgba(24,75,52,0.18)]">
        <ArrowRight aria-hidden="true" className="size-5" />
      </span>
      <p className="eyebrow mt-5">{eyebrow}</p>
      <h3 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-0.035em] text-text-primary">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-text-muted">{description}</p>
      <LandingAuthActions />
    </Card>
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
    <Card className="mx-2 mt-5 flex items-start gap-3 p-5 sm:mx-0" role="status">
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

/**
 * `starts_at` llega del backend como datetime naive (sin zona horaria, ver
 * `activity.py` en Api-ConextaPueblos), es decir, ya expresado en hora de
 * pared de Europe/Madrid. Comparar con `Date.parse`/`Date.now()` asumiría la
 * zona horaria del proceso Node en ejecución (puede no ser Europe/Madrid en
 * producción) y desplazaría la frontera alrededor de medianoche. Por eso
 * comparamos cadenas de reloj de pared ISO directamente, igual que hace
 * `app/page.tsx` para calcular "hoy".
 */
function madridWallClockNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone: "Europe/Madrid",
    year: "numeric",
  }).formatToParts(new Date());
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "00";

  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}:${part("second")}`;
}

function activityWallClockStart(activity: Activity) {
  return activity.startsAt ?? `${activity.date}T${activity.time}`;
}

function upcomingActivities(activities: Activity[]) {
  const now = madridWallClockNow();

  return activities
    .filter((activity) => {
      const start = activityWallClockStart(activity);
      return (
        Boolean(start) &&
        start >= now &&
        !["cancelled", "canceled", "finalizada", "finished"].includes(activity.status?.toLocaleLowerCase("es") ?? "")
      );
    })
    .toSorted((left, right) => activityWallClockStart(left).localeCompare(activityWallClockStart(right)));
}
