import { Suspense } from "react";
import { connection } from "next/server";
import { AuthLanding } from "@/features/auth/auth-landing";
import {
  LandingDiscovery,
  LandingDiscoveryLoading,
} from "@/features/explore/landing-discovery";
import { getActivitiesStrict } from "@/lib/api/activities.service";
import { getVillagesStrict } from "@/lib/api/villages.service";

export default function Home() {
  return (
    <AuthLanding
      discovery={
        <Suspense fallback={<LandingDiscoveryLoading />}>
          <LandingDiscoveryData />
        </Suspense>
      }
    />
  );
}

async function LandingDiscoveryData() {
  await connection();
  const todayParts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Madrid",
    year: "numeric",
  }).formatToParts(new Date());
  const today = ["year", "month", "day"]
    .map((part) => todayParts.find(({ type }) => type === part)?.value)
    .join("-");

  const [villagesResult, activitiesResult] = await Promise.allSettled([
    getVillagesStrict(undefined, { limit: 5 }),
    getActivitiesStrict(undefined, {
      dateFrom: today,
      limit: 5,
      status: "published",
    }),
  ]);
  const villagesUnavailable = villagesResult.status === "rejected";
  const activitiesUnavailable = activitiesResult.status === "rejected";
  const loadedVillages = villagesResult.status === "fulfilled" ? villagesResult.value : [];
  const loadedActivities = activitiesResult.status === "fulfilled" ? activitiesResult.value : [];

  if (process.env.NODE_ENV === "development") {
    if (villagesResult.status === "rejected") {
      console.warn("Unable to load public villages for the landing:", villagesResult.reason);
    }
    if (activitiesResult.status === "rejected") {
      console.warn("Unable to load public activities for the landing:", activitiesResult.reason);
    }
  }

  return (
    <LandingDiscovery
      activities={loadedActivities.filter((activity) => activity.dataSource === "persistent")}
      activitiesUnavailable={activitiesUnavailable}
      villages={loadedVillages.filter((village) => village.dataSource === "persistent")}
      villagesUnavailable={villagesUnavailable}
    />
  );
}
