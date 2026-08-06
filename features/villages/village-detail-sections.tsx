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
import { RemoteEntityImage } from "@/components/ui/remote-entity-image";
import { ActivityCard } from "@/features/activities/activity-card";
import { activityDisplayState } from "@/features/activities/activity-status";
import { ProtectedLinkButton } from "@/features/auth/protected-link-button";
import { VillageCard } from "@/features/villages/village-card";
import { VillageDescription } from "@/features/villages/village-description";
import { getTranslations } from "@/lib/i18n/get-translations";
import type { Translator } from "@/lib/i18n/translate";
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

export async function VillageDetailSections({
  activities,
  activitiesUnavailable,
  posts,
  postsUnavailable,
  relatedCatalog,
  relatedCatalogUnavailable,
  village,
}: VillageDetailSectionsProps) {
  const { t, locale } = await getTranslations();
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
        <h2 className="sr-only" id="village-stats-title">{t("villages.detail.statsAriaLabel")}</h2>
        {village.population > 0 ? (
          <VillageFact
            icon={UsersRound}
            label={t("villages.detail.habitantsLabel")}
            value={formatPopulation(village.population, locale)}
          />
        ) : null}
        <VillageFact
          icon={CalendarDays}
          label={t("villages.detail.activitiesLoadedLabel")}
          value={sourceCount(activities.length, activitiesUnavailable, activitiesLimited)}
        />
        <VillageFact
          icon={FileText}
          label={t("villages.detail.postsLoadedLabel")}
          value={sourceCount(posts.length, postsUnavailable, postsLimited)}
        />
        {hasAdministrativeValue(village.province) ? (
          <VillageFact icon={MapPin} label={t("villages.detail.provinceLabel")} value={village.province} />
        ) : null}
      </section>

      <section className={sectionAnchorClass} id="village-about">
        <Card className="p-6 sm:p-8">
          <p className="eyebrow">{t("villages.detail.aboutEyebrow")}</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#18231D]">
            {t("villages.detail.aboutTitle")}
          </h2>
          <div className="mt-5">
            {village.description ? (
              <VillageDescription description={village.description} />
            ) : (
              <p className="text-sm leading-6 text-[#687269]">
                {t("villages.detail.noDescription")}
              </p>
            )}
          </div>
        </Card>
      </section>

      {highlights.length ? (
        <section className={sectionAnchorClass} id="village-highlights">
          <SectionHeader
            eyebrow={t("villages.detail.highlightsEyebrow")}
            title={t("villages.detail.highlightsTitle", { name: village.name })}
            description={t("villages.detail.highlightsDescription")}
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
          <p className="eyebrow">{t("villages.detail.lifeEyebrow")}</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-text-primary">
            {t("villages.detail.lifeTitle")}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-text-muted">
            {t("villages.detail.lifeDescription")}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <LifeSummaryLink
              href="#village-activities"
              icon={CalendarDays}
              label={t("villages.detail.upcomingDetectedLabel")}
              value={activitiesUnavailable ? "—" : upcomingActivities.length}
            />
            <LifeSummaryLink
              href="#village-wall"
              icon={MessageSquareText}
              label={t("villages.detail.postsLoadedLabel")}
              value={postsUnavailable ? "—" : posts.length}
            />
            {upcomingActivities[0] ? (
              <LifeSummaryLink
                href="#village-activities"
                icon={MapPin}
                label={t("villages.detail.nextDateLabel")}
                value={readableDate(upcomingActivities[0].date, t, locale)}
              />
            ) : null}
          </div>
          {activitiesLimited || postsLimited ? (
            <p className="mt-4 text-xs font-semibold leading-5 text-text-muted" role="status">
              {t("villages.detail.lifeLimitNotice")}
            </p>
          ) : null}
        </Card>
      </section>

      <section
        aria-label={t("villages.detail.activitiesAriaLabel", { name: village.name })}
        className={sectionAnchorClass}
        id="village-activities"
      >
        <SectionHeader
          eyebrow={t("villages.detail.activitiesEyebrow")}
          title={t("villages.detail.activitiesAriaLabel", { name: village.name })}
          description={t("villages.detail.activitiesSectionDescription")}
        />
        {activitiesLimited ? <CollectionLimitNotice label={t("villages.detail.activitiesLimitLabel")} t={t} /> : null}
        <div className={activitiesLimited ? "mt-4" : undefined}>
          {activitiesUnavailable ? (
            <ErrorState
              actionHref="/activities"
              actionLabel={t("villages.detail.exploreFilteredAgenda")}
              description={t("villages.detail.activitiesErrorDescription")}
              network
              title={t("villages.detail.activitiesErrorTitle")}
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
                    {t("villages.detail.exploreFilteredAgenda")}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </LinkButton>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState
              actionHref="/activities"
              actionLabel={t("villages.detail.exploreActivitiesEmptyAction")}
              description={t("villages.detail.activitiesEmptyDescription")}
              icon={CalendarDays}
              title={t("villages.detail.activitiesEmptyTitle")}
            />
          )}
        </div>
      </section>

      <section aria-label={t("villages.detail.wallAriaLabel", { name: village.name })} className={sectionAnchorClass} id="village-wall">
        <SectionHeader
          eyebrow={t("villages.detail.postsEyebrow")}
          title={t("villages.detail.wallTitle")}
          description={t("villages.detail.postsSectionDescription")}
        />
        {postsLimited ? <CollectionLimitNotice label={t("villages.detail.postsLimitLabel")} t={t} /> : null}
        <div className={postsLimited ? "mt-4" : undefined}>
          {postsUnavailable ? (
            <ErrorState
              actionHref="/community"
              actionLabel={t("common.backendPending.actionLabel")}
              description={t("villages.detail.postsErrorDescription")}
              network
              title={t("villages.detail.postsErrorTitle")}
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
                    {t("villages.detail.searchMoreCommunity")}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </LinkButton>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState
              actionHref="/community"
              actionLabel={t("common.backendPending.actionLabel")}
              description={t("villages.detail.postsEmptyDescription")}
              icon={MessageSquareText}
              title={t("villages.detail.postsEmptyTitle")}
            />
          )}
        </div>
      </section>

      <section aria-label={t("villages.detail.voicesAriaLabel")} className={sectionAnchorClass} id="village-voices">
        <SectionHeader
          eyebrow={t("villages.detail.voicesEyebrow")}
          title={t("villages.detail.voicesAriaLabel")}
          description={t("villages.detail.voicesDescription", { name: village.name })}
        />
        {postsUnavailable ? (
          <CompactSourceState message={t("villages.detail.voicesEmptyUnavailable")} />
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
                      <p className="mt-0.5 text-xs font-medium text-[#687269]">{t("villages.detail.linkedPostLabel")} · {readableDate(post.date, t, locale)}</p>
                    </div>
                  </footer>
                </Card>
              </article>
            ))}
          </div>
        ) : (
          <CompactSourceState message={t("villages.detail.voicesEmptyNoVoices")} />
        )}
      </section>

      <section aria-label={t("villages.detail.photosSectionAriaLabel")} className={sectionAnchorClass} id="village-photos">
        <SectionHeader
          eyebrow={t("villages.detail.photosEyebrow")}
          title={t("villages.detail.photosSectionAriaLabel")}
          description={t("villages.detail.photosDescription")}
        />
        {postsUnavailable ? (
          <CompactSourceState message={t("villages.detail.photosEmptyUnavailable")} />
        ) : photos.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {photos.map((post) => (
              <figure className="group overflow-hidden rounded-[22px] border border-[#184B341a] bg-[#FFFCF7] shadow-[0_14px_42px_rgba(43,55,38,0.07)]" key={post.id}>
                <div className="relative aspect-square overflow-hidden bg-[#E8E6DD]">
                  <RemoteEntityImage
                    alt={t("villages.detail.photoAlt", { author: post.author, village: village.name })}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 320px"
                    src={post.image}
                    fallback={
                      <div className="grid h-full place-items-center text-[#687269]">
                        <Camera aria-hidden="true" className="size-8" strokeWidth={1.5} />
                      </div>
                    }
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
          <CompactSourceState message={t("villages.detail.photosEmptyNoPhotos")} />
        )}
      </section>

      <section aria-label={t("villages.detail.infoSectionAriaLabel")} className={sectionAnchorClass} id="village-info">
        <SectionHeader
          eyebrow={t("villages.detail.infoEyebrow")}
          title={t("villages.detail.infoSectionAriaLabel")}
          description={t("villages.detail.infoDescription")}
        />
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#78947D1f] text-[#184B34]">
              <Mountain aria-hidden="true" className="size-5" />
            </span>
            <h3 className="text-xl font-extrabold tracking-[-0.025em] text-[#18231D]">{t("villages.detail.territoryTitle")}</h3>
          </div>
          <dl className="mt-5 grid gap-x-8 divide-y divide-[#184B3412] sm:grid-cols-2 sm:divide-y-0">
            <VillageDetail label={t("villages.detail.villageLabel")} value={village.name} />
            {hasAdministrativeValue(village.province) ? <VillageDetail label={t("villages.detail.provinceLabel")} value={village.province} /> : null}
            {hasAdministrativeValue(village.region) ? <VillageDetail label={t("villages.detail.regionLabel")} value={village.region} /> : null}
            {village.population > 0 ? <VillageDetail label={t("villages.detail.populationDetailLabel")} value={t("villages.detail.populationValue", { count: formatPopulation(village.population, locale) })} /> : null}
          </dl>
          <p className="mt-5 flex items-start gap-2 rounded-2xl bg-[#F7F2E8] p-4 text-xs font-medium leading-5 text-[#687269]">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#60818A]" />
            {t("villages.detail.infoNotice")}
          </p>
        </Card>
      </section>

      <section aria-label={t("villages.detail.relatedAriaLabel")} className={sectionAnchorClass} id="village-related">
        <SectionHeader
          eyebrow={t("villages.detail.relatedEyebrow")}
          title={t("villages.detail.relatedTitle")}
          description={t("villages.detail.relatedDescription")}
        />
        {relatedCatalogLimited ? <CollectionLimitNotice label={t("villages.detail.catalogLimitLabel")} t={t} /> : null}
        <div className={relatedCatalogLimited ? "mt-4" : undefined}>
          {relatedCatalogUnavailable ? (
            <CompactSourceState message={t("villages.detail.catalogEmptyDescription")} />
          ) : relatedVillages.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {relatedVillages.map((relatedVillage) => (
                <VillageCard compact key={relatedVillage.id} showFollowAction={false} village={relatedVillage} />
              ))}
            </div>
          ) : (
            <CompactSourceState message={t("villages.detail.noRelatedVillages")} />
          )}
        </div>
      </section>

      <section aria-labelledby="village-participate-title" className={sectionAnchorClass} id="village-participate">
        <Card className="overflow-hidden p-6 text-text-primary sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="max-w-2xl">
              <p className="eyebrow">{t("villages.detail.participateEyebrow")}</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-text-primary" id="village-participate-title">
                {t("villages.detail.participateTitle", { name: village.name })}
              </h2>
              <p className="mt-3 text-sm leading-6 text-text-muted">
                {t("villages.detail.participateDescription")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:max-w-lg lg:justify-end">
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-highlight px-5 py-2.5 text-sm font-extrabold text-text-primary transition-colors hover:bg-[#C8952D] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                href={activityHref}
              >
                <CalendarDays aria-hidden="true" className="size-4" />
                {t("villages.detail.viewActivitiesAction")}
              </Link>
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary/20 bg-white/88 px-5 py-2.5 text-sm font-extrabold text-primary transition-colors hover:border-primary/35 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
                href={communityHref}
              >
                <MessageSquareText aria-hidden="true" className="size-4" />
                {t("villages.detail.searchCommunityAction")}
              </Link>
              <ProtectedLinkButton
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-dashed border-primary/30 bg-surface-muted px-5 py-2.5 text-sm font-extrabold text-primary transition-colors hover:border-primary/45 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:border-border disabled:bg-surface-muted disabled:text-text-muted disabled:opacity-70"
                href="/community#publicar"
                message={t("villages.detail.createPostAuthRequired")}
              >
                <PenLine aria-hidden="true" className="size-4" />
                {t("villages.detail.createPostAction")}
              </ProtectedLinkButton>
              <ProtectedLinkButton
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-dashed border-primary/30 bg-surface-muted px-5 py-2.5 text-sm font-extrabold text-primary transition-colors hover:border-primary/45 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:border-border disabled:bg-surface-muted disabled:text-text-muted disabled:opacity-70"
                href="/activities/create"
                message={t("villages.detail.createActivityAuthRequired")}
              >
                <Plus aria-hidden="true" className="size-4" />
                {t("villages.detail.createActivityAction")}
              </ProtectedLinkButton>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

export async function VillageDetailSectionsLoading() {
  const { t } = await getTranslations();

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
      <span className="sr-only">{t("villages.detail.loadingSummary")}</span>
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

function readableDate(date: string, t: Translator["t"], locale: Translator["locale"]) {
  try {
    return formatDate(date, locale);
  } catch {
    return t("community.postCard.dateUnavailable");
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

function CollectionLimitNotice({ label, t }: { label: string; t: Translator["t"] }) {
  return (
    <Card className="border-[#D7A63C38] bg-[#FFF8E8] px-4 py-3 text-xs font-semibold leading-5 text-[#6C531B]" role="status">
      {t("villages.detail.collectionLimitNotice", { label })}
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
