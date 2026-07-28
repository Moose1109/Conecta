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

  const [villagesResult, activitiesResult] = await Promise.allSettled([
    getVillagesStrict(),
    getActivitiesStrict(),
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
      activitiesLimited={loadedActivities.length >= 100}
      activitiesUnavailable={activitiesUnavailable}
      villages={loadedVillages.filter((village) => village.dataSource === "persistent")}
      villagesLimited={loadedVillages.length >= 100}
      villagesUnavailable={villagesUnavailable}
    />
  );
}
