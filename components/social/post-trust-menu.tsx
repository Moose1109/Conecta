"use client";

import { useTranslations } from "@/components/i18n/i18n-provider";
import { TrustActionsMenu } from "@/features/trust/trust-actions-menu";

export function PostTrustMenu() {
  const { t } = useTranslations();

  return (
    <TrustActionsMenu
      contentLabel={t("trust.postContentLabel")}
      triggerAriaLabel={t("trust.postOptionsLabel")}
    />
  );
}
