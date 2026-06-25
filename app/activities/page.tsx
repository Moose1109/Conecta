import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge, SectionHeader } from "@/components/ui/card";
import { activities, activityCategories } from "@/data/activities";
import { ActivityCard } from "@/features/activities/activity-card";

export default function ActivitiesPage() {
  return (
    <>
      <Navbar />
      <main className="page-shell py-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Actividades"
            title="Agenda local para participar"
            description="Filtros visuales por categoría. En esta fase son mock y no alteran el listado."
          />
          <Link
            href="/activities/create"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#3A7D44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2f6738]"
          >
            Crear actividad
          </Link>
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          {activityCategories.map((category) => (
            <Badge key={category}>{category}</Badge>
          ))}
        </div>
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
