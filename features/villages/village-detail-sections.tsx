import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  FileText,
  Info,
  MapPin,
  MessageSquareText,
  Mountain,
  PenLine,
  Plus,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { EmptyState } from "@/components/social/empty-state";
import { SocialPostCard } from "@/components/social/social-post-card";
import { UserAvatar } from "@/components/social/user-avatar";
import { LinkButton } from "@/components/ui/button";
import { Card, SectionHeader } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { ActivityCard } from "@/features/activities/activity-card";
import { activityDisplayState } from "@/features/activities/activity-status-badges";
import { ProtectedLinkButton } from "@/features/auth/protected-link-button";
import { VillageCard } from "@/features/villages/village-card";
import { VillageDescription } from "@/features/villages/village-description";
import { formatDate, formatPopulation } from "@/lib/utils";
import type { Activity, CommunityPost, Village } from "@/lib/types";

const VISIBLE_ACTIVITIES = 6;
const VISIBLE_POSTS = 4;
const VISIBLE_VOICES = 3;
const VISIBLE_PHOTOS = 6;
const VISIBLE_RELATED_VILLAGES = 4;
const sectionAnchorClass = "scroll-mt-[calc(var(--topbar-height)+1rem)]";

type VillageDetailSectionsProps = {
  activities: Activity[];
  activitiesUnavailable: boolean;
  posts: CommunityPost[];
  postsUnavailable: boolean;
  relatedCatalog: Village[];
  relatedCatalogUnavailable: boolean;
  village: Village;
};

