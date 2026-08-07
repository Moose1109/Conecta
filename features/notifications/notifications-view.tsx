"use client";

import Link from "next/link";
import { type KeyboardEvent, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { cn } from "@/lib/utils";

type Filter = "all" | "unread";

export function NotificationsView() {
  const { t } = useTranslations();
  const [filter, setFilter] = useState<Filter>("all");
  const tabRefs = useRef<Record<Filter, HTMLButtonElement | null>>({
    all: null,
    unread: null,
  });

  function selectFilter(nextFilter: Filter) {
    setFilter(nextFilter);
    tabRefs.current[nextFilter]?.focus();
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    if (event.key === "Home") return selectFilter("all");
    if (event.key === "End") return selectFilter("unread");
    selectFilter(filter === "all" ? "unread" : "all");
  }

  return (
    <>
      <PageHeader eyebrow={t("notifications.bell.eyebrow")} title={t("navigation.notifications.label")} description={t("notifications.page.description")} />
      <BackendPendingAlert actionHref="/community" actionLabel={t("common.backendPending.actionLabel")} compact className="mb-5" description={t("notifications.page.pendingDescription")} />
      <Card className="overflow-hidden">
        <div className="border-b border-[#184B3414] p-4 sm:p-5">
          <div aria-label={t("notifications.filters.label")} className="grid max-w-md grid-cols-2 gap-1 rounded-[15px] bg-[#F1EFE8] p-1" role="tablist">
            {(["all", "unread"] as const).map((id) => (
              <button
                key={id}
                ref={(element) => {
                  tabRefs.current[id] = element;
                }}
                aria-controls="notifications-page-panel"
                aria-selected={filter === id}
                className={cn("min-h-11 rounded-xl text-sm font-extrabold transition-colors", filter === id ? "bg-white text-[#184B34] shadow-sm" : "text-[#677168] hover:text-[#184B34]")}
                id={`notifications-page-tab-${id}`}
                role="tab"
                tabIndex={filter === id ? 0 : -1}
                type="button"
                onClick={() => setFilter(id)}
                onKeyDown={handleTabKeyDown}
              >
                {id === "all" ? t("notifications.filters.all") : t("notifications.filters.unread")}
              </button>
            ))}
          </div>
        </div>
        <div
          aria-labelledby={`notifications-page-tab-${filter}`}
          className="grid min-h-[380px] place-items-center p-6 text-center sm:p-10"
          id="notifications-page-panel"
          role="tabpanel"
          tabIndex={0}
        >
          <div>
            <span className="mx-auto grid size-16 place-items-center rounded-[22px] bg-[#78947D1f] text-[#184B34]">
              {filter === "unread" ? <CheckCheck aria-hidden="true" className="size-7" /> : <Bell aria-hidden="true" className="size-7" />}
            </span>
            <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.025em] text-[#18231D]">{filter === "unread" ? t("notifications.page.unreadEmptyTitle") : t("notifications.empty.allTitle")}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#677168]">{t("notifications.page.emptyDescription")}</p>
            <Link className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#184B34] px-5 text-sm font-extrabold text-white hover:bg-[#0E3325]" href="/community">{t("common.backendPending.actionLabel")}</Link>
          </div>
        </div>
      </Card>
    </>
  );
}
