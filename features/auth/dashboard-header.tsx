"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { useAuthSession } from "@/features/auth/use-auth-session";

export function DashboardHeader({ fallbackName }: { fallbackName?: string }) {
  const { t } = useTranslations();
  const { user } = useAuthSession();
  const name = user?.name ?? fallbackName ?? t("community.dashboardHeader.defaultUserName");
  const firstName = name.split(" ")[0] ?? name;

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3A7D44]">
            {t("community.dashboardHeader.eyebrow")}
          </p>
          <h1 className="mt-1 text-2xl font-black leading-tight text-[#1F3D2B]">
            {firstName
              ? t("community.dashboardHeader.greeting", { name: firstName })
              : t("community.dashboardHeader.greetingFallback")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#1E1E1E]/62">
            {t("community.dashboardHeader.description")}
          </p>
        </div>
        <Link
          href="/community"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1F3D2B] px-5 py-2.5 text-sm font-black text-white transition-colors hover:bg-[#173322]"
        >
          {t("community.dashboardHeader.openCommunityAction")}
        </Link>
      </div>
    </Card>
  );
}
