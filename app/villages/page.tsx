import { connection } from "next/server";
import type { Metadata } from "next";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { getVillagesStrict } from "@/lib/api/villages.service";
import { VillageExplorer } from "@/features/villages/village-explorer";
import { VillageHero } from "@/features/villages/village-hero";
import { getTranslations } from "@/lib/i18n/get-translations";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t("navigation.villages.label") };
}

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
