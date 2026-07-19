import { ActivityCard } from "@/features/activities/activity-card";
import { VillageCard } from "@/features/villages/village-card";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Activity, AuthUser, Village } from "@/lib/types";

export function RecommendedActivitiesCard({
  activities,
}: {
  activities: Activity[];
}) {
  const recommendedActivities = activities
    .filter((activity) => activity.isJoined !== true)
    .slice(0, 2);

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-base font-black text-[#1F3D2B]">Actividades recomendadas</h2>
        <p className="mt-1 text-xs font-bold text-[#1E1E1E]/54">
          Sugerencias del catálogo, no actividades inscritas.
        </p>
      </div>
      {recommendedActivities.length ? (
        <div className="grid gap-4">
          {recommendedActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} compact />
          ))}
        </div>
      ) : (
        <Card className="p-5">
          <p className="text-sm font-black text-[#1F3D2B]">
            No hay actividades recomendadas disponibles.
          </p>
          <p className="mt-2 text-sm leading-6 text-[#1E1E1E]/62">
            Cuando el backend devuelva actividades publicadas, aparecerán aquí como sugerencias.
          </p>
        </Card>
      )}
    </section>
  );
}

export function RecommendedVillagesCard({ villages }: { villages: Village[] }) {
  const suggestedVillage =
    villages.find((village) => village.isFollowing !== true) ?? villages[0];

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-base font-black text-[#1F3D2B]">Pueblo recomendado</h2>
        <p className="mt-1 text-xs font-bold text-[#1E1E1E]/54">
          Una sugerencia para descubrir, no un pueblo seguido.
        </p>
      </div>
      {suggestedVillage ? (
        <VillageCard village={suggestedVillage} compact />
      ) : (
        <Card className="p-5">
          <p className="text-sm font-black text-[#1F3D2B]">No hay pueblos para recomendar.</p>
          <p className="mt-2 text-sm leading-6 text-[#1E1E1E]/62">
            El listado aparecerá cuando el backend devuelva pueblos reales.
          </p>
        </Card>
      )}
    </section>
  );
}

export function FavoriteVillageCard({
  user,
  villages,
}: {
  user?: AuthUser;
  villages: Village[];
}) {
  const favoriteVillage = user?.favoriteVillageId
    ? villages.find((village) => village.id === user.favoriteVillageId)
    : undefined;

  return (
    <Card className="p-5">
      <h2 className="text-base font-black text-[#1F3D2B]">Pueblo favorito</h2>
      {favoriteVillage ? (
        <p className="mt-3 text-sm leading-6 text-[#1E1E1E]/68">
          {favoriteVillage.name} aparece como tu pueblo favorito.
        </p>
      ) : (
        <p className="mt-3 text-sm leading-6 text-[#1E1E1E]/68">
          Tu pueblo favorito aparecerá aquí cuando el backend permita guardarlo.
        </p>
      )}
    </Card>
  );
}

export function ProfileOnboardingCard() {
  return (
    <Card className="p-5">
      <h2 className="text-base font-black text-[#1F3D2B]">Empieza en ConectaPueblos</h2>
      <div className="mt-4 grid gap-3 text-sm font-bold text-[#1F3D2B]/72">
        <p>Sigue tu primer pueblo.</p>
        <p>Apúntate a una actividad local.</p>
        <p>Publica una recomendación en comunidad.</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <LinkButton href="/community" variant="secondary" className="min-h-10 px-4">
          Crear publicación
        </LinkButton>
        <LinkButton href="/activities" variant="ghost" className="min-h-10 px-4">
          Ver actividades
        </LinkButton>
      </div>
    </Card>
  );
}

export function ProfileLeftExtras({
  activities,
  user,
  villages,
}: {
  activities: Activity[];
  user?: AuthUser;
  villages: Village[];
}) {
  return (
    <div className="grid content-start gap-5">
      <ProfileOnboardingCard />
      <RecommendedActivitiesCard activities={activities} />
      <RecommendedVillagesCard villages={villages} />
      <FavoriteVillageCard user={user} villages={villages} />
    </div>
  );
}
