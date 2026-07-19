import { connection } from "next/server";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { RightRail } from "@/components/layout/right-rail";
import { Card } from "@/components/ui/card";
import { CommunityFeed } from "@/features/community/community-feed";
import { getActivities } from "@/lib/api/activities.service";
import { getCommunityPosts } from "@/lib/api/community.service";
import { getVillages } from "@/lib/api/villages.service";

export default async function CommunityPage() {
  await connection();

  const [posts, villages, activities] = await Promise.all([
    getCommunityPosts(),
    getVillages(),
    getActivities(),
  ]);

  return (
    <AuthenticatedShell
      right={<RightRail activities={activities} villages={villages} />}
      variant="three-column"
    >
      <div className="mb-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3A7D44]">
          Comunidad
        </p>
        <h1 className="mt-1 text-2xl font-black text-[#1F3D2B]">
          Tu plaza digital
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#1E1E1E]/62">
          Publicaciones, avisos y momentos compartidos por vecinos y visitantes.
        </p>
      </div>
      <CommunityFeed posts={posts} user={{ name: "Usuario", avatar: "CP" }} villages={villages} />
      <div className="mt-5 grid gap-5">
        <Card className="p-4">
          <p className="text-sm font-black text-[#1F3D2B]">Tendencias locales</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Huertos", "Mercados", "Rutas", "Fiestas"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#D9A44124] px-3 py-1 text-xs font-black text-[#1F3D2B]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </AuthenticatedShell>
  );
}
