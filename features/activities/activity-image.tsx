import Image from "next/image";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Activity } from "@/lib/types";

export function ActivityImage({
  activity,
  className,
  preferBanner = false,
  preload = false,
  sizes,
}: {
  activity: Activity;
  className?: string;
  preferBanner?: boolean;
  preload?: boolean;
  sizes: string;
}) {
  const realImage = preferBanner
    ? activity.bannerImage ?? activity.image
    : activity.image;
  const isEditorial = !realImage;

  return (
    <>
      <Image
        alt={isEditorial ? "" : activity.title}
        className={cn("object-cover", className)}
        fill
        preload={preload}
        sizes={sizes}
        src={realImage ?? "/images/raiz-market.webp"}
      />
      {isEditorial ? (
        <span
          className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-[#0E3325]/72 px-2.5 py-1 text-[0.66rem] font-extrabold text-white shadow-sm backdrop-blur-md"
          title="Recurso visual genérico; no corresponde necesariamente a esta actividad"
        >
          <Camera aria-hidden="true" className="size-3" />
          Imagen editorial
        </span>
      ) : null}
    </>
  );
}
