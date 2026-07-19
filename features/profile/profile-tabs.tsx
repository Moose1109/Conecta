"use client";

import { useState } from "react";
import { ActivityCard } from "@/features/activities/activity-card";
import { VillageCard } from "@/features/villages/village-card";
import { ProfileEmptyState } from "@/features/profile/profile-empty-state";
import { SocialPostCard } from "@/components/social/social-post-card";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Activity, CommunityPost, Village } from "@/lib/types";

type TabId = "posts" | "activities" | "villages";

export function ProfileTabs({
  activities,
  posts,
  villages,
}: {
  activities: Activity[];
  posts: CommunityPost[];
  villages: Village[];
}) {
  const [activeTab, setActiveTab] = useState<TabId>("posts");
  const tabs: Array<{ count: number; id: TabId; label: string }> = [
    { count: posts.length, id: "posts", label: "Publicaciones" },
    { count: activities.length, id: "activities", label: "Actividades" },
    { count: villages.length, id: "villages", label: "Pueblos" },
  ];

  return (
    <section>
      <Card className="mb-5 flex gap-2 overflow-x-auto p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "min-h-10 whitespace-nowrap rounded-full px-4 text-sm font-black transition-colors focus:outline-none focus:ring-4 focus:ring-[#3A7D4420]",
              activeTab === tab.id
                ? "bg-[#3A7D44] text-white"
                : "text-[#1F3D2B]/72 hover:bg-[#1F3D2B0d]",
            )}
            type="button"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="ml-2 rounded-full bg-current/10 px-2 py-0.5 text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </Card>

      {activeTab === "posts" ? (
        posts.length ? (
          <div className="grid gap-5">
            {posts.map((post) => (
              <SocialPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <ProfileEmptyState
            actionHref="/community"
            actionLabel="Crear publicación"
            title="Todavía no has publicado nada"
            description="Comparte una recomendación, una ruta o una actividad de tu pueblo."
          />
        )
      ) : null}

      {activeTab === "activities" ? (
        activities.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <ProfileEmptyState
            actionHref="/activities"
            actionLabel="Explorar actividades"
            title="Aún no te has apuntado a actividades"
            description="Explora actividades locales y guarda tus próximos planes."
          />
        )
      ) : null}

      {activeTab === "villages" ? (
        villages.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {villages.map((village) => (
              <VillageCard key={village.id} village={village} />
            ))}
          </div>
        ) : (
          <ProfileEmptyState
            actionHref="/villages"
            actionLabel="Descubrir pueblos"
            title="Aún no sigues ningún pueblo"
            description="Sigue pueblos para recibir novedades, actividades y publicaciones locales."
          />
        )
      ) : null}
    </section>
  );
}
