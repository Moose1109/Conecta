import Image from "next/image";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SocialPostCard } from "@/components/social/social-post-card";
import { StatsCard } from "@/components/social/stats-card";
import { UserAvatar } from "@/components/social/user-avatar";
import { Badge, Card, SectionHeader } from "@/components/ui/card";
import { ActivityCard } from "@/features/activities/activity-card";
import { VillageCard } from "@/features/villages/village-card";
import { getActivities } from "@/lib/api/activities.service";
import { getCurrentUserMock } from "@/lib/api/auth.service";
import { getCommunityPosts } from "@/lib/api/community.service";
import { getVillageById } from "@/lib/api/villages.service";

export default function ProfilePage() {
  const user = getCurrentUserMock();
  const favoriteVillage = getVillageById(user.favoriteVillageId);
  const joinedActivities = getActivities().slice(0, 2);
  const userPosts = getCommunityPosts().slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="page-shell py-8">
        <Card className="overflow-hidden">
          <div className="relative h-48 md:h-64">
            <Image
              src={user.banner}
              alt={`Banner de ${user.name}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F3D2B]/78 to-transparent" />
          </div>
          <div className="px-5 pb-6 md:px-8">
            <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <UserAvatar
                  name={user.name}
                  initials={user.avatar}
                  className="size-24 text-3xl"
                />
                <div className="pb-2">
                  <h1 className="text-3xl font-black text-[#1F3D2B]">{user.name}</h1>
                  <p className="font-bold text-[#3A7D44]">{user.handle}</p>
                </div>
              </div>
              <button
                className="min-h-11 rounded-full bg-[#3A7D44] px-5 text-sm font-black text-white"
                type="button"
              >
                Editar perfil
              </button>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#1E1E1E]/68">
              {user.role} desde {user.location}. Le interesan{" "}
              {user.interests.join(", ").toLowerCase()} y los planes con raíz local.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <Badge key={interest}>{interest}</Badge>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <StatsCard label="Actividades" value={user.stats.activities} />
              <StatsCard label="Publicaciones" value={user.stats.posts} />
              <StatsCard label="Pueblos seguidos" value={user.stats.followedVillages} />
            </div>
          </div>
        </Card>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section>
            <SectionHeader title="Publicaciones" />
            <div className="grid gap-5">
              {userPosts.map((post) => (
                <SocialPostCard key={post.id} post={post} />
              ))}
            </div>
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
            {favoriteVillage ? (
              <section>
                <SectionHeader title="Pueblo favorito" />
                <VillageCard village={favoriteVillage} />
              </section>
            ) : null}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
