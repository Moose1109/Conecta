import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getVillages } from "@/lib/api/villages.service";
import { VillageCard } from "@/features/villages/village-card";
import { VillageExplorer } from "@/features/villages/village-explorer";

export default function VillagesPage() {
  const villages = getVillages();

  return (
    <>
      <Navbar />
      <main className="page-shell py-12">
        <PageHeader
          eyebrow="Pueblos"
          title="Descubre lugares con vida propia"
          description="Una selección inicial de pueblos con patrimonio, paisaje y actividades comunitarias."
        />
        <section className="mb-10">
          <Card className="grid gap-5 overflow-hidden p-5 md:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#3A7D44]">
                Populares
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#1F3D2B]">
                Pueblos que están reuniendo comunidad
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#1E1E1E]/68">
                Sigue pueblos, descubre su muro y encuentra actividades relacionadas.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {villages.slice(0, 2).map((village) => (
                <VillageCard key={village.id} village={village} compact />
              ))}
            </div>
          </Card>
        </section>
        <VillageExplorer villages={villages} />
      </main>
      <Footer />
    </>
  );
}
