import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Card, SectionHeader } from "@/components/ui/card";
import { activities } from "@/data/activities";
import { communityPosts } from "@/data/community";
import { villages } from "@/data/villages";
import { ActivityCard } from "@/features/activities/activity-card";
import { PostCard } from "@/features/community/post-card";
import { VillageCard } from "@/features/villages/village-card";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="page-shell py-12">
        <SectionHeader
          eyebrow="Dashboard"
          title="Hola, Ana"
          description="Resumen mock de tu actividad en ConectaPueblos."
        />
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Actividades inscritas" value="3" />
          <Metric label="Pueblos guardados" value="5" />
          <Metric label="Posts leídos" value="12" />
          <Metric label="Rol" value="Vecina" />
        </div>

        <section className="mt-12">
          <SectionHeader title="Próximas actividades" />
          <div className="grid gap-6 md:grid-cols-3">
            {activities.slice(0, 3).map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionHeader title="Pueblos recomendados" />
            <div className="grid gap-6 sm:grid-cols-2">
              {villages.slice(0, 2).map((village) => (
                <VillageCard key={village.id} village={village} />
              ))}
            </div>
          </div>
          <div>
            <SectionHeader title="Publicaciones recientes" />
            <div className="grid gap-5">
              {communityPosts.slice(0, 2).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-bold text-[#1E1E1E]/52">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#1F3D2B]">{value}</p>
    </Card>
  );
}
