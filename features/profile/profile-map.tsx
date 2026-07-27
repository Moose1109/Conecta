import Link from "next/link";
import { ArrowUpRight, MapPin, Newspaper } from "lucide-react";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Card } from "@/components/ui/card";
import { VillageCard } from "@/features/villages/village-card";
import type { CommunityPost, Village } from "@/lib/types";

type RelatedPlace = {
  id?: string;
  key: string;
  name: string;
  postsCount: number;
};

function relatedPlaces(posts: CommunityPost[]) {
  const places = new Map<string, RelatedPlace>();

  for (const post of posts) {
    if (!post.villageId && !post.villageName) continue;

    const key = post.villageId || post.villageName?.toLocaleLowerCase("es") || "";
    const current = places.get(key);
    places.set(key, {
      id: post.villageId || current?.id,
      key,
      name: post.villageName || current?.name || "Pueblo relacionado",
      postsCount: (current?.postsCount ?? 0) + 1,
    });
  }

  return Array.from(places.values());
}

export function ProfileMap({
  followedVillages,
  posts,
  postsUnavailable,
  villagesUnavailable,
}: {
  followedVillages: Village[];
  posts: CommunityPost[];
  postsUnavailable: boolean;
  villagesUnavailable: boolean;
}) {
  const places = relatedPlaces(posts);

  return (
    <div className="grid gap-5">
      <BackendPendingAlert
        compact
        description="Este espacio reúne solo pueblos seguidos y pueblos asociados a tus publicaciones. Un mapa territorial completo necesita colecciones personales paginadas del backend; aquí no se muestran visitas, deseos ni geolocalización."
        title="Mi mapa está preparado con alcance limitado"
      />

      <section aria-labelledby="followed-villages-title">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Relación real</p>
            <h2 className="mt-1 text-xl font-extrabold text-[#0E3325]" id="followed-villages-title">
              Pueblos que sigo
            </h2>
          </div>
          <Link className="text-xs font-extrabold text-[#347A48]" href="/villages">
            Explorar pueblos
          </Link>
        </div>
        {villagesUnavailable ? (
          <MapDataUnavailable label="los pueblos que sigues" />
        ) : followedVillages.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {followedVillages.map((village) => (
              <VillageCard compact key={village.id} village={village} />
            ))}
          </div>
        ) : (
          <Card className="p-5 text-sm leading-6 text-[#687269]">
            No se han detectado pueblos seguidos en el catálogo disponible.
          </Card>
        )}
      </section>

      <section aria-labelledby="related-villages-title">
        <div className="mb-3">
          <p className="eyebrow">Contexto de tus publicaciones</p>
          <h2 className="mt-1 text-xl font-extrabold text-[#0E3325]" id="related-villages-title">
            Pueblos relacionados con mis publicaciones
          </h2>
        </div>
        {postsUnavailable ? (
          <MapDataUnavailable label="los pueblos de tus publicaciones" />
        ) : places.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {places.map((place) => {
              const content = (
                <>
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#D7A63C20] text-[#184B34]">
                    <MapPin aria-hidden="true" className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-extrabold text-[#18231D]">{place.name}</span>
                    <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#687269]">
                      <Newspaper aria-hidden="true" className="size-3.5" />
                      {place.postsCount} {place.postsCount === 1 ? "publicación" : "publicaciones"}
                    </span>
                  </span>
                  {place.id ? <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-[#347A48]" /> : null}
                </>
              );

              return place.id ? (
                <Link
                  className="flex min-h-20 items-center gap-3 rounded-[20px] border border-[#184B341a] bg-[#FFFCF7] p-4 shadow-[0_10px_32px_rgba(43,55,38,0.05)] transition-colors hover:bg-[#F7F2E8]"
                  href={`/villages/${place.id}`}
                  key={place.key}
                >
                  {content}
                </Link>
              ) : (
                <Card className="flex min-h-20 items-center gap-3 p-4" key={place.key}>
                  {content}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-5 text-sm leading-6 text-[#687269]">
            Tus publicaciones todavía no incluyen un pueblo identificable.
          </Card>
        )}
      </section>
    </div>
  );
}

function MapDataUnavailable({ label }: { label: string }) {
  return (
    <Card className="p-5 text-sm font-medium leading-6 text-[#687269]" role="status">
      No podemos cargar {label} ahora. Tus datos no se han borrado.
    </Card>
  );
}
