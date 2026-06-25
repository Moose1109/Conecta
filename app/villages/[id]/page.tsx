import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge, Card, SectionHeader } from "@/components/ui/card";
import { activities, getActivitiesByVillage } from "@/data/activities";
import { getVillageById, villages } from "@/data/villages";
import { ActivityCard } from "@/features/activities/activity-card";
import { formatPopulation } from "@/lib/utils";

export function generateStaticParams() {
  return villages.map((village) => ({ id: village.id }));
}

export default async function VillageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const village = getVillageById(id);

  if (!village) {
    notFound();
  }

  const relatedActivities = getActivitiesByVillage(village.id);

  return (
    <>
      <Navbar />
      <main>
        <section className="page-shell grid gap-8 py-12 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <Badge>{village.region}</Badge>
            <h1 className="mt-4 text-5xl font-black text-[#1F3D2B] md:text-6xl">
              {village.name}
            </h1>
            <p className="mt-5 text-xl leading-8 text-[#1E1E1E]/72">{village.tagline}</p>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#1E1E1E]/72">
              {village.description}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Card className="p-5">
                <p className="text-sm font-bold text-[#1E1E1E]/52">Provincia</p>
                <p className="mt-2 text-xl font-black text-[#1F3D2B]">{village.province}</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm font-bold text-[#1E1E1E]/52">Habitantes</p>
                <p className="mt-2 text-xl font-black text-[#1F3D2B]">
                  {formatPopulation(village.population)}
                </p>
              </Card>
              <Card className="p-5">
                <p className="text-sm font-bold text-[#1E1E1E]/52">Actividades</p>
                <p className="mt-2 text-xl font-black text-[#1F3D2B]">
                  {relatedActivities.length}
                </p>
              </Card>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-3xl">
            <Image
              src={village.image}
              alt={village.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
          </div>
        </section>

        <section className="page-shell py-10">
          <SectionHeader title="Señas del pueblo" />
          <div className="flex flex-wrap gap-3">
            {village.highlights.map((highlight) => (
              <Badge key={highlight}>{highlight}</Badge>
            ))}
          </div>
        </section>

        <section className="page-shell py-10">
          <SectionHeader
            title="Actividades relacionadas"
            description={
              relatedActivities.length
                ? "Planes conectados con este pueblo."
                : "Pronto habrá nuevas actividades para este pueblo."
            }
          />
          <div className="grid gap-6 md:grid-cols-3">
            {(relatedActivities.length ? relatedActivities : activities.slice(0, 3)).map(
              (activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ),
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
