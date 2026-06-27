import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { RightRail } from "@/components/layout/right-rail";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SocialLayout } from "@/components/layout/social-layout";
import { PostComposer } from "@/components/social/post-composer";
import { SocialPostCard } from "@/components/social/social-post-card";
import { StatsCard } from "@/components/social/stats-card";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ActivityCard } from "@/features/activities/activity-card";
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
        <PageHeader
          eyebrow="Inicio"
          title={`Hola, ${user.name.split(" ")[0]}`}
          description="Tu home social para descubrir planes, publicaciones y pueblos que se están moviendo."
        />
        <SocialLayout
          left={
            <div className="grid gap-4">
              <SidebarNav />
              <Card className="p-5">
                <p className="text-sm font-black text-[#1F3D2B]">Accesos rápidos</p>
                <div className="mt-4 grid gap-2 text-sm font-bold text-[#1F3D2B]/72">
                  <span>Crear publicación</span>
                  <span>Buscar actividad</span>
                  <span>Explorar pueblos</span>
                  <span>Editar perfil</span>
                </div>
              </Card>
            </div>
          }
          right={<RightRail activities={activities} villages={villages} />}
        >
          <div className="mb-5 grid grid-cols-3 gap-3">
            <StatsCard label="Actividades" value={user.stats.activities} />
            <StatsCard label="Posts" value={user.stats.posts} />
            <StatsCard label="Pueblos" value={user.stats.followedVillages} />
          </div>
          <PostComposer user={user} />
          <section className="mt-5 grid gap-5">
            {communityPosts.slice(0, 3).map((post) => (
              <SocialPostCard key={post.id} post={post} />
            ))}
          </section>
          <section className="mt-8">
            <h2 className="mb-4 text-2xl font-black text-[#1F3D2B]">
              Próximas actividades
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              {activities.slice(0, 2).map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </section>
        </SocialLayout>
      </main>
      <Footer />
    </>
  );
}
