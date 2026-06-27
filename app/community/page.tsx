import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { RightRail } from "@/components/layout/right-rail";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SocialLayout } from "@/components/layout/social-layout";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { CommunityFeed } from "@/features/community/community-feed";
import { getActivities } from "@/lib/api/activities.service";
import { getCurrentUserMock } from "@/lib/api/auth.service";
import { getCommunityPosts } from "@/lib/api/community.service";
import { getVillages } from "@/lib/api/villages.service";

export default function CommunityPage() {
  const posts = getCommunityPosts();
  const user = getCurrentUserMock();
  const villages = getVillages();
  const activities = getActivities();

  return (
    <>
      <Navbar />
      <main className="page-shell py-6 md:py-8">
        <SocialLayout
          left={<SidebarNav />}
          right={<RightRail activities={activities} villages={villages} />}
        >
          <PageHeader
            eyebrow="Comunidad"
            title="Tu plaza digital"
            description="Publicaciones, avisos y momentos compartidos por vecinos y visitantes."
          />
          <CommunityFeed posts={posts} user={user} villages={villages} />
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
        </SocialLayout>
      </main>
      <Footer />
    </>
  );
}
