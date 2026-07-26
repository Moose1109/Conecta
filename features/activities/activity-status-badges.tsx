import { CalendarCheck2, CircleSlash2, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Activity } from "@/lib/types";

function activityTimestamp(activity: Activity) {
  const candidate = activity.endsAt ?? activity.startsAt ?? `${activity.date}T${activity.time}`;
  const timestamp = Date.parse(candidate);

  return Number.isFinite(timestamp) ? timestamp : undefined;
}

export function activityDisplayState(activity: Activity) {
  const timestamp = activityTimestamp(activity);
  const finished = timestamp !== undefined && timestamp < Date.now();
  const full = activity.spotsLeft === 0;

  return { finished, full };
}

export function ActivityStatusBadges({
  activity,
  compact = false,
  className,
}: {
  activity: Activity;
  compact?: boolean;
  className?: string;
}) {
  const { finished, full } = activityDisplayState(activity);
  const states = finished
    ? [
        { icon: CircleSlash2, label: "Finalizada", tone: "bg-mineral text-white" },
        ...(full
          ? [{ icon: UsersRound, label: "Completo", tone: "bg-accent text-white" }]
          : []),
      ]
    : full
      ? [{ icon: UsersRound, label: "Completo", tone: "bg-accent text-white" }]
      : [{ icon: CalendarCheck2, label: "Próxima", tone: "bg-primary text-primary-foreground" }];

  return (
    <span
      aria-label={`Estado: ${states.map((state) => state.label).join(", ")}`}
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
