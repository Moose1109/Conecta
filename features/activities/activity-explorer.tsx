"use client";

import { useMemo, useState } from "react";
import { CategoryPill } from "@/components/social/category-pill";
import { EmptyState } from "@/components/social/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { ActivityCard } from "@/features/activities/activity-card";
import type { Activity, ActivityCategory, Village } from "@/lib/types";

export function ActivityExplorer({
  activities,
  categories,
  villages,
}: {
  activities: Activity[];
  categories: ActivityCategory[];
  villages: Village[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ActivityCategory | "Todas">("Todas");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return activities.filter((activity) => {
      const village = villages.find((item) => item.id === activity.villageId);
      const matchesCategory = category === "Todas" || activity.category === category;
      const searchable = [
        activity.title,
        activity.description,
        activity.organizer,
        activity.category,
        village?.name,
        village?.province,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [activities, category, query, villages]);

  return (
    <>
      <div className="mb-5">
        <SearchInput
          label="Buscar actividades"
          placeholder="Buscar por actividad, pueblo o categoría"
          value={query}
          onChange={setQuery}
        />
      </div>
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        <CategoryPill
          category="Todas"
          active={category === "Todas"}
          onClick={() => setCategory("Todas")}
        />
        {categories.map((item) => (
          <CategoryPill
            key={item}
            category={item}
            active={category === item}
            onClick={() => setCategory(item)}
          />
        ))}
      </div>
      {filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No hay actividades con esos filtros"
          description="Prueba con otro pueblo, categoría o palabra clave para descubrir más planes."
        />
      )}
    </>
  );
}
