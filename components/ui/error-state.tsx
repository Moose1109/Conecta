"use client";

import { AlertTriangle, WifiOff } from "lucide-react";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";

export function ErrorState({
  title,
  description,
  actionHref = "/community",
  actionLabel,
  network = false,
}: {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  network?: boolean;
}) {
  const { t } = useTranslations();
  const Icon = network ? WifiOff : AlertTriangle;

  return (
    <Card className="p-7 text-center sm:p-9">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#C96D4A1f] text-[#A95539]">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.025em] text-[#18231D]">
        {title ?? t("common.errorState.title")}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#687269]">
        {description ?? t("common.errorState.description")}
      </p>
      <div className="mt-6">
        <LinkButton href={actionHref}>{actionLabel ?? t("common.errorState.actionLabel")}</LinkButton>
      </div>
    </Card>
  );
}
