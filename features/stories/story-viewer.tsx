"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, MapPin, Sparkles, X } from "lucide-react";
import { useEffect, useRef, type KeyboardEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import { UserAvatar } from "@/components/social/user-avatar";
import { Badge } from "@/components/ui/card";
import { useModalDialog } from "@/components/ui/use-modal-dialog";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { type ConceptStoryGroup } from "@/features/stories/stories-concept-data";
import { TrustActionsMenu } from "@/features/trust/trust-actions-menu";

export function StoryViewer({
  group,
  hasPrevious,
  onClose,
  onNext,
  onPrevious,
  storyIndex,
  triggerRef,
}: {
  group: ConceptStoryGroup;
  hasPrevious: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  storyIndex: number;
  triggerRef: RefObject<HTMLElement | null>;
}) {
  const { t } = useTranslations();
  const dialogRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const story = group.stories[storyIndex];
  const ownerTypeLabel = t(`stories.ownerType.${group.ownerType}` as const);

  useModalDialog({ dialogRef, onClose, open: true, triggerRef });

  useEffect(() => {
    const portal = portalRef.current;
    if (!portal) return;

    const siblings = Array.from(document.body.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement && element !== portal,
    );
    const previous = siblings.map((element) => ({
      ariaHidden: element.getAttribute("aria-hidden"),
      element,
      inert: element.inert,
    }));

    siblings.forEach((element) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });

    return () => {
      previous.forEach(({ ariaHidden, element, inert }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
    };
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft" && hasPrevious) {
      event.preventDefault();
      onPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      onNext();
    }
  }

  if (!story || typeof document === "undefined") return null;

  const storyCountLabel = group.stories.length === 1
    ? t("stories.singleStoryLabel")
    : t("stories.storyPositionLabel", { position: storyIndex + 1, total: group.stories.length });

  return createPortal(
    <div
      ref={portalRef}
      className="fixed inset-0 z-[120] grid touch-pan-y place-items-center overflow-y-auto overscroll-contain bg-[#08110D]/88 p-0 backdrop-blur-sm sm:p-5"
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        aria-describedby={`story-caption-${story.id}`}
        aria-labelledby={`story-title-${story.id}`}
        aria-modal="true"
        className="flex h-[100dvh] w-full max-w-[680px] flex-col overflow-hidden bg-[#101713] text-white outline-none sm:h-[min(90dvh,800px)] sm:rounded-[28px] sm:border sm:border-white/15 sm:shadow-2xl"
        role="dialog"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <div className="shrink-0 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4 sm:pt-4">
          <div
            aria-label={t("stories.viewerGroupAriaLabel", { position: storyCountLabel, owner: group.ownerName })}
            className="grid auto-cols-fr grid-flow-col gap-1.5"
            role="group"
          >
            {group.stories.map((item, itemIndex) => (
              <span
                key={item.id}
                aria-hidden="true"
                className={`h-1 rounded-full ${itemIndex === storyIndex ? "bg-white" : itemIndex < storyIndex ? "bg-white/56" : "bg-white/24"}`}
              />
            ))}
          </div>

          <div className="mt-3 flex min-w-0 items-center gap-3">
            <UserAvatar
              className="size-10 bg-[#D7A63C] text-[#0E3325] ring-2 ring-white/15"
              initials={group.ownerInitials}
              name={`${group.ownerName} · ${ownerTypeLabel}`}
            />
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-extrabold" id={`story-title-${story.id}`}>
                {group.ownerName}
              </h2>
              <p className="mt-0.5 flex items-center gap-1 truncate text-xs font-semibold text-white/66">
                {group.villageName ? (
                  <>
                    <MapPin aria-hidden="true" className="size-3 shrink-0" />
                    <span className="truncate">{group.villageName}</span>
                    <span aria-hidden="true">·</span>
                  </>
                ) : null}
                <span className="truncate">{ownerTypeLabel}</span>
              </p>
            </div>
            <span className="hidden shrink-0 sm:inline-flex">
              <Badge className="bg-white/12 text-white">
                <Sparkles aria-hidden="true" className="mr-1 size-3" />
                {t("common.prototypeBadge")}
              </Badge>
            </span>
            <TrustActionsMenu
              blockTargetName={group.ownerType === "user" ? group.ownerName : undefined}
              className="shrink-0"
              contentLabel={t("stories.trustContentLabel", { owner: group.ownerName })}
              triggerAriaLabel={t("stories.trustMenuAriaLabel")}
              triggerClassName="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/18"
            />
            <button
              aria-label={t("stories.closeViewer")}
              className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/18"
              data-dialog-initial-focus
              type="button"
              onClick={onClose}
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden bg-[#1B241F]">
          {story.image ? (
            <Image
              alt={story.imageAlt}
              className="object-cover"
              fill
              sizes="(min-width: 640px) 680px, 100vw"
              src={story.image}
            />
          ) : (
            <div
              aria-label={story.imageAlt}
              className="grid h-full min-h-64 place-items-center bg-gradient-to-br from-[#1B3327] to-[#0E1712] text-center"
              role="img"
            >
              <span>
                <ImageOff aria-hidden="true" className="mx-auto size-14 text-white/46" strokeWidth={1.4} />
                <span className="mt-3 block text-sm font-bold text-white/68">{t("stories.imageUnavailable")}</span>
              </span>
            </div>
          )}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/76 via-transparent to-black/8" />

          <button
            aria-label={t("stories.previousStory")}
            className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/42 text-white backdrop-blur-sm transition-colors hover:bg-black/58 disabled:opacity-25 sm:left-4 sm:size-12"
            disabled={!hasPrevious}
            type="button"
            onClick={onPrevious}
          >
            <ChevronLeft aria-hidden="true" className="size-6" />
          </button>
          <button
            aria-label={t("stories.nextStory")}
            className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/42 text-white backdrop-blur-sm transition-colors hover:bg-black/58 sm:right-4 sm:size-12"
            type="button"
            onClick={onNext}
          >
            <ChevronRight aria-hidden="true" className="size-6" />
          </button>

          <div className="absolute inset-x-0 bottom-0 max-h-[42%] overflow-y-auto px-5 pb-5 pt-10 sm:px-7 sm:pb-7">
            <p className="text-sm font-medium leading-6 text-white sm:text-base" id={`story-caption-${story.id}`}>
              {story.caption}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-[#101713] px-4 pb-[max(0.8rem,env(safe-area-inset-bottom))] pt-3 text-xs font-semibold text-white/64">
          <span className="truncate">{storyCountLabel} · {group.ownerName}</span>
          <span className="shrink-0 text-right">{t("stories.backendNotice")}</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
