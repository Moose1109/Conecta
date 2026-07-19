import { connection } from "next/server";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { Card, SectionHeader } from "@/components/ui/card";
import { CreateActivityForm } from "@/features/activities/create-activity-form";
import { AuthGate } from "@/features/auth/auth-gate";
import { getActivityCategories } from "@/lib/api/activities.service";
import { getVillages } from "@/lib/api/villages.service";

export default async function CreateActivityPage() {
  await connection();

  const activityCategories = getActivityCategories();
  const villages = await getVillages();

  return (
    <AuthenticatedShell>
      <div className="mx-auto max-w-4xl">
        <AuthGate message="Para crear una actividad necesitas iniciar sesión.">
          <SectionHeader
            eyebrow="Nueva actividad"
            title="Crea una propuesta para tu pueblo"
            description="Diseña una actividad local con la información que necesitará la comunidad para sumarse."
          />
          <Card className="p-6 md:p-8">
            <CreateActivityForm categories={activityCategories} villages={villages} />
          </Card>
        </AuthGate>
      </div>
    </AuthenticatedShell>
  );
}