export function VillageDetailSections({
  activities,
  activitiesUnavailable,
  posts,
  postsUnavailable,
  relatedCatalog,
  relatedCatalogUnavailable,
  village,
}: VillageDetailSectionsProps) {
  const activitiesLimited = activities.length >= 100;
  const postsLimited = posts.length >= 100;
  const relatedCatalogLimited = relatedCatalog.length >= 100;
  const highlights = Array.from(
    new Set(village.highlights.map((highlight) => highlight.trim()).filter(Boolean)),
  );
  const orderedActivities = orderActivities(activities);
  const upcomingActivities = orderedActivities.filter((activity) => {
    const timestamp = activityTimestamp(activity);
    return timestamp !== undefined && !activityDisplayState(activity).finished;
  });
  const voices = selectCommunityVoices(posts, VISIBLE_VOICES);
  const photos = uniquePostPhotos(posts).slice(0, VISIBLE_PHOTOS);
  const relatedVillages = selectRelatedVillages(village, relatedCatalog).slice(
    0,
    VISIBLE_RELATED_VILLAGES,
  );
  const activityHref = `/activities?village_id=${encodeURIComponent(village.id)}`;
  const communityHref = `/community?q=${encodeURIComponent(village.name)}`;

  return (
    <div className="grid gap-10 sm:gap-12">
      <section
        aria-labelledby="village-stats-title"
        className={`${sectionAnchorClass} grid gap-3 sm:grid-cols-2 xl:grid-cols-4`}
        id="village-stats"
      >
        <h2 className="sr-only" id="village-stats-title">Estadísticas del pueblo</h2>
        {village.population > 0 ? (
          <VillageFact
            icon={UsersRound}
            label="Habitantes"
            value={formatPopulation(village.population)}
          />
        ) : null}
        <VillageFact
          icon={CalendarDays}
          label="Actividades cargadas"
          value={sourceCount(activities.length, activitiesUnavailable, activitiesLimited)}
        />
        <VillageFact
          icon={FileText}
          label="Publicaciones cargadas"
          value={sourceCount(posts.length, postsUnavailable, postsLimited)}
        />
        {hasAdministrativeValue(village.province) ? (
          <VillageFact icon={MapPin} label="Provincia" value={village.province} />
        ) : null}
      </section>

      <section className={sectionAnchorClass} id="village-about">
        <Card className="p-6 sm:p-8">
          <p className="eyebrow">Conoce el lugar</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#18231D]">
            Sobre el pueblo
          </h2>
          <div className="mt-5">
            {village.description ? (
              <VillageDescription description={village.description} />
            ) : (
              <p className="text-sm leading-6 text-[#687269]">
                Este pueblo todavía no tiene una descripción publicada.
              </p>
            )}
          </div>
        </Card>
      </section>

      {highlights.length ? (
        <section className={sectionAnchorClass} id="village-highlights">
          <SectionHeader
            eyebrow="Señas locales"
            title={`Qué hace especial a ${village.name}`}
            description="Rasgos publicados en la ficha actual del pueblo."
          />
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {highlights.map((highlight) => (
              <li key={highlight}>
                <Card className="flex min-h-20 items-center gap-3 p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#D7A63C24] text-[#7A5B16]">
                    <Sparkles aria-hidden="true" className="size-4.5" />
                  </span>
                  <span className="text-sm font-extrabold leading-6 text-[#18231D]">{highlight}</span>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className={sectionAnchorClass} id="village-life">
        <Card className="overflow-hidden p-6 text-text-primary sm:p-8">
          <p className="eyebrow">Vida actual</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-text-primary">
            Lo que aparece en los resultados disponibles
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-text-muted">
            Este resumen se calcula con las publicaciones y actividades ya cargadas para esta ficha. No representa un total histórico.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <LifeSummaryLink
              href="#village-activities"
              icon={CalendarDays}
              label="Próximas detectadas"
              value={activitiesUnavailable ? "—" : upcomingActivities.length}
            />
            <LifeSummaryLink
              href="#village-wall"
              icon={MessageSquareText}
              label="Publicaciones cargadas"
              value={postsUnavailable ? "—" : posts.length}
            />
            {upcomingActivities[0] ? (
              <LifeSummaryLink
                href="#village-activities"
                icon={MapPin}
                label="Próxima fecha detectada"
                value={readableDate(upcomingActivities[0].date)}
              />
            ) : null}
          </div>
          {activitiesLimited || postsLimited ? (
            <p className="mt-4 text-xs font-semibold leading-5 text-text-muted" role="status">
              Una o más fuentes han alcanzado el límite de 100 resultados; los valores anteriores describen solo el conjunto cargado.
            </p>
          ) : null}
        </Card>
      </section>

      <section
        aria-label={`Actividades en ${village.name}`}
        className={sectionAnchorClass}
        id="village-activities"
      >
        <SectionHeader
          eyebrow="Planes locales"
          title={`Actividades en ${village.name}`}
          description="Hasta seis actividades vinculadas por el backend, con las próximas detectadas primero y sus estados reales visibles."
        />
        {activitiesLimited ? <CollectionLimitNotice label="actividades" /> : null}
        <div className={activitiesLimited ? "mt-4" : undefined}>
          {activitiesUnavailable ? (
            <ErrorState
              actionHref="/activities"
              actionLabel="Explorar agenda"
              description="La ficha del pueblo sigue disponible, pero su agenda local no ha podido cargarse."
              network
              title="No hemos podido cargar las actividades"
            />
          ) : orderedActivities.length ? (
            <>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {orderedActivities.slice(0, VISIBLE_ACTIVITIES).map((activity) => (
                  <ActivityCard hydrateFromApi key={activity.id} activity={activity} />
                ))}
              </div>
              {orderedActivities.length > VISIBLE_ACTIVITIES ? (
                <div className="mt-6 flex justify-center">
                  <LinkButton href={activityHref} variant="secondary">
                    Ver agenda filtrada
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </LinkButton>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState
              actionHref="/activities"
              actionLabel="Explorar actividades"
              description="No hay actividades vinculadas a este pueblo entre los resultados disponibles."
              icon={CalendarDays}
              title="Aún no hay actividades publicadas aquí"
            />
          )}
        </div>
      </section>

      <section aria-label={`Muro de ${village.name}`} className={sectionAnchorClass} id="village-wall">
        <SectionHeader
          eyebrow="Comunidad"
          title="Muro del pueblo"
          description="Una selección de publicaciones vinculadas a este pueblo por el backend, en el orden recibido."
        />
        {postsLimited ? <CollectionLimitNotice label="publicaciones" /> : null}
        <div className={postsLimited ? "mt-4" : undefined}>
          {postsUnavailable ? (
            <ErrorState
              actionHref="/community"
              actionLabel="Ir a comunidad"
              description="La ficha del pueblo sigue disponible, pero no hemos podido conectar con su muro."
              network
              title="No hemos podido cargar las publicaciones"
            />
          ) : posts.length ? (
            <>
              <div className="mx-auto grid max-w-3xl gap-5">
                {posts.slice(0, VISIBLE_POSTS).map((post) => (
                  <SocialPostCard hydrateFromApi key={post.id} post={post} />
                ))}
              </div>
              {posts.length > VISIBLE_POSTS ? (
                <div className="mt-6 flex justify-center">
                  <LinkButton href={communityHref} variant="secondary">
                    Buscar más en Comunidad
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </LinkButton>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState
              actionHref="/community"
              actionLabel="Ir a comunidad"
              description="Cuando haya publicaciones asociadas a este pueblo aparecerán aquí."
              icon={MessageSquareText}
              title="El muro todavía está por estrenar"
            />
          )}
        </div>
      </section>

      <section aria-label="Voces de la comunidad" className={sectionAnchorClass} id="village-voices">
        <SectionHeader
          eyebrow="Publicaciones vinculadas"
          title="Voces de la comunidad"
          description={`Textos compartidos en publicaciones asociadas a ${village.name}. No implican residencia ni representación oficial.`}
        />
        {postsUnavailable ? (
          <CompactSourceState message="No podemos seleccionar voces porque el muro no está disponible ahora." />
        ) : voices.length ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {voices.map((post) => (
              <article className="h-full" key={post.id}>
                <Card className="flex h-full flex-col p-5 sm:p-6">
                  <span className="font-editorial text-4xl leading-none text-[#D7A63C]" aria-hidden="true">“</span>
                  <blockquote className="mt-2 flex-1">
                    <p className="whitespace-pre-line text-sm font-medium leading-7 text-[#435048]">{post.content}</p>
                  </blockquote>
                  <footer className="mt-5 flex items-center gap-3 border-t border-[#184B3414] pt-4">
                    <UserAvatar className="size-10 ring-2 ring-white" imageUrl={post.authorAvatar} name={post.author} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-[#18231D]">{post.author}</p>
                      <p className="mt-0.5 text-xs font-medium text-[#687269]">Publicación vinculada · {readableDate(post.date)}</p>
                    </div>
                  </footer>
                </Card>
              </article>
            ))}
          </div>
        ) : (
          <CompactSourceState message="Todavía no hay publicaciones con texto suficiente para destacar en esta sección." />
        )}
      </section>

      <section aria-label="Fotos recientes de la comunidad" className={sectionAnchorClass} id="village-photos">
        <SectionHeader
          eyebrow="Imágenes de publicaciones"
          title="Fotos recientes de la comunidad"
          description="Imágenes válidas incluidas en publicaciones vinculadas al pueblo, según el orden recibido."
        />
        {postsUnavailable ? (
          <CompactSourceState message="No podemos cargar las fotos porque el muro no está disponible ahora." />
        ) : photos.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {photos.map((post) => (
              <figure className="group overflow-hidden rounded-[22px] border border-[#184B341a] bg-[#FFFCF7] shadow-[0_14px_42px_rgba(43,55,38,0.07)]" key={post.id}>
                <div className="relative aspect-square overflow-hidden bg-[#E8E6DD]">
                  <Image
                    alt={`Imagen compartida por ${post.author} en una publicación vinculada a ${village.name}`}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 320px"
                    src={post.image}
                  />
                </div>
                <figcaption className="p-3 sm:p-4">
                  <p className="line-clamp-2 text-sm font-extrabold leading-5 text-[#18231D]">{post.title}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#687269]">
                    <Camera aria-hidden="true" className="size-3.5" />
                    {post.author}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <CompactSourceState message="Las publicaciones cargadas todavía no incluyen fotografías válidas." />
        )}
      </section>

      <section aria-label="Información práctica" className={sectionAnchorClass} id="village-info">
        <SectionHeader
          eyebrow="Ficha local"
          title="Información práctica"
          description="Datos administrativos disponibles en la ficha real del pueblo."
        />
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#78947D1f] text-[#184B34]">
              <Mountain aria-hidden="true" className="size-5" />
            </span>
            <h3 className="text-xl font-extrabold tracking-[-0.025em] text-[#18231D]">El territorio</h3>
          </div>
          <dl className="mt-5 grid gap-x-8 divide-y divide-[#184B3412] sm:grid-cols-2 sm:divide-y-0">
            <VillageDetail label="Pueblo" value={village.name} />
            {hasAdministrativeValue(village.province) ? <VillageDetail label="Provincia" value={village.province} /> : null}
            {hasAdministrativeValue(village.region) ? <VillageDetail label="Región" value={village.region} /> : null}
            {village.population > 0 ? <VillageDetail label="Población" value={`${formatPopulation(village.population)} habitantes`} /> : null}
          </dl>
          <p className="mt-5 flex items-start gap-2 rounded-2xl bg-[#F7F2E8] p-4 text-xs font-medium leading-5 text-[#687269]">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#60818A]" />
            Transporte, horarios, enlaces oficiales y accesibilidad física necesitan datos verificados adicionales de BACK-5 y no se muestran todavía.
          </p>
        </Card>
      </section>

      <section aria-label="Pueblos relacionados" className={sectionAnchorClass} id="village-related">
        <SectionHeader
          eyebrow="Ubicación administrativa"
          title="Pueblos relacionados por ubicación administrativa"
          description="Priorizamos coincidencias de provincia y después de región dentro del catálogo cargado. No implica cercanía geográfica."
        />
        {relatedCatalogLimited ? <CollectionLimitNotice label="pueblos del catálogo" /> : null}
        <div className={relatedCatalogLimited ? "mt-4" : undefined}>
          {relatedCatalogUnavailable ? (
            <CompactSourceState message="No hemos podido cargar el catálogo necesario para relacionar otros pueblos." />
          ) : relatedVillages.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {relatedVillages.map((relatedVillage) => (
                <VillageCard compact key={relatedVillage.id} showFollowAction={false} village={relatedVillage} />
              ))}
            </div>
          ) : (
            <CompactSourceState message="No se han encontrado otros pueblos con la misma provincia o región en el catálogo disponible." />
          )}
        </div>
      </section>

      <section aria-labelledby="village-participate-title" className={sectionAnchorClass} id="village-participate">
        <Card className="overflow-hidden p-6 text-text-primary sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="max-w-2xl">
              <p className="eyebrow">Participa</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-text-primary" id="village-participate-title">
                Suma vida a {village.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-text-muted">
                Explora su agenda, busca publicaciones relacionadas o comparte contenido seleccionando este pueblo en el formulario real.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:max-w-lg lg:justify-end">
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-highlight px-5 py-2.5 text-sm font-extrabold text-text-primary transition-colors hover:bg-[#C8952D] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                href={activityHref}
              >
                <CalendarDays aria-hidden="true" className="size-4" />
                Ver actividades
              </Link>
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary/20 bg-white/88 px-5 py-2.5 text-sm font-extrabold text-primary transition-colors hover:border-primary/35 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
                href={communityHref}
              >
                <MessageSquareText aria-hidden="true" className="size-4" />
                Buscar en Comunidad
              </Link>
              <ProtectedLinkButton
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-dashed border-primary/30 bg-surface-muted px-5 py-2.5 text-sm font-extrabold text-primary transition-colors hover:border-primary/45 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:border-border disabled:bg-surface-muted disabled:text-text-muted disabled:opacity-70"
                href="/community#publicar"
                message="Para crear una publicación necesitas iniciar sesión."
              >
                <PenLine aria-hidden="true" className="size-4" />
                Crear publicación
              </ProtectedLinkButton>
              <ProtectedLinkButton
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-dashed border-primary/30 bg-surface-muted px-5 py-2.5 text-sm font-extrabold text-primary transition-colors hover:border-primary/45 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:border-border disabled:bg-surface-muted disabled:text-text-muted disabled:opacity-70"
                href="/activities/create"
                message="Para crear una actividad necesitas iniciar sesión."
              >
                <Plus aria-hidden="true" className="size-4" />
                Crear actividad
              </ProtectedLinkButton>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

export function VillageDetailSectionsLoading() {
  return (
    <div aria-busy="true" className="grid gap-8 sm:gap-10">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Card className="p-4" key={index}>
            <div className="flex items-center gap-3">
              <span className="skeleton-shimmer size-11 rounded-2xl" />
              <span className="min-w-0 flex-1">
                <span className="skeleton-shimmer block h-3 w-24 rounded-full" />
                <span className="skeleton-shimmer mt-2 block h-6 w-32 max-w-full rounded-full" />
              </span>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-6 sm:p-8">
        <div className="skeleton-shimmer h-4 w-28 rounded-full" />
        <div className="skeleton-shimmer mt-4 h-8 w-64 max-w-full rounded-full" />
        <div className="skeleton-shimmer mt-6 h-4 w-full rounded-full" />
        <div className="skeleton-shimmer mt-3 h-4 w-5/6 rounded-full" />
        <div className="skeleton-shimmer mt-3 h-4 w-2/3 rounded-full" />
      </Card>
      <span className="sr-only">Cargando la información vinculada al pueblo</span>
    </div>
  );
}

function sourceCount(count: number, unavailable: boolean, limited: boolean) {
  return unavailable || limited ? "—" : count;
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

function orderActivities(activities: Activity[]) {
  return activities.toSorted((left, right) => {
    const leftTimestamp = activityTimestamp(left);
    const rightTimestamp = activityTimestamp(right);
    const leftFinished = activityDisplayState(left).finished;
    const rightFinished = activityDisplayState(right).finished;

    if (leftFinished !== rightFinished) return leftFinished ? 1 : -1;
    if (leftTimestamp === undefined && rightTimestamp === undefined) return 0;
    if (leftTimestamp === undefined) return 1;
    if (rightTimestamp === undefined) return -1;
    return leftFinished ? rightTimestamp - leftTimestamp : leftTimestamp - rightTimestamp;
  });
}

function selectCommunityVoices(posts: CommunityPost[], limit: number) {
  const substantialPosts = posts.filter((post) => post.content.trim().length >= 60);
  const candidates = substantialPosts.length >= 2 ? substantialPosts : posts;
  const selected: CommunityPost[] = [];
  const seenAuthors = new Set<string>();

  for (const post of candidates) {
    const authorKey = post.authorId || post.authorHandle || post.author;
    if (seenAuthors.has(authorKey)) continue;
    selected.push(post);
    seenAuthors.add(authorKey);
    if (selected.length === limit) return selected;
  }

  for (const post of candidates) {
    if (selected.some((selectedPost) => selectedPost.id === post.id)) continue;
    selected.push(post);
    if (selected.length === limit) break;
  }

  return selected;
}

function uniquePostPhotos(posts: CommunityPost[]) {
  const seenImages = new Set<string>();
  return posts.filter((post): post is CommunityPost & { image: string } => {
    if (!post.image || seenImages.has(post.image)) return false;
    seenImages.add(post.image);
    return true;
  });
}

function selectRelatedVillages(village: Village, catalog: Village[]) {
  const candidates = catalog.filter((item) => item.id !== village.id);
  const sameProvince = hasAdministrativeValue(village.province)
    ? candidates.filter((item) => item.province === village.province)
    : [];
  const provinceIds = new Set(sameProvince.map((item) => item.id));
  const sameRegion = hasAdministrativeValue(village.region)
    ? candidates.filter(
        (item) => item.region === village.region && !provinceIds.has(item.id),
      )
    : [];

  return [...sameProvince, ...sameRegion];
}

function readableDate(date: string) {
  try {
    return formatDate(date);
  } catch {
    return "Fecha no disponible";
  }
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
        <p className="mt-1 truncate text-xl font-extrabold tracking-[-0.025em] text-[#18231D]">{value}</p>
      </div>
    </Card>
  );
}

function LifeSummaryLink({
  href,
  icon: Icon,
  label,
  value,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <Link
      className="flex min-h-24 items-center gap-3 rounded-[20px] border border-border bg-surface-muted p-4 transition-colors hover:border-primary/25 hover:bg-ivory focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
      href={href}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-highlight/20 text-primary">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold text-text-muted">{label}</span>
        <span className="mt-1 block truncate text-lg font-extrabold text-text-primary">{value}</span>
      </span>
    </Link>
  );
}

function CollectionLimitNotice({ label }: { label: string }) {
  return (
    <Card className="border-[#D7A63C38] bg-[#FFF8E8] px-4 py-3 text-xs font-semibold leading-5 text-[#6C531B]" role="status">
      Se muestran hasta 100 {label}; esta colección puede estar incompleta y no se presenta como un total histórico.
    </Card>
  );
}

function CompactSourceState({ message }: { message: string }) {
  return (
    <Card className="flex items-start gap-3 p-5 text-sm font-medium leading-6 text-[#687269]" role="status">
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#78947D1a] text-[#60818A]">
        <Info aria-hidden="true" className="size-4.5" />
      </span>
      <p>{message}</p>
    </Card>
  );
}

function VillageDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 text-sm">
      <dt className="font-semibold text-[#687269]">{label}</dt>
      <dd className="text-right font-extrabold text-[#18231D]">{value}</dd>
    </div>
  );
}
