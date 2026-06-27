import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Card, SectionHeader } from "@/components/ui/card";
import { PostComposer } from "@/components/social/post-composer";
import { SocialPostCard } from "@/components/social/social-post-card";
import { StatsCard } from "@/components/social/stats-card";
import { getCurrentUserMock } from "@/lib/api/auth.service";
import { getCommunityPosts } from "@/lib/api/community.service";
import { getVillages } from "@/lib/api/villages.service";

export default function CommunityPage() {
  const posts = getCommunityPosts();
  const user = getCurrentUserMock();
  const villages = getVillages();

  return (
    <>
      <Navbar />
      <main className="page-shell py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
          <aside className="hidden lg:block">
            <Card className="sticky top-24 p-4">
              <p className="text-sm font-black text-[#1F3D2B]">Explorar</p>
              <div className="mt-4 grid gap-2 text-sm font-bold text-[#1F3D2B]/72">
                <span>Feed local</span>
                <span>Fotos recientes</span>
                <span>Eventos cerca</span>
                <span>Pueblos seguidos</span>
              </div>
            </Card>
          </aside>

          <section className="min-w-0">
            <SectionHeader
              eyebrow="Comunidad"
              title="Tu plaza digital"
              description="Publicaciones, avisos y momentos compartidos por vecinos y visitantes."
            />
            <div className="grid gap-5">
              <PostComposer user={user} />
              {posts.map((post) => (
                <SocialPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>

          <aside className="hidden xl:block">
            <div className="sticky top-24 grid gap-4">
              <StatsCard label="Pueblos activos" value={villages.length} />
              <StatsCard label="Posts esta semana" value={posts.length} />
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
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
