import type { Metadata } from "next";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { AdminDashboard } from "@/features/admin/admin-dashboard";
import { AuthGate } from "@/features/auth/auth-gate";
import { getTranslations } from "@/lib/i18n/get-translations";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t("userMenu.adminPanel") };
}

export default async function AdminPage() {
  const { t } = await getTranslations();

  return (
    <AuthenticatedShell>
      <AuthGate adminOnly message={t("admin.authGateMessage")}>
        <AdminDashboard />
      </AuthGate>
    </AuthenticatedShell>
  );
}
