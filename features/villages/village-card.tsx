import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { formatPopulation } from "@/lib/utils";
import type { Village } from "@/lib/types";

export function VillageCard({ village }: { village: Village }) {
  return (
    <Link href={`/villages/${village.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-transform group-hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={village.image}
            alt={village.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#3A7D44]">
            {village.province} · {formatPopulation(village.population)} hab.
          </p>
          <h3 className="mt-2 text-2xl font-black text-[#1F3D2B]">{village.name}</h3>
          <p className="mt-2 text-sm leading-6 text-[#1E1E1E]/68">{village.tagline}</p>
        </div>
      </Card>
    </Link>
  );
}
