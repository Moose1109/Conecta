"use client";

import { CalendarCheck2, CircleSlash2, UsersRound } from "lucide-react";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { activityDisplayState } from "@/features/activities/activity-status";
import { cn } from "@/lib/utils";
import type { Activity } from "@/lib/types";

export function ActivityStatusBadges({
  activity,
  compact = false,
  className,
}: {
  activity: Activity;
  compact?: boolean;
  className?: string;
}) {
  const { t } = useTranslations();
  const { finished, full } = activityDisplayState(activity);
  const states = finished
    ? [
        { icon: CircleSlash2, label: t("activities.status.finished"), tone: "bg-mineral text-white" },
        ...(full
          ? [{ icon: UsersRound, label: t("activities.status.full"), tone: "bg-accent text-white" }]
          : []),
      ]
    : full
      ? [{ icon: UsersRound, label: t("activities.status.full"), tone: "bg-accent text-white" }]
      : [{ icon: CalendarCheck2, label: t("activities.status.upcoming"), tone: "bg-primary text-primary-foreground" }];

  return (
    <span
      aria-label={t("activities.status.ariaLabel", { states: states.map((state) => state.label).join(", ") })}
      className={cn("flex flex-wrap justify-end gap-1.5", className)}
    >
      {states.map(({ icon: Icon, label, tone }, index) => (
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex items-center gap-1 rounded-full font-extrabold shadow-sm",
            compact ? "px-2 py-1 text-[0.6rem]" : "px-2.5 py-1 text-[0.65rem]",
            tone,
            finished && full && index === 1 && "opacity-90",
          )}
          key={label}
        >
          <Icon aria-hidden="true" className={compact ? "size-3" : "size-3.5"} />
          {label}
        </span>
      ))}
    </span>
  );
}
