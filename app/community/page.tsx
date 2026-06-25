import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SectionHeader } from "@/components/ui/card";
import { communityPosts } from "@/data/community";
import { PostCard } from "@/features/community/post-card";

export default function CommunityPage() {
  return (
    <>
      <Navbar />
      <main className="page-shell py-12">
        <SectionHeader
          eyebrow="Comunidad"
          title="Lo que se está moviendo en los pueblos"
          description="Un feed mock de avisos, propuestas y conversaciones locales."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {communityPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
