import Image from "next/image";
import { Compass, MapPinned, Sprout } from "lucide-react";

export function VillageHero({ villageCount }: { villageCount: number }) {
  return (
    <section className="relative isolate min-h-[310px] overflow-hidden rounded-[28px] border border-white/20 bg-[#0E3325] shadow-[0_24px_70px_rgba(14,51,37,0.20)] sm:min-h-[340px] lg:min-h-[300px]">
      <Image
        alt="Paisaje rural entre montañas"
        className="object-cover object-center"
        fill
        preload
        sizes="(max-width: 1024px) 100vw, 1160px"
        src="/images/raiz-village-hero.webp"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,43,30,0.92)_0%,rgba(12,50,35,0.75)_44%,rgba(12,42,31,0.25)_76%,rgba(12,42,31,0.42)_100%)]" />
      <div className="topographic-pattern absolute inset-0 opacity-55" />

      <div className="relative z-10 flex min-h-[310px] flex-col justify-between gap-8 p-6 text-white sm:min-h-[340px] sm:p-9 lg:min-h-[300px] lg:flex-row lg:items-end lg:p-10">
        <div className="max-w-2xl self-center lg:self-end">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-extrabold tracking-[0.08em] text-white/90 backdrop-blur-md">
            <MapPinned aria-hidden="true" className="size-4 text-[#E4BE63]" />
            Exploración territorial
          </p>
          <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] sm:text-5xl lg:text-[3.4rem]">
            Descubre pueblos
            <span className="block font-editorial font-semibold italic text-[#F4D486]">
              con vida propia
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/78 sm:text-base sm:leading-7">
            Patrimonio, paisaje y comunidad. Sigue los lugares que te importan y
            descubre lo que comparten sus vecinos.
          </p>
        </div>

        <div className="w-full max-w-[330px] self-end rounded-[24px] border border-white/18 bg-[#18231D]/62 p-4 shadow-[0_16px_42px_rgba(0,0,0,0.20)] backdrop-blur-xl sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#F4D486] text-[#184B34]">
              <Compass aria-hidden="true" className="size-5" strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-extrabold tracking-[-0.01em]">Pueblos para descubrir</p>
              <p className="mt-1 text-xs leading-5 text-white/68">
                Historias locales, paisajes singulares y experiencias compartidas.
              </p>
            </div>
          </div>
          {villageCount > 0 ? (
            <p className="mt-4 flex items-center gap-2 border-t border-white/12 pt-3 text-xs font-bold text-white/72">
              <Sprout aria-hidden="true" className="size-4 text-[#A9C3A8]" />
              {villageCount} {villageCount === 1 ? "pueblo disponible" : "pueblos disponibles"}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
