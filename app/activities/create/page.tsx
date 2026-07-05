import { connection } from "next/server";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Card, SectionHeader } from "@/components/ui/card";
import { CreateActivityForm } from "@/features/activities/create-activity-form";
import { getActivityCategories } from "@/lib/api/activities.service";
import { getVillages } from "@/lib/api/villages.service";

export default async function CreateActivityPage() {
  await connection();

  const activityCategories = getActivityCategories();
  const villages = await getVillages();

  return (
    <>
      <Navbar />
      <main className="page-shell max-w-4xl py-12">
        <SectionHeader
          eyebrow="Nueva actividad"
          title="Crea una propuesta para tu pueblo"
          description="Diseña una actividad local con la información que necesitará la comunidad para sumarse."
        />
        <Card className="p-6 md:p-8">
          <CreateActivityForm categories={activityCategories} villages={villages} />
        </Card>
      </main>
      <Footer />
    </>
  );
}
