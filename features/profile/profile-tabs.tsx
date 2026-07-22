"use client";

import { type KeyboardEvent, useRef, useState } from "react";
import { CalendarDays, MapPin, Newspaper, RefreshCw, WifiOff } from "lucide-react";
import { ActivityCard } from "@/features/activities/activity-card";
import { VillageCard } from "@/features/villages/village-card";
import { ProfileEmptyState } from "@/features/profile/profile-empty-state";
import { SocialPostCard } from "@/components/social/social-post-card";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Activity, CommunityPost, Village } from "@/lib/types";

type TabId = "posts" | "activities" | "villages";

type ProfileUnavailableSources = Record<TabId, boolean>;

type ProfileTabsProps = {
  activities: Activity[];
  posts: CommunityPost[];
  unavailableSources: ProfileUnavailableSources;
  villages: Village[];
};

export function ProfileTabs({
  activities,
  posts,
  unavailableSources,
  villages,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("posts");
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    activities: null,
    posts: null,
    villages: null,
  });
  const tabs = [
    {
      count: unavailableSources.posts ? "—" : posts.length,
      icon: Newspaper,
      id: "posts" as const,
      label: "Publicaciones",
    },
    {
      count: unavailableSources.activities ? "—" : activities.length,
      icon: CalendarDays,
      id: "activities" as const,
      label: "Actividades",
    },
    {
      count: unavailableSources.villages ? "—" : villages.length,
      icon: MapPin,
      id: "villages" as const,
      label: "Pueblos",
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
      <Card aria-label="Contenido del perfil" aria-orientation="horizontal" className="mb-5 flex gap-1 overflow-x-auto rounded-[18px] p-1.5" role="tablist">
        {tabs.map(({ count, icon: Icon, id, label }) => (
          <button
            key={id}
            ref={(element) => {
              tabRefs.current[id] = element;
            }}
            aria-controls={`profile-panel-${id}`}
            aria-selected={activeTab === id}
            className={cn(
              "relative inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors",
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
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold shadow-sm">{count}</span>
            {activeTab === id ? <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-[#347A48]" /> : null}
          </button>
        ))}
      </Card>

      {activeTab === "posts" ? (
        <div aria-labelledby="profile-tab-posts" id="profile-panel-posts" role="tabpanel" tabIndex={0}>
          {unavailableSources.posts ? (
            <UnavailableProfileData label="tus publicaciones" />
          ) : posts.length ? (
            <div className="grid gap-5">{posts.map((post) => <SocialPostCard key={post.id} post={post} />)}</div>
          ) : (
            <ProfileEmptyState actionHref="/community#publicar" actionLabel="Crear publicación" title="Todavía no has publicado nada" description="Comparte una recomendación, una ruta o una noticia de tu pueblo." />
          )}
        </div>
      ) : null}

      {activeTab === "activities" ? (
        <div aria-labelledby="profile-tab-activities" id="profile-panel-activities" role="tabpanel" tabIndex={0}>
          {unavailableSources.activities ? (
            <UnavailableProfileData label="tus actividades" />
          ) : activities.length ? (
            <div className="grid gap-5 md:grid-cols-2">{activities.map((activity) => <ActivityCard key={activity.id} activity={activity} />)}</div>
          ) : (
            <ProfileEmptyState actionHref="/activities" actionLabel="Explorar actividades" title="Aún no te has apuntado a actividades" description="Explora actividades locales y prepara tu próximo plan." />
          )}
        </div>
      ) : null}

      {activeTab === "villages" ? (
        <div aria-labelledby="profile-tab-villages" id="profile-panel-villages" role="tabpanel" tabIndex={0}>
          {unavailableSources.villages ? (
            <UnavailableProfileData label="los pueblos que sigues" />
          ) : villages.length ? (
            <div className="grid gap-5 md:grid-cols-2">{villages.map((village) => <VillageCard key={village.id} village={village} />)}</div>
          ) : (
            <ProfileEmptyState actionHref="/villages" actionLabel="Descubrir pueblos" title="Aún no sigues ningún pueblo" description="Sigue pueblos para recibir novedades, actividades y publicaciones locales." />
          )}
        </div>
      ) : null}
    </section>
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
