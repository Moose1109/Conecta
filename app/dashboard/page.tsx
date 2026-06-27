import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PostComposer } from "@/components/social/post-composer";
import { SocialPostCard } from "@/components/social/social-post-card";
import { StatsCard } from "@/components/social/stats-card";
import { Card, SectionHeader } from "@/components/ui/card";
import { ActivityCard } from "@/features/activities/activity-card";
import { VillageCard } from "@/features/villages/village-card";
import { getActivities } from "@/lib/api/activities.service";
import { getCurrentUserMock } from "@/lib/api/auth.service";
import { getCommunityPosts } from "@/lib/api/community.service";
import { getVillages } from "@/lib/api/villages.service";

export default function DashboardPage() {
  const user = getCurrentUserMock();
  const activities = getActivities();
  const communityPosts = getCommunityPosts();
  const villages = getVillages();

  return (
    <>
      <Navbar />
      <main className="page-shell py-8">
        <SectionHeader
          eyebrow="Dashboard"
          title={`Hola, ${user.name.split(" ")[0]}`}
          description="Tu inicio social: actividad cercana, comunidad y pueblos recomendados."
        />
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
          <aside className="grid content-start gap-4">
            <div className="grid grid-cols-3 gap-3 xl:grid-cols-1">
              <StatsCard label="Actividades" value={user.stats.activities} />
              <StatsCard label="Posts" value={user.stats.posts} />
              <StatsCard label="Pueblos" value={user.stats.followedVillages} />
            </div>
            <Card className="p-5">
              <p className="text-sm font-black text-[#1F3D2B]">Accesos rápidos</p>
              <div className="mt-4 grid gap-2 text-sm font-bold text-[#1F3D2B]/72">
                <span>Crear publicación</span>
                <span>Buscar actividad</span>
                <span>Explorar pueblos</span>
                <span>Editar perfil</span>
              </div>
            </Card>
          </aside>

          <section className="min-w-0">
            <PostComposer user={user} />
            <div className="mt-5 grid gap-5">
              {communityPosts.slice(0, 3).map((post) => (
                <SocialPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>

          <aside className="grid content-start gap-8">
            <section>
              <SectionHeader title="Próximas" />
              <div className="grid gap-5">
                {activities.slice(0, 2).map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </section>
            <section>
              <SectionHeader title="Pueblos recomendados" />
              <div className="grid gap-5">
                {villages.slice(0, 2).map((village) => (
                  <VillageCard key={village.id} village={village} />
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
