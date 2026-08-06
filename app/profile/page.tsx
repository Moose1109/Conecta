import type { Metadata } from "next";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { ProfileView } from "@/features/profile/profile-view";
import { getTranslations } from "@/lib/i18n/get-translations";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t("navigation.profile.label") };
}

export default function ProfilePage() {
  return (
    <AuthenticatedShell>
      <ProfileView />
    </AuthenticatedShell>
  );
}
