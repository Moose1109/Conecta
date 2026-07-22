import { Plus, Sprout } from "lucide-react";

export function CommunityHeader() {
  return (
    <header className="mb-5 flex items-start justify-between gap-4 sm:mb-6 sm:items-center">
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <span className="relative mt-0.5 grid size-12 shrink-0 place-items-center rounded-[18px] bg-[#78947D1f] text-[#184B34] sm:size-14">
          <Sprout aria-hidden="true" className="size-6 sm:size-7" strokeWidth={1.7} />
          <span className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-[#F7F2E8] bg-[#D7A63C]" />
        </span>
        <div className="min-w-0">
          <p className="eyebrow">Comunidad</p>
          <h1 className="mt-1 text-[2rem] font-extrabold leading-none tracking-[-0.045em] text-[#0E3325] sm:text-[2.45rem]">
            Tu plaza digital
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#687269] sm:text-[15px]">
            Publicaciones, avisos y momentos compartidos por vecinos y visitantes.
          </p>
        </div>
      </div>

      <a
        className="hidden min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#184B34] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(24,75,52,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0E3325] sm:inline-flex"
        href="#publicar"
      >
        <Plus aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
        Publicar
      </a>
    </header>
  );
}
