"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, MessageCircle, SmilePlus, X } from "lucide-react";
import { useRef, type KeyboardEvent, type RefObject } from "react";
import { UserAvatar } from "@/components/social/user-avatar";
import { useModalDialog } from "@/components/ui/use-modal-dialog";
import {
  momentSubtypeDescriptions,
  momentSubtypeLabels,
  type ConceptMoment,
} from "@/features/moments/moments-concept-data";
import { momentSubtypeStyles } from "@/features/moments/moment-subtype-style";

export function MomentViewer({
  moments,
  index,
  onClose,
  onStepBy,
  triggerRef,
}: {
  moments: ConceptMoment[];
  index: number;
  onClose: () => void;
  onStepBy: (delta: number) => void;
  triggerRef: RefObject<HTMLElement | null>;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const moment = moments[index];
  const style = momentSubtypeStyles[moment.subtype];
  const Icon = style.icon;
  const hasPrevious = index > 0;
  const hasNext = index < moments.length - 1;

  useModalDialog({ dialogRef, onClose, open: true, triggerRef });

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" && hasNext) {
      event.preventDefault();
      onStepBy(1);
    } else if (event.key === "ArrowLeft" && hasPrevious) {
      event.preventDefault();
      onStepBy(-1);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0E1712]/72 p-0 sm:p-6" role="presentation">
      <div
        ref={dialogRef}
        aria-label={`Momento de ejemplo: ${moment.title}`}
        aria-modal="true"
        className="flex h-[100dvh] w-full max-w-xl flex-col overflow-hidden bg-white outline-none sm:h-[min(90dvh,760px)] sm:rounded-[26px] sm:shadow-2xl"
        role="dialog"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-border bg-[#FFF9EE] px-3 py-2.5 sm:px-4">
          <span className="inline-flex min-w-0 flex-1 items-center gap-1.5 truncate text-[11px] font-extrabold text-primary sm:text-xs">
            Propuesta visual · sin datos reales
          </span>
          <button
            aria-label="Cerrar el visor de Momentos"
            className="grid size-10 shrink-0 place-items-center rounded-full text-primary transition-colors hover:bg-white/70"
            data-dialog-initial-focus
            type="button"
            onClick={onClose}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="relative aspect-[4/3] w-full shrink-0 bg-[#F3F0E9]">
            {moment.image ? (
              <Image
                alt={`Ejemplo visual de tipo ${momentSubtypeLabels[moment.subtype]} para ${moment.title}`}
                className="object-cover"
                fill
                sizes="(min-width: 640px) 576px, 100vw"
                src={moment.image}
              />
            ) : (
              <span aria-hidden="true" className="grid h-full place-items-center" style={{ color: style.accent }}>
                <Icon className="size-16 opacity-70" strokeWidth={1.4} />
              </span>
            )}
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-primary shadow-sm">
              Ejemplo, no una foto real
            </span>
            <span
              className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold shadow-sm"
              style={{ backgroundColor: "white", color: style.accent }}
            >
              <Icon aria-hidden="true" className="size-3.5" />
              {momentSubtypeLabels[moment.subtype]}
            </span>

            {hasPrevious ? (
              <button
                aria-label="Momento de ejemplo anterior"
                className="absolute left-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-primary shadow-sm transition-colors hover:bg-white"
                type="button"
                onClick={() => onStepBy(-1)}
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
              </button>
            ) : null}
            {hasNext ? (
              <button
                aria-label="Siguiente Momento de ejemplo"
                className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-primary shadow-sm transition-colors hover:bg-white"
                type="button"
                onClick={() => onStepBy(1)}
              >
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            ) : null}
          </div>

          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2.5">
              <UserAvatar className="size-9" initials={moment.authorInitials} name={moment.authorName} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-extrabold text-text-primary">{moment.authorName}</p>
                <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] font-semibold text-text-muted">
                  {moment.villageName ? (
                    <>
                      <MapPin aria-hidden="true" className="size-3 shrink-0" />
                      <span className="truncate">{moment.villageName}</span>
                      <span aria-hidden="true">·</span>
                    </>
                  ) : null}
                  <span className="truncate">{moment.timeLabel}</span>
                </p>
              </div>
            </div>

            <h2 className="mt-4 text-xl font-extrabold leading-6 tracking-[-0.02em] text-text-primary">
              {moment.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-primary/86">{moment.body}</p>
            <p className="mt-4 rounded-2xl bg-[#F5F6F1] px-3.5 py-3 text-xs leading-5 text-text-muted">
              <strong className="font-extrabold text-text-primary">{momentSubtypeLabels[moment.subtype]}: </strong>
              {momentSubtypeDescriptions[moment.subtype]}
            </p>
          </div>
        </div>

        <div className="shrink-0 border-t border-border bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
          <div className="flex items-center gap-2">
            <button
              aria-label="Reaccionar a este Momento — pendiente de backend"
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-[#FBFAF7] px-4 text-sm font-extrabold text-text-muted opacity-70"
              disabled
              type="button"
            >
              <SmilePlus aria-hidden="true" className="size-4" />
              Reaccionar
            </button>
            <button
              aria-label="Responder a este Momento — pendiente de backend"
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-[#FBFAF7] px-4 text-sm font-extrabold text-text-muted opacity-70"
              disabled
              type="button"
            >
              <MessageCircle aria-hidden="true" className="size-4" />
              Responder
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] font-semibold text-text-muted">
            Reaccionar y responder estarán disponibles cuando exista el backend de Momentos.
          </p>
        </div>
      </div>
    </div>
  );
}
