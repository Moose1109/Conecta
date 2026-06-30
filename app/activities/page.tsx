import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { JoinActivityButton } from "@/components/social/join-activity-button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ActivityExplorer } from "@/features/activities/activity-explorer";
import {
  getActivities,
  getActivityCategories,
} from "@/lib/api/activities.service";
import { getVillages } from "@/lib/api/villages.service";

export default async function ActivitiesPage() {
  const [activities, villages] = await Promise.all([getActivities(), getVillages()]);
  const activityCategories = getActivityCategories();
  const featured = activities.slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="page-shell py-8 md:py-12">
        <PageHeader
          eyebrow="Actividades"
          title="Descubre planes cerca de la comunidad"
          description="Eventos destacados, categorías visuales y actividades locales listas para descubrir y apuntarte."
          action={
            <Link
              href="/activities/create"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#3A7D44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2f6738]"
            >
              Crear actividad
            </Link>
          }
        />
        <section className="mb-10 grid gap-5 lg:grid-cols-2">
          {featured.map((activity) => (
            <Card key={activity.slug} className="overflow-hidden bg-[#1F3D2B] text-white">
              <div className="p-6">
                <p className="text-sm font-black text-[#D9A441]">Destacada</p>
                <h2 className="mt-2 text-3xl font-black">{activity.title}</h2>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/72">
                  {activity.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-black">
                  <span className="rounded-full bg-white/12 px-3 py-1">
                    {activity.category}
                  </span>
                  <span className="rounded-full bg-white/12 px-3 py-1">
                    {activity.spots} plazas
                  </span>
                </div>
                <div className="mt-5">
                  <JoinActivityButton storageKey={activity.slug} />
                </div>
              </div>
            </Card>
          ))}
        </section>

        <ActivityExplorer
          activities={activities}
          categories={activityCategories}
          villages={villages}
        />
      </main>
      <Footer />
    </>
  );
}
