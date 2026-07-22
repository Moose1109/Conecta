import { Suspense } from "react";
import type { Metadata } from "next";
import { CalendarSearch, Plus } from "lucide-react";
import { connection } from "next/server";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { ActivitiesHero } from "@/features/activities/activities-hero";
import { ActivityExplorer } from "@/features/activities/activity-explorer";
import { ActivitiesPageSkeleton } from "@/features/activities/activities-loading";
import { ProtectedLinkButton } from "@/features/auth/protected-link-button";
import {
  getActivitiesStrict,
  getActivityCategories,
} from "@/lib/api/activities.service";
import { getVillagesStrict } from "@/lib/api/villages.service";

export const metadata: Metadata = { title: "Actividades" };

export default async function ActivitiesPage() {
  await connection();

  return (
    <AuthenticatedShell>
      <Suspense fallback={<ActivitiesPageSkeleton />}>
        <ActivitiesContent />
      </Suspense>
    </AuthenticatedShell>
  );
}

async function ActivitiesContent() {
  const [activitiesResult, villagesResult] = await Promise.allSettled([
    getActivitiesStrict(),
    getVillagesStrict(),
  ]);
  const activitiesUnavailable = activitiesResult.status === "rejected";
  const villagesUnavailable = villagesResult.status === "rejected";
  const activities = activitiesResult.status === "fulfilled" ? activitiesResult.value : [];
  const villages = villagesResult.status === "fulfilled" ? villagesResult.value : [];

  if (process.env.NODE_ENV === "development") {
    if (activitiesResult.status === "rejected") {
      console.warn("Unable to load the public activity list:", activitiesResult.reason);
    }
    if (villagesResult.status === "rejected") {
      console.warn("Unable to load villages for activity filters:", villagesResult.reason);
    }
  }
  const activityCategories = getActivityCategories();
  const featuredActivity = activities[0];

  return (
    <>
      <ActivitiesHero
        activity={featuredActivity}
        action={
          <>
            <ProtectedLinkButton
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#D7A63C] px-5 py-2.5 text-sm font-extrabold text-[#18231D] shadow-[0_10px_26px_rgba(215,166,60,0.22)] transition hover:-translate-y-0.5 hover:bg-[#E1B550] focus:outline-none focus:ring-4 focus:ring-white/20"
              href="/activities/create"
              message="Para crear una actividad necesitas iniciar sesión."
            >
              <Plus aria-hidden="true" className="size-4" />
              Publicar actividad
            </ProtectedLinkButton>
            <a
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/24 bg-white/9 px-5 py-2.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/15"
              href="#agenda"
            >
              <CalendarSearch aria-hidden="true" className="size-4" />
              Explorar agenda
            </a>
          </>
        }
      />
      <div className="min-w-0" id="agenda">
        <ActivityExplorer
          activities={activities}
          activitiesUnavailable={activitiesUnavailable}
          categories={activityCategories}
          villages={villages}
          villagesUnavailable={villagesUnavailable}
        />
      </div>
    </>
  );
}
