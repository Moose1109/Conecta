import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Card, SectionHeader } from "@/components/ui/card";
import { CategoryPill } from "@/components/social/category-pill";
import {
  getActivities,
  getActivityCategories,
} from "@/lib/api/activities.service";
import { ActivityCard } from "@/features/activities/activity-card";

export default function ActivitiesPage() {
  const activities = getActivities();
  const activityCategories = getActivityCategories();
  const featured = activities.slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="page-shell py-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Actividades"
            title="Descubre planes cerca de la comunidad"
            description="Eventos destacados, categorías visuales y actividades locales listas para inscripción mock."
          />
          <Link
            href="/activities/create"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#3A7D44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2f6738]"
          >
            Crear actividad
          </Link>
        </div>
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          <CategoryPill category="Todas" active />
          {activityCategories.map((category) => (
            <CategoryPill key={category} category={category} />
          ))}
        </div>

        <section className="mb-10 grid gap-5 lg:grid-cols-2">
          {featured.map((activity) => (
            <Card key={activity.id} className="overflow-hidden bg-[#1F3D2B] text-white">
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
              </div>
            </Card>
          ))}
        </section>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
