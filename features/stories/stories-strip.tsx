"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { AlertTriangle, ImageOff, LoaderCircle, Plus, Sparkles, X } from "lucide-react";
import { useRef, useState } from "react";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Badge, Card } from "@/components/ui/card";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { useAuthGuard } from "@/features/auth/use-auth-guard";
import {
  getConceptStoryGroups,
  getFirstStoryPosition,
  getLastStoryPosition,
  getNextStoryPosition,
  getPreviousStoryPosition,
  type StoriesConceptState,
  type StoryPosition,
} from "@/features/stories/stories-concept-data";

const StoryViewer = dynamic(
  () => import("@/features/stories/story-viewer").then((mod) => mod.StoryViewer),
  { ssr: false },
);

export function StoriesStrip({
  initialState = "ready",
  initialViewerPosition,
}: {
  initialState?: StoriesConceptState;
  initialViewerPosition?: "first" | "last";
}) {
  const { t, tPlural } = useTranslations();
  const groups = getConceptStoryGroups(initialState);
  const initialPosition = initialViewerPosition === "first"
    ? getFirstStoryPosition(groups)
    : initialViewerPosition === "last"
      ? getLastStoryPosition(groups)
      : undefined;
  const [position, setPosition] = useState<StoryPosition | undefined>(initialPosition);
  const [creationNoticeVisible, setCreationNoticeVisible] = useState(false);
  const viewerTriggerRef = useRef<HTMLButtonElement | null>(null);
  const { authModal, requireAuth } = useAuthGuard();

  function requestStoryCreation() {
    setCreationNoticeVisible(false);
    requireAuth(t("stories.authRequiredCreate"), () => {
      setCreationNoticeVisible(true);
    });
  }

  function openGroup(groupIndex: number, trigger: HTMLButtonElement) {
    viewerTriggerRef.current = trigger;
    setPosition({ groupIndex, storyIndex: 0 });
  }

  function stepNext() {
    setPosition((current) => {
      if (!current) return current;
      return getNextStoryPosition(groups, current);
    });
  }

  function stepPrevious() {
    setPosition((current) => {
      if (!current) return current;
      const previous = getPreviousStoryPosition(groups, current);
      return previous ?? current;
    });
  }

  function closeViewer() {
    setPosition(undefined);
  }

  const activeGroup = position ? groups[position.groupIndex] : undefined;

  return (
    <section aria-label={t("stories.title")} className="mb-4 min-w-0 scroll-mt-24 sm:mb-5" id="historias">
      <Card className="min-w-0 max-w-full overflow-hidden bg-[#FFFCF7]/96 backdrop-blur-none">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3 pt-2.5 sm:px-4 sm:pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="text-sm font-extrabold text-text-primary sm:text-base">{t("stories.title")}</h2>
            <Badge className="gap-1 bg-[#347A4812] px-2 py-0.5 text-[9px] uppercase tracking-[0.08em] text-primary sm:text-[10px]">
              <Sparkles aria-hidden="true" className="size-3" />
              {t("common.prototypeBadge")}
            </Badge>
          </div>
          <p className="min-w-0 shrink-[2] basis-full truncate text-[10px] font-semibold text-text-muted sm:basis-auto sm:text-right">
            {t("stories.backendNotice")}
          </p>
        </div>

        {initialState === "loading" ? (
          <StoriesLoadingState />
        ) : initialState === "error" ? (
          <StoriesErrorState />
        ) : (
          <div className="relative min-w-0 max-w-full">
            <ul className="flex max-w-full snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain scroll-px-3 px-3 pb-3 pt-2 [scrollbar-width:none] sm:scroll-px-4 sm:gap-3 sm:px-4 sm:pb-4 [&::-webkit-scrollbar]:hidden">
              <li className="w-[72px] shrink-0 snap-start sm:w-[78px]">
                <button
                  aria-label={t("stories.createStoryAria")}
                  className="group flex min-h-[104px] w-full flex-col items-center gap-1.5 rounded-2xl px-1 py-1 text-center"
                  type="button"
                  onClick={requestStoryCreation}
                >
                  <span className="relative grid size-[62px] place-items-center rounded-full border-2 border-dashed border-primary/45 bg-[#F3F0E9] text-primary transition-colors group-hover:bg-[#EAF1E9] sm:size-[68px]">
                    <Sparkles aria-hidden="true" className="size-6" strokeWidth={1.6} />
                    <span className="absolute -bottom-0.5 -right-0.5 grid size-6 place-items-center rounded-full border-2 border-[#FFFCF7] bg-primary text-white">
                      <Plus aria-hidden="true" className="size-3.5" strokeWidth={3} />
                    </span>
                  </span>
                  <span className="w-full truncate text-[11px] font-extrabold text-text-primary sm:text-xs">
                    {t("stories.createYourStory")}
                  </span>
                </button>
              </li>

              {groups.map((group, groupIndex) => {
                const thumbnail = group.stories[0];
                const storyCountLabel = tPlural("stories.storyCount", group.stories.length);

                return (
                  <li className="w-[72px] shrink-0 snap-start sm:w-[78px]" key={group.id}>
                    <button
                      aria-label={t("stories.openGroupAria", { owner: group.ownerName, count: storyCountLabel })}
                      className="group flex min-h-[104px] w-full flex-col items-center gap-1.5 rounded-2xl px-1 py-1 text-center"
                      type="button"
                      onClick={(event) => openGroup(groupIndex, event.currentTarget)}
                    >
                      <span className="relative block size-[62px] overflow-hidden rounded-full border-[3px] border-[#347A48] bg-[#EAF1E9] p-[2px] shadow-[0_4px_14px_rgba(24,75,52,0.12)] transition-transform group-hover:scale-[1.03] sm:size-[68px]">
                        <span className="relative grid size-full overflow-hidden rounded-full bg-[#DCE8DC] text-primary">
                          {thumbnail?.image ? (
                            <Image
                              alt=""
                              aria-hidden="true"
                              className="object-cover"
                              fill
                              sizes="68px"
                              src={thumbnail.image}
                            />
                          ) : (
                            <ImageOff aria-hidden="true" className="m-auto size-5" />
                          )}
                        </span>
                      </span>
                      <span className="w-full truncate text-[11px] font-bold text-text-primary sm:text-xs">
                        {group.ownerName}
                      </span>
                    </button>
                  </li>
                );
              })}

              {initialState === "empty" ? (
                <li className="flex min-h-[104px] min-w-[190px] snap-start items-center px-2 text-xs font-semibold leading-5 text-text-muted">
                  {t("stories.emptyExamples")}
                </li>
              ) : null}
            </ul>
            {(groups.length > 3 || initialState === "empty") ? (
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-9 bg-gradient-to-l from-[#FFFCF7] to-transparent" />
            ) : null}
          </div>
        )}
      </Card>

      {creationNoticeVisible ? (
        <div className="relative mt-2">
          <BackendPendingAlert
            compact
            title={t("stories.creationPendingTitle")}
            description={t("stories.creationPendingDescription")}
          />
          <button
            aria-label={t("stories.dismissCreationNotice")}
            className="absolute right-2 top-2 grid size-11 place-items-center rounded-full text-primary transition-colors hover:bg-black/5"
            type="button"
            onClick={() => setCreationNoticeVisible(false)}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      ) : null}

      {position && activeGroup ? (
        <StoryViewer
          group={activeGroup}
          hasPrevious={Boolean(getPreviousStoryPosition(groups, position))}
          storyIndex={position.storyIndex}
          triggerRef={viewerTriggerRef}
          onClose={closeViewer}
          onNext={stepNext}
          onPrevious={stepPrevious}
        />
      ) : null}
      {authModal}
    </section>
  );
}

function StoriesLoadingState() {
  const { t } = useTranslations();

  return (
    <div aria-busy="true" aria-label={t("stories.loadingAriaLabel")} className="flex gap-3 overflow-hidden px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
      <LoaderCircle aria-hidden="true" className="sr-only animate-spin" />
      {[0, 1, 2, 3, 4].map((item) => (
        <span className="w-[72px] shrink-0" key={item}>
          <span className="skeleton-shimmer mx-auto block size-[62px] rounded-full sm:size-[68px]" />
          <span className="skeleton-shimmer mx-auto mt-2 block h-2.5 w-14 rounded-full" />
        </span>
      ))}
    </div>
  );
}

function StoriesErrorState() {
  const { t } = useTranslations();

  return (
    <div className="flex min-h-[96px] items-center gap-3 px-4 pb-4 pt-2" role="status">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#C96D4A1f] text-[#A95539]">
        <AlertTriangle aria-hidden="true" className="size-5" />
      </span>
      <div>
        <p className="text-sm font-extrabold text-text-primary">{t("stories.errorTitle")}</p>
        <p className="mt-1 text-xs leading-5 text-text-muted">{t("stories.errorDescription")}</p>
      </div>
    </div>
  );
}
