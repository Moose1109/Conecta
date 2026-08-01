import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function MomentsPreviewLink() {
  return (
    <Link
      className="group mb-5 flex items-center gap-3 rounded-[18px] border border-[#D7A63C36] bg-[#FFF9EE] px-4 py-3 transition-colors hover:bg-[#FFF4DC] sm:mb-6"
      href="/moments"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#D7A63C24] text-primary">
        <Sparkles aria-hidden="true" className="size-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-extrabold text-primary sm:text-sm">
          Momentos · propuesta visual (concepto)
        </span>
        <span className="mt-0.5 block truncate text-[11px] font-semibold leading-4 text-text-muted sm:text-xs">
          Una demostración de diseño para compartir instantes del pueblo. Sin datos reales todavía.
        </span>
      </span>
      <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
