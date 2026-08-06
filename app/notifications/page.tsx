import type { Metadata } from "next";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { AuthGate } from "@/features/auth/auth-gate";
import { NotificationsView } from "@/features/notifications/notifications-view";
import { getTranslations } from "@/lib/i18n/get-translations";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t("navigation.notifications.label") };
}

export default async function NotificationsPage() {
  const { t } = await getTranslations();

  return (
    <AuthenticatedShell>
      <AuthGate message={t("notifications.page.authGateMessage")}>
        <NotificationsView />
      </AuthGate>
    </AuthenticatedShell>
  );
}
