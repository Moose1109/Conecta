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
    <div className="grid gap-5 xl:sticky xl:top-24">
      {activities.length ? (
        <section>
          <div className="mb-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3A7D44]">
              Recomendadas
            </p>
            <h2 className="mt-1 text-lg font-black text-[#1F3D2B]">
              Actividades para descubrir
            </h2>
          </div>
          <div className="grid gap-4">
            {activities.slice(0, 2).map((activity) => (
              <ActivityCard key={activity.id} activity={activity} compact />
            ))}
          </div>
        </section>
      ) : null}
      {villages.length ? (
        <section>
          <div className="mb-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3A7D44]">
              Pueblos
            </p>
            <h2 className="mt-1 text-lg font-black text-[#1F3D2B]">
              Lugares populares
            </h2>
          </div>
          <div className="grid gap-4">
            {villages.slice(0, 2).map((village) => (
              <VillageCard key={village.id} village={village} compact />
            ))}
          </div>
        </section>
      ) : null}
      <Card className="p-4">
        <p className="text-sm font-black text-[#1F3D2B]">Tu actividad social</p>
        <p className="mt-2 text-sm leading-6 text-[#1E1E1E]/62">
          Likes, guardados, inscripciones y seguimientos se guardan en tu cuenta
          cuando has iniciado sesión.
        </p>
      </Card>
    </div>
  );
}
