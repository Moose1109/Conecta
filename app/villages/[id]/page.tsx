import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge, Card, SectionHeader } from "@/components/ui/card";
import { FollowButton } from "@/components/social/follow-button";
import { SocialPostCard } from "@/components/social/social-post-card";
import { StatsCard } from "@/components/social/stats-card";
import {
  getActivities,
  getActivitiesByVillageId,
} from "@/lib/api/activities.service";
import { getPostsByVillageId } from "@/lib/api/community.service";
import { getVillageById, getVillages } from "@/lib/api/villages.service";
import { ActivityCard } from "@/features/activities/activity-card";
import { formatPopulation } from "@/lib/utils";

export function generateStaticParams() {
  return getVillages().map((village) => ({ id: village.id }));
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

  const relatedActivities = getActivitiesByVillageId(village.id);
  const villagePosts = getPostsByVillageId(village.id);

  return (
    <>
      <Navbar />
      <main>
        <section className="page-shell py-8">
          <Card className="overflow-hidden">
            <div className="relative min-h-[260px]">
              <Image
                src={village.image}
                alt={village.name}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F3D2B]/82 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
                <Badge className="bg-white/18 text-white">{village.region}</Badge>
                <h1 className="mt-4 text-5xl font-black md:text-7xl">{village.name}</h1>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-white/80">
                  {village.tagline}
                </p>
                <div className="mt-5">
                  <FollowButton />
                </div>
              </div>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-4">
              <StatsCard label="Habitantes" value={formatPopulation(village.population)} />
              <StatsCard label="Actividades" value={relatedActivities.length} />
              <StatsCard label="Posts" value={villagePosts.length} />
              <StatsCard label="Provincia" value={village.province} />
            </div>
          </Card>
        </section>

        <section className="page-shell py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <SectionHeader title="Muro del pueblo" description={village.description} />
              <div className="grid gap-5">
                {villagePosts.map((post) => (
                  <SocialPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
            <aside className="grid content-start gap-5">
              <Card className="p-5">
                <h2 className="text-xl font-black text-[#1F3D2B]">Señas del pueblo</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {village.highlights.map((highlight) => (
                    <Badge key={highlight}>{highlight}</Badge>
                  ))}
                </div>
              </Card>
            </aside>
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
            {(relatedActivities.length ? relatedActivities : getActivities().slice(0, 3)).map(
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
