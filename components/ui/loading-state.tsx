"use client";

import { useTranslations } from "@/components/i18n/i18n-provider";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LoadingState({
  label,
  variant = "list",
}: {
  label?: string;
  variant?: "list" | "post" | "profile" | "grid";
}) {
  const { t } = useTranslations();
  const resolvedLabel = label ?? t("common.loadingContent");

  if (variant === "profile") {
    return (
      <Card className="overflow-hidden" aria-busy="true">
        <div className="skeleton-shimmer h-44 sm:h-56" />
        <div className="p-5 sm:p-7">
          <div className="skeleton-shimmer -mt-16 size-24 rounded-full ring-4 ring-[#FFFCF7]" />
          <div className="skeleton-shimmer mt-4 h-7 w-52 rounded-full" />
          <div className="skeleton-shimmer mt-3 h-4 w-72 max-w-full rounded-full" />
        </div>
        <span className="sr-only">{resolvedLabel}</span>
      </Card>
    );
  }

  return (
    <div
      className={cn("grid gap-4", variant === "grid" && "sm:grid-cols-2 xl:grid-cols-3")}
      aria-busy="true"
    >
      {Array.from({ length: variant === "post" ? 2 : 3 }, (_, index) => (
        <Card className="overflow-hidden p-4" key={index}>
          <div className="flex items-center gap-3">
            <div className="skeleton-shimmer size-11 rounded-full" />
            <div className="min-w-0 flex-1">
              <div className="skeleton-shimmer h-4 w-32 rounded-full" />
              <div className="skeleton-shimmer mt-2 h-3 w-20 rounded-full" />
            </div>
          </div>
          <div className="skeleton-shimmer mt-5 h-4 w-3/4 rounded-full" />
          <div className="skeleton-shimmer mt-3 h-4 w-full rounded-full" />
          <div className="skeleton-shimmer mt-2 h-4 w-5/6 rounded-full" />
          {variant !== "list" ? <div className="skeleton-shimmer mt-5 aspect-[16/8] rounded-2xl" /> : null}
        </Card>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}
