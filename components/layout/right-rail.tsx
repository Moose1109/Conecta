import { Card } from "@/components/ui/card";
import { ActivityCard } from "@/features/activities/activity-card";
import { VillageCard } from "@/features/villages/village-card";
import type { Activity, Village } from "@/lib/types";

export function RightRail({
  activities = [],
  villages = [],
}: {
  activities?: Activity[];
  villages?: Village[];
}) {
  return (
    <div className="sticky top-24 grid gap-6">
      {activities.length ? (
        <section>
          <h2 className="mb-3 text-lg font-black text-[#1F3D2B]">Recomendadas</h2>
          <div className="grid gap-4">
            {activities.slice(0, 2).map((activity) => (
              <ActivityCard key={activity.id} activity={activity} compact />
            ))}
          </div>
        </section>
      ) : null}
      {villages.length ? (
        <section>
          <h2 className="mb-3 text-lg font-black text-[#1F3D2B]">Pueblos populares</h2>
          <div className="grid gap-4">
            {villages.slice(0, 2).map((village) => (
              <VillageCard key={village.id} village={village} compact />
            ))}
          </div>
        </section>
      ) : null}
      <Card className="p-4">
        <p className="text-sm font-black text-[#1F3D2B]">Acciones de demo</p>
        <p className="mt-2 text-sm leading-6 text-[#1E1E1E]/62">
          Puedes probar likes, guardados, inscripciones y seguimientos con estado
          local para sentir el flujo social.
        </p>
      </Card>
    </div>
  );
}
