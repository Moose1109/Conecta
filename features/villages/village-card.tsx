import Image from "next/image";
import Link from "next/link";
import { FollowButton } from "@/components/social/follow-button";
import { Card } from "@/components/ui/card";
import { formatPopulation } from "@/lib/utils";
import type { Village } from "@/lib/types";

export function VillageCard({
  village,
  compact = false,
}: {
  village: Village;
  compact?: boolean;
}) {
  return (
    <Card className="group h-full overflow-hidden transition-transform hover:-translate-y-1">
      <Link href={`/villages/${village.id}`} className="block">
        <div className={`relative overflow-hidden ${compact ? "aspect-[16/8]" : "aspect-[4/3]"}`}>
          <Image
            src={village.image}
            alt={village.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </Link>
      <div className={compact ? "p-4" : "p-5"}>
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#3A7D44]">
          {village.province} · {formatPopulation(village.population)} hab.
        </p>
        <Link href={`/villages/${village.id}`}>
          <h3 className={compact ? "mt-2 text-xl font-black text-[#1F3D2B]" : "mt-2 text-2xl font-black text-[#1F3D2B]"}>
            {village.name}
          </h3>
        </Link>
        <p className={`mt-2 text-sm leading-6 text-[#1E1E1E]/68 ${compact ? "line-clamp-1" : ""}`}>
          {village.tagline}
        </p>
        <div className="mt-4">
          <FollowButton className="min-h-9 px-3 text-xs" />
        </div>
      </div>
    </Card>
  );
}
