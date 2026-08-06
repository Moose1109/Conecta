"use client";

import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { cn } from "@/lib/utils";

export function PrototypeBanner({
  title,
  description,
  trailingAction,
  className,
}: {
  title: string;
  description: string;
  trailingAction?: ReactNode;
  className?: string;
}) {
  const { t } = useTranslations();

  return (
    <div
      className={cn(
        "flex shrink-0 items-start gap-3 rounded-[18px] border border-[#D7A63C36] bg-[#FFF9EE] px-3 py-2.5 text-text-primary shadow-sm sm:items-center sm:px-4",
        className,
      )}
      role="note"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#D7A63C24] text-primary">
        <Sparkles aria-hidden="true" className="size-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-extrabold text-primary sm:text-sm">{title}</p>
        <p className="mt-0.5 text-[10px] font-semibold leading-4 text-text-muted sm:text-xs [@media(max-height:640px)]:hidden">
          {description}
        </p>
      </div>
      <span className="hidden shrink-0 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-forest-mid shadow-sm sm:inline-flex">
        {t("common.prototypeBadge")}
      </span>
      {trailingAction}
    </div>
  );
}
