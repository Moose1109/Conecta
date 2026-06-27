"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/social/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { VillageCard } from "@/features/villages/village-card";
import type { Village } from "@/lib/types";

export function VillageExplorer({ villages }: { villages: Village[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return villages;
    }

    return villages.filter((village) =>
      [
        village.name,
        village.province,
        village.region,
        village.description,
        village.tagline,
        village.highlights.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, villages]);

  return (
    <>
      <div className="mb-5">
        <SearchInput
          label="Buscar pueblos"
          placeholder="Buscar pueblo, provincia o interés local"
          value={query}
          onChange={setQuery}
        />
      </div>
      {filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((village) => (
            <VillageCard key={village.id} village={village} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No hemos encontrado ese pueblo"
          description="Prueba con una provincia, una actividad local o una palabra más general."
        />
      )}
    </>
  );
}
