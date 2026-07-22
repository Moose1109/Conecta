import { connection } from "next/server";
import type { Metadata } from "next";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { getVillagesStrict } from "@/lib/api/villages.service";
import { VillageExplorer } from "@/features/villages/village-explorer";
import { VillageHero } from "@/features/villages/village-hero";

export const metadata: Metadata = { title: "Pueblos" };

export default async function VillagesPage() {
  await connection();

  const villages = await getVillagesStrict();

  return (
    <AuthenticatedShell>
      <VillageHero villageCount={villages.length} />
      <VillageExplorer villages={villages} />
    </AuthenticatedShell>
  );
}
