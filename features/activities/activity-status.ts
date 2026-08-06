import type { Activity } from "@/lib/types";

// Pure, server-safe: no "use client", no hooks, no window/document. Callable
// from both Server and Client Components, unlike the translated badges in
// `activity-status-badges.tsx` (which is a Client Component).
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
