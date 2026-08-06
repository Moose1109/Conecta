import type { Metadata } from "next";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { SettingsView } from "@/features/profile/settings-view";
import { getTranslations } from "@/lib/i18n/get-translations";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t("settings.pageTitle") };
}

export default function SettingsPage() {
  return <AuthenticatedShell><SettingsView /></AuthenticatedShell>;
}
