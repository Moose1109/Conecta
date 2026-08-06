"use client";

import Link from "next/link";
import { Bell, CheckCheck, X } from "lucide-react";
import { type KeyboardEvent, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { useModalDialog } from "@/components/ui/use-modal-dialog";
import { cn } from "@/lib/utils";

type NotificationFilter = "all" | "unread";
const panelId = "notifications-popover";

export function NotificationBell() {
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const allTabRef = useRef<HTMLButtonElement>(null);
  const unreadTabRef = useRef<HTMLButtonElement>(null);

  const closePanel = useCallback(() => setOpen(false), []);

  useModalDialog({
    dialogRef: panelRef,
    onClose: closePanel,
    open,
    triggerRef: buttonRef,
  });

  function selectFilter(nextFilter: NotificationFilter) {
    setFilter(nextFilter);
    (nextFilter === "all" ? allTabRef : unreadTabRef).current?.focus();
  }

  function handleFilterKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    if (event.key === "Home") return selectFilter("all");
    if (event.key === "End") return selectFilter("unread");
    selectFilter(filter === "all" ? "unread" : "all");
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        aria-controls={panelId}
        aria-expanded={open}
        aria-label={open ? t("notifications.bell.close") : t("notifications.bell.open")}
        className={cn("relative grid size-11 place-items-center rounded-full border border-[#184B3414] bg-white/80 text-[#184B34] transition-colors hover:bg-white", open && "bg-white shadow-sm")}
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <Bell aria-hidden="true" className="size-5" strokeWidth={1.8} />
      </button>

      {open && typeof document !== "undefined" ? createPortal(
        <div className="fixed inset-0 z-[100] isolate">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#0E3325]/34 backdrop-blur-[2px] md:bg-[#0E3325]/16"
            onPointerDown={closePanel}
          />
          <div
            ref={panelRef}
            aria-labelledby="notifications-panel-title"
            aria-modal="true"
            className="absolute inset-x-0 bottom-0 z-10 flex max-h-[calc(78dvh-env(safe-area-inset-bottom))] touch-pan-y flex-col overflow-hidden overscroll-contain rounded-t-[30px] border border-[#184B3417] bg-[#F7F2E8] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-[#18231D] shadow-[0_-24px_80px_rgba(14,51,37,0.22)] outline-none md:bottom-auto md:left-auto md:right-32 md:top-[84px] md:w-[410px] md:rounded-[26px] md:bg-[#FFFCF7] md:pb-0 md:shadow-[0_28px_90px_rgba(14,51,37,0.2)] lg:right-36"
            id={panelId}
            role="dialog"
            tabIndex={-1}
          >
            <div className="border-b border-[#184B3414] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div><p className="eyebrow">{t("notifications.bell.eyebrow")}</p><h2 className="mt-1 text-xl font-extrabold" id="notifications-panel-title">{t("navigation.notifications.label")}</h2></div>
                <div className="flex items-center gap-1">
                  <Link className="inline-flex min-h-11 items-center rounded-full px-3 text-xs font-extrabold text-[#347A48] hover:bg-[#184B340a]" href="/notifications" onClick={closePanel}>{t("notifications.bell.seeAll")}</Link>
                  <button aria-label={t("notifications.bell.closePanel")} className="grid size-11 place-items-center rounded-full bg-[#184B340a] text-[#184B34]" data-dialog-initial-focus type="button" onClick={closePanel}><X aria-hidden="true" className="size-5" /></button>
                </div>
              </div>
              <div aria-label={t("notifications.filters.label")} aria-orientation="horizontal" className="mt-4 grid grid-cols-2 gap-1 rounded-[15px] bg-[#F1EFE8] p-1" role="tablist">
                {(["all", "unread"] as const).map((id) => (
                  <button
                    key={id}
                    ref={id === "all" ? allTabRef : unreadTabRef}
                    aria-controls="notifications-filter-panel"
                    aria-selected={filter === id}
                    className={cn("min-h-11 rounded-xl text-sm font-extrabold", filter === id ? "bg-white text-[#184B34] shadow-sm" : "text-[#687269]")}
                    id={`notifications-filter-${id}`}
                    role="tab"
                    tabIndex={filter === id ? 0 : -1}
                    type="button"
                    onClick={() => setFilter(id)}
                    onKeyDown={handleFilterKeyDown}
                  >
                    {id === "all" ? t("notifications.filters.all") : t("notifications.filters.unread")}
                  </button>
                ))}
              </div>
            </div>
            <div aria-labelledby={`notifications-filter-${filter}`} className="min-h-0 flex-1 overflow-y-auto p-5 text-center" id="notifications-filter-panel" role="tabpanel" tabIndex={0}>
              <div className="grid min-h-56 place-items-center">
                <div>
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#78947D1f] text-[#184B34]">{filter === "unread" ? <CheckCheck aria-hidden="true" className="size-6" /> : <Bell aria-hidden="true" className="size-6" />}</span>
                <h3 className="mt-4 text-lg font-extrabold">{filter === "unread" ? t("notifications.empty.unreadTitle") : t("notifications.empty.allTitle")}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#687269]">{t("notifications.empty.description")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      ) : null}
    </div>
  );
}
