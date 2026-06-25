import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SectionHeader } from "@/components/ui/card";
import { villages } from "@/data/villages";
import { VillageCard } from "@/features/villages/village-card";

export default function VillagesPage() {
  return (
    <>
      <Navbar />
      <main className="page-shell py-12">
        <SectionHeader
          eyebrow="Pueblos"
          title="Descubre lugares con vida propia"
          description="Una selección inicial de pueblos con patrimonio, paisaje y actividades comunitarias."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {villages.map((village) => (
            <VillageCard key={village.id} village={village} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
