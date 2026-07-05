import { connection } from "next/server";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { RightRail } from "@/components/layout/right-rail";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SocialLayout } from "@/components/layout/social-layout";
import { PostComposer } from "@/components/social/post-composer";
import { SocialPostCard } from "@/components/social/social-post-card";
import { StatsCard } from "@/components/social/stats-card";
import { Card } from "@/components/ui/card";
import { ActivityCard } from "@/features/activities/activity-card";
import { AuthGate } from "@/features/auth/auth-gate";
import { DashboardHeader } from "@/features/auth/dashboard-header";
import { getActivities } from "@/lib/api/activities.service";
import { getCommunityPosts } from "@/lib/api/community.service";
import { getVillages } from "@/lib/api/villages.service";

export default async function DashboardPage() {
  await connection();

  const [activities, communityPosts, villages] = await Promise.all([
    getActivities(),
    getCommunityPosts(),
    getVillages(),
  ]);

  return (
    <>
      <Navbar />
      <main className="page-shell py-6 md:py-8">
        <AuthGate message="Para acceder a tu dashboard necesitas iniciar sesión.">
          <DashboardHeader fallbackName="" />
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
            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              <StatsCard label="Actividades disponibles" value={activities.length} />
              <StatsCard label="Publicaciones" value={communityPosts.length} />
              <StatsCard label="Pueblos activos" value={villages.length} />
            </div>
            <PostComposer user={{ name: "Usuario", avatar: "CP" }} villages={villages} />
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
        </AuthGate>
      </main>
      <Footer />
    </>
  );
}
