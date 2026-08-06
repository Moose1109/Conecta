"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import { AuthGate } from "@/features/auth/auth-gate";

export function FuturePage({
  adminOnly = false,
  authMessage,
  eyebrow,
  title,
  description,
  items,
}: {
  adminOnly?: boolean;
  authMessage?: string;
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
}) {
  const { t } = useTranslations();
  const content = (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item} className="p-5">
            <p className="text-lg font-black text-[#1F3D2B]">{item}</p>
            <p className="mt-2 text-sm leading-6 text-[#1E1E1E]/62">
              {t("common.futurePage.itemCaption")}
            </p>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <LoadingState label={t("common.futurePage.loadingLabel")} />
        <ErrorState
          title={t("common.futurePage.emptyTitle")}
          description={t("common.futurePage.emptyDescription")}
        />
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <main className="page-shell py-8 md:py-10">
        {authMessage ? (
          <AuthGate adminOnly={adminOnly} message={authMessage}>
            {content}
          </AuthGate>
        ) : (
          content
        )}
      </main>
      <Footer />
    </>
  );
}
