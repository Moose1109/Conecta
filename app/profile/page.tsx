import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Card, SectionHeader } from "@/components/ui/card";
import { activities } from "@/data/activities";
import { villages } from "@/data/villages";
import { ActivityCard } from "@/features/activities/activity-card";
import { VillageCard } from "@/features/villages/village-card";

export default function ProfilePage() {
  const favoriteVillage = villages[0];
  const joinedActivities = activities.slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="page-shell py-12">
        <SectionHeader
          eyebrow="Perfil"
          title="Ana Morales"
          description="Perfil mock preparado para sustituirse por datos reales de usuario."
        />
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <Card className="p-6">
            <div className="grid size-20 place-items-center rounded-3xl bg-[#D9A441] text-3xl font-black text-[#1F3D2B]">
              AM
            </div>
            <h2 className="mt-5 text-2xl font-black text-[#1F3D2B]">Ana Morales</h2>
            <p className="mt-1 text-sm font-bold text-[#3A7D44]">Vecina colaboradora</p>
            <div className="mt-6 grid gap-3 text-sm">
              <ProfileRow label="Email" value="ana@pueblo.es" />
              <ProfileRow label="Ubicación" value="Barcelona" />
              <ProfileRow label="Intereses" value="Naturaleza, mercados y cultura" />
            </div>
          </Card>
          <div className="grid gap-10">
            <section>
              <SectionHeader title="Actividades inscritas" />
              <div className="grid gap-6 md:grid-cols-2">
                {joinedActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </section>
            <section>
              <SectionHeader title="Pueblo favorito" />
              <VillageCard village={favoriteVillage} />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F3F4F6] p-4">
      <p className="font-bold text-[#1E1E1E]/52">{label}</p>
      <p className="mt-1 font-black text-[#1F3D2B]">{value}</p>
    </div>
  );
}
