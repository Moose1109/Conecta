"use client";

import Image from "next/image";
import { Camera } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import type { Activity } from "@/lib/types";

export function ActivityImage({
  activity,
  className,
  eager = false,
  preferBanner = false,
  sizes,
}: {
  activity: Activity;
  className?: string;
  eager?: boolean;
  preferBanner?: boolean;
  sizes: string;
}) {
  const { t } = useTranslations();
  const [failed, setFailed] = useState(false);
  const realImage = preferBanner
    ? activity.bannerImage ?? activity.image
    : activity.image;
  // A remote image that fails to load (e.g. a timed-out host) falls back to
  // the same local editorial image used when the activity has none.
  const isEditorial = !realImage || failed;

  return (
    <>
      <Image
        alt={isEditorial ? "" : activity.title}
        className={cn("object-cover", className)}
        fill
        loading={eager ? "eager" : undefined}
        sizes={sizes}
        src={isEditorial ? "/images/raiz-market.webp" : realImage}
        onError={() => setFailed(true)}
      />
      {isEditorial ? (
        <span
          className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-[#0E3325]/72 px-2.5 py-1 text-[0.66rem] font-extrabold text-white shadow-sm backdrop-blur-md"
          title={t("activities.image.editorialTooltip")}
        >
          <Camera aria-hidden="true" className="size-3" />
          {t("activities.hero.editorialImageBadge")}
        </span>
      ) : null}
    </>
  );
}
