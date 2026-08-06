"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { localeIntlTag } from "@/lib/i18n/config";

function reducedMotionRequested() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AccessibleCarousel({
  children,
  itemCount,
  label,
}: {
  children: ReactNode;
  itemCount: number;
  label: string;
}) {
  const { t, locale } = useTranslations();
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(itemCount <= 1);

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    setAtStart(track.scrollLeft <= 2);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
  }, []);

  useEffect(() => {
    updateEdges();
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    return () => observer.disconnect();
  }, [itemCount, updateEdges]);

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    const firstItem = track?.querySelector<HTMLElement>("li");
    if (!track || !firstItem) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      behavior: reducedMotionRequested() ? "auto" : "smooth",
      left: direction * (firstItem.getBoundingClientRect().width + gap),
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    move(event.key === "ArrowLeft" ? -1 : 1);
  }

  return (
    <div aria-label={label} aria-roledescription={t("common.carousel.roleDescription")} className="mt-5 min-w-0" role="region">
      <div className="mb-3 flex items-center justify-between gap-3 px-2 sm:px-0">
        <p className="text-xs font-semibold text-text-muted">
          {t("common.carousel.instructions", { count: itemCount })}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            aria-label={t("common.carousel.previousAria", { label: label.toLocaleLowerCase(localeIntlTag[locale]) })}
            className="grid size-11 place-items-center rounded-full border border-[#184B3424] bg-white/88 text-primary transition-colors hover:bg-white disabled:opacity-40"
            disabled={atStart}
            type="button"
            onClick={() => move(-1)}
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            aria-label={t("common.carousel.nextAria", { label: label.toLocaleLowerCase(localeIntlTag[locale]) })}
            className="grid size-11 place-items-center rounded-full border border-[#184B3424] bg-white/88 text-primary transition-colors hover:bg-white disabled:opacity-40"
            disabled={atEnd}
            type="button"
            onClick={() => move(1)}
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
      <ul
        ref={trackRef}
        aria-label={label}
        className="flex w-full min-w-0 max-w-full snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain scroll-px-2 px-2 pb-3 [scrollbar-width:none] sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onScroll={updateEdges}
      >
        {children}
      </ul>
    </div>
  );
}
