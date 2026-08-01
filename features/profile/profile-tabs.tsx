"use client";

import { type KeyboardEvent, type ReactNode, useRef, useState } from "react";
import {
  CalendarDays,
  Images,
  MapPin,
  MapPinned,
  Newspaper,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import { SocialPostCard } from "@/components/social/social-post-card";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { ActivityCard } from "@/features/activities/activity-card";
import { ProfileEmptyState } from "@/features/profile/profile-empty-state";
import { ProfileMap } from "@/features/profile/profile-map";
import { ProfilePhotoGrid } from "@/features/profile/profile-photo-grid";
import { VillageCard } from "@/features/villages/village-card";
import { cn } from "@/lib/utils";
import type { Activity, CommunityPost, Village } from "@/lib/types";

type TabId = "posts" | "photos" | "activities" | "villages" | "map";

type ProfileSourceState = {
  activities: boolean;
  posts: boolean;
  villages: boolean;
};

type ProfileTabsProps = {
  activities: Activity[];
  isLoading: boolean;
  limitedSources: ProfileSourceState;
  posts: CommunityPost[];
  unavailableSources: ProfileSourceState;
  villages: Village[];
};

function tabCount(count: number, unavailable: boolean, limited: boolean) {
  return unavailable || limited ? "—" : count;
}

export function ProfileTabs({
  activities,
  isLoading,
  limitedSources,
  posts,
  unavailableSources,
  villages,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("posts");
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    activities: null,
    map: null,
    photos: null,
    posts: null,
    villages: null,
  });
  const photoCount = posts.filter((post) => Boolean(post.image)).length;
  const tabs = [
    {
      count: tabCount(posts.length, unavailableSources.posts, limitedSources.posts),
      icon: Newspaper,
      id: "posts" as const,
      label: "Publicaciones",
    },
    {
      count: tabCount(photoCount, unavailableSources.posts, limitedSources.posts),
      icon: Images,
      id: "photos" as const,
      label: "Fotografías",
    },
    {
      count: tabCount(activities.length, unavailableSources.activities, limitedSources.activities),
      icon: CalendarDays,
      id: "activities" as const,
      label: "Actividades",
    },
    {
      count: tabCount(villages.length, unavailableSources.villages, limitedSources.villages),
      icon: MapPin,
      id: "villages" as const,
      label: "Pueblos",
    },
    {
      count: undefined,
      icon: MapPinned,
      id: "map" as const,
      label: "Mi mapa",
    },
  ];

  function selectTab(id: TabId) {
    setActiveTab(id);
    tabRefs.current[id]?.focus();
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, id: TabId) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    const currentIndex = tabs.findIndex((tab) => tab.id === id);
    let nextIndex = currentIndex;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % tabs.length;
    selectTab(tabs[nextIndex].id);
  }

  return (
    <section>
      <Card aria-label="Contenido del perfil" aria-orientation="horizontal" className="mb-5 flex max-w-full snap-x gap-1 overflow-x-auto rounded-[18px] p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist">
        {tabs.map(({ count, icon: Icon, id, label }) => (
          <button
            key={id}
            ref={(element) => {
              tabRefs.current[id] = element;
            }}
            aria-controls={`profile-panel-${id}`}
            aria-selected={activeTab === id}
            className={cn(
              "relative inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-xl px-3.5 text-sm font-bold transition-colors",
              activeTab === id ? "bg-[#184B340a] text-[#184B34]" : "text-[#687269] hover:bg-[#184B3408] hover:text-[#184B34]",
            )}
            id={`profile-tab-${id}`}
            role="tab"
            tabIndex={activeTab === id ? 0 : -1}
            type="button"
            onClick={() => setActiveTab(id)}
            onKeyDown={(event) => handleTabKeyDown(event, id)}
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
            {count !== undefined ? (
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold shadow-sm">{count}</span>
            ) : null}
            {activeTab === id ? <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-[#347A48]" /> : null}
          </button>
        ))}
      </Card>

      {activeTab === "posts" ? (
        <ProfilePanel id="posts">
          {isLoading ? (
            <LoadingState label="Cargando tus publicaciones" variant="post" />
          ) : unavailableSources.posts ? (
            <UnavailableProfileData label="tus publicaciones" />
          ) : (
            <div className="grid gap-4">
              {limitedSources.posts ? <CollectionLimitNotice label="publicaciones" /> : null}
              {posts.length ? (
                <div className="grid gap-5">{posts.map((post) => <SocialPostCard key={post.id} post={post} />)}</div>
              ) : (
                <ProfileEmptyState actionHref="/community#publicar" actionLabel="Crear publicación" title="Todavía no has publicado nada" description="Comparte una recomendación, una ruta o una noticia de tu pueblo." />
              )}
            </div>
          )}
        </ProfilePanel>
      ) : null}

      {activeTab === "photos" ? (
        <ProfilePanel id="photos">
          {isLoading ? (
            <LoadingState label="Cargando tus fotografías" variant="grid" />
          ) : unavailableSources.posts ? (
            <UnavailableProfileData label="las fotografías de tus publicaciones" />
          ) : (
            <div className="grid gap-4">
              {limitedSources.posts ? <CollectionLimitNotice label="fotografías derivadas de publicaciones" /> : null}
              <ProfilePhotoGrid posts={posts} />
            </div>
          )}
        </ProfilePanel>
      ) : null}

      {activeTab === "activities" ? (
        <ProfilePanel id="activities">
          {isLoading ? (
            <LoadingState label="Cargando tus inscripciones" variant="grid" />
          ) : unavailableSources.activities ? (
            <UnavailableProfileData label="tus inscripciones en actividades" />
          ) : (
            <div className="grid gap-4">
              <BackendPendingAlert
                compact
                description="Las tarjetas siguientes tienen isJoined=true dentro del catálogo actual de hasta 100 actividades. Son inscripciones detectadas: no representan actividades organizadas, guardadas, asistidas ni un historial completo."
                title="Inscripciones detectadas en el catálogo"
              />
              {activities.length ? (
                <div className="grid gap-5 md:grid-cols-2">{activities.map((activity) => <ActivityCard key={activity.id} activity={activity} />)}</div>
              ) : (
                <ProfileEmptyState actionHref="/activities" actionLabel="Explorar actividades" title="No se han detectado inscripciones" description="Explora actividades locales; esta vista solo puede reconocer inscripciones presentes en el catálogo actual." />
              )}
            </div>
          )}
        </ProfilePanel>
      ) : null}

      {activeTab === "villages" ? (
        <ProfilePanel id="villages">
          {isLoading ? (
            <LoadingState label="Cargando los pueblos que sigues" variant="grid" />
          ) : unavailableSources.villages ? (
            <UnavailableProfileData label="los pueblos que sigues" />
          ) : (
            <div className="grid gap-4">
              <BackendPendingAlert
                compact
                description="Las tarjetas siguientes tienen isFollowing=true dentro del catálogo actual de hasta 100 pueblos. El backend aún no ofrece la colección personal completa y paginada."
                title="Pueblos seguidos detectados en el catálogo"
              />
              {villages.length ? (
                <div className="grid gap-5 md:grid-cols-2">{villages.map((village) => <VillageCard key={village.id} village={village} />)}</div>
              ) : (
                <ProfileEmptyState actionHref="/villages" actionLabel="Descubrir pueblos" title="No se han detectado pueblos seguidos" description="Sigue pueblos para encontrarlos aquí cuando formen parte del catálogo disponible." />
              )}
            </div>
          )}
        </ProfilePanel>
      ) : null}

      {activeTab === "map" ? (
        <ProfilePanel id="map">
          {isLoading ? (
            <LoadingState label="Preparando Mi mapa" variant="grid" />
          ) : (
            <div className="grid gap-4">
              {limitedSources.posts || limitedSources.villages ? (
                <CollectionLimitNotice label="relaciones territoriales" />
              ) : null}
              <ProfileMap
                followedVillages={villages}
                posts={posts}
                postsUnavailable={unavailableSources.posts}
                villagesUnavailable={unavailableSources.villages}
              />
            </div>
          )}
        </ProfilePanel>
      ) : null}
    </section>
  );
}

function ProfilePanel({ children, id }: { children: ReactNode; id: TabId }) {
  return (
    <div aria-labelledby={`profile-tab-${id}`} id={`profile-panel-${id}`} role="tabpanel" tabIndex={0}>
      {children}
    </div>
  );
}

function CollectionLimitNotice({ label }: { label: string }) {
  return (
    <Card className="border-[#D7A63C38] bg-[#FFF8E8] px-4 py-3 text-xs font-semibold leading-5 text-[#6C531B]" role="status">
      Esta vista usa hasta 100 {label} devueltas por el contrato actual; puede ser una colección parcial.
    </Card>
  );
}

function UnavailableProfileData({ label }: { label: string }) {
  return (
    <Card className="grid min-h-64 place-items-center p-7 text-center">
      <div className="max-w-sm">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#C96D4A18] text-[#A95539]">
          <WifiOff aria-hidden="true" className="size-5" />
        </span>
        <h2 className="mt-4 text-lg font-extrabold text-[#18231D]">No podemos mostrar {label} ahora</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-[#687269]">
          La conexión con el servicio ha fallado. Tus datos no se han borrado.
        </p>
        <button
          className="mx-auto mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#184B34] px-5 text-sm font-extrabold text-white transition-colors hover:bg-[#0E3325] focus:outline-none focus:ring-4 focus:ring-[#347A4830]"
          onClick={() => window.location.reload()}
          type="button"
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          Reintentar
        </button>
      </div>
    </Card>
  );
}
