import { connection } from "next/server";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SocialPostCard } from "@/components/social/social-post-card";
import { StatsCard } from "@/components/social/stats-card";
import { Card, SectionHeader } from "@/components/ui/card";
import { ActivityCard } from "@/features/activities/activity-card";
import { ProfileSummary } from "@/features/auth/profile-summary";
import { getActivities } from "@/lib/api/activities.service";
import { getCommunityPosts } from "@/lib/api/community.service";

export default async function ProfilePage() {
  await connection();

  const [activities, communityPosts] = await Promise.all([
    getActivities(),
    getCommunityPosts(),
  ]);
  const joinedActivities = activities.slice(0, 2);
  const userPosts = communityPosts.slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="page-shell py-6 md:py-8">
        <ProfileSummary />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <StatsCard label="Actividades" value={activities.length} />
          <StatsCard label="Publicaciones" value={communityPosts.length} />
          <StatsCard label="Pueblos seguidos" value="-" />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section>
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {["Publicaciones", "Actividades", "Pueblos"].map((tab, index) => (
                <button
                  key={tab}
                  className={
                    index === 0
                      ? "min-h-10 rounded-full bg-[#3A7D44] px-4 text-sm font-black text-white"
                      : "min-h-10 rounded-full border border-[#1F3D2B18] bg-white/80 px-4 text-sm font-black text-[#1F3D2B]"
                  }
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>
            <SectionHeader title="Publicaciones" />
            <div className="grid gap-5">
              {userPosts.map((post) => (
                <SocialPostCard key={post.id} post={post} />
              ))}
            </div>
            <Card className="mt-5 p-5">
              <h2 className="text-xl font-black text-[#1F3D2B]">Actividad reciente</h2>
              <div className="mt-4 grid gap-3 text-sm font-bold text-[#1F3D2B]/70">
                <p>Comentó una publicación sobre rutas familiares.</p>
                <p>Guardó una actividad de gastronomía local.</p>
                <p>Empezó a seguir un pueblo destacado.</p>
              </div>
            </Card>
          </section>
          <aside className="grid content-start gap-8">
            <section>
              <SectionHeader title="Actividades inscritas" />
              <div className="grid gap-5">
                {joinedActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </section>
            <Card className="p-5">
              <h2 className="text-xl font-black text-[#1F3D2B]">Pueblo favorito</h2>
              <p className="mt-3 text-sm leading-6 text-[#1E1E1E]/68">
                Se mostrará aquí cuando el backend exponga o actualice el pueblo favorito del usuario.
              </p>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
