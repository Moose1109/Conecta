import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { AuthGate } from "@/features/auth/auth-gate";
import { getTranslations } from "@/lib/i18n/get-translations";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t("navigation.saved.label") };
}

export default async function SavedPage() {
  const { t } = await getTranslations();

  return (
    <AuthenticatedShell>
      <AuthGate message={t("saved.authGateMessage")}>
        <PageHeader eyebrow={t("navigation.mySpaceSection")} title={t("navigation.saved.label")} description={t("saved.description")} />
        <BackendPendingAlert actionHref="/community" actionLabel={t("common.backendPending.actionLabel")} description={t("saved.pendingDescription")} />
        <Card className="mt-5 grid min-h-72 place-items-center border-dashed p-7 text-center shadow-none">
          <div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#D7A63C24] text-[#184B34]"><Bookmark aria-hidden="true" className="size-6" /></span><h2 className="mt-4 text-xl font-extrabold text-[#18231D]">{t("saved.emptyTitle")}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#687269]">{t("saved.emptyDescription")}</p><Link className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#184B34] px-5 text-sm font-extrabold text-white hover:bg-[#0E3325]" href="/community">{t("common.backendPending.actionLabel")}</Link></div>
        </Card>
      </AuthGate>
    </AuthenticatedShell>
  );
}
