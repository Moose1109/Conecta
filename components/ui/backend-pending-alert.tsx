import Link from "next/link";
import { ArrowRight, Blocks, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackendPendingAlert({
  compact = false,
  title = "Función pendiente de backend",
  description = "Esta sección ya está preparada en el frontend, pero necesita que el backend exponga la funcionalidad correspondiente.",
  actionHref,
  actionLabel = "Ir a comunidad",
  className,
}: {
  compact?: boolean;
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[22px] border border-[#C96D4A2b] bg-[#FFF7F1] text-[#18231D] shadow-[0_12px_34px_rgba(108,64,42,0.06)]",
        compact ? "p-4" : "p-5 sm:p-6",
        className,
      )}
      role="status"
    >
      <div className="flex items-start gap-3">
        <span className={cn("grid shrink-0 place-items-center rounded-2xl bg-[#C96D4A1f] text-[#A95539]", compact ? "size-10" : "size-12")}>
          {compact ? <Info aria-hidden="true" className="size-5" /> : <Blocks aria-hidden="true" className="size-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className={cn("font-extrabold tracking-[-0.015em]", compact ? "text-sm" : "text-lg")}>{title}</h2>
          <p className={cn("mt-1.5 leading-6 text-[#687269]", compact ? "text-xs" : "text-sm")}>{description}</p>
          {actionHref ? (
            <Link
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#184B34] px-4 py-2 text-sm font-extrabold text-white transition-colors hover:bg-[#0E3325]"
              href={actionHref}
            >
              {actionLabel}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
