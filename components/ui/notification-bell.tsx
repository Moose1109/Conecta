"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type NotificationFilter = "all" | "unread";

const panelId = "notifications-popover";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    }
  }, [open]);

  function closePanel() {
    setOpen(false);
    setExpanded(false);
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        aria-controls={panelId}
        aria-expanded={open}
        aria-label={open ? "Cerrar notificaciones" : "Abrir notificaciones"}
        className={cn(
          "relative grid size-10 place-items-center rounded-full bg-white/80 text-[#1F3D2B] transition-colors hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#3A7D4424]",
          open && "bg-white text-[#3A7D44] shadow-sm",
        )}
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <BellIcon className="size-5" />
      </button>

      {open ? (
        <>
          <button
            aria-label="Cerrar notificaciones"
            className="fixed inset-0 z-40 bg-[#1F3D2B]/22 md:hidden"
            type="button"
            onClick={closePanel}
          />
          <div
            ref={panelRef}
            aria-label="Panel de notificaciones"
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 overflow-hidden rounded-t-[28px] border border-[#1F3D2B14] bg-[#FAF7F0] text-[#1F3D2B] shadow-[0_-24px_80px_rgba(31,61,43,0.22)] outline-none transition-[max-height,width] duration-200 md:absolute md:inset-x-auto md:bottom-auto md:right-0 md:top-[calc(100%+0.75rem)] md:rounded-3xl md:bg-[#FFFDF8] md:shadow-[0_28px_90px_rgba(31,61,43,0.22)]",
              expanded
                ? "max-h-[92vh] md:max-h-[min(78vh,680px)] md:w-[min(640px,calc(100vw-2rem))]"
                : "max-h-[78vh] md:max-h-[min(72vh,560px)] md:w-[400px]",
            )}
            id={panelId}
            role="dialog"
            tabIndex={-1}
          >
            <div className="border-b border-[#1F3D2B12] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3A7D44]">
                    Centro social
                  </p>
                  <h2 className="mt-1 text-2xl font-black">Notificaciones</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="hidden rounded-full px-3 py-2 text-xs font-black text-[#3A7D44] transition-colors hover:bg-[#3A7D4412] sm:inline-flex"
                    type="button"
                    onClick={() => setExpanded((current) => !current)}
                  >
                    {expanded ? "Vista compacta" : "Ver todo"}
                  </button>
                  <button
                    aria-label="Cerrar panel de notificaciones"
                    className="grid size-10 place-items-center rounded-full bg-[#1F3D2B0d] text-[#1F3D2B]/70 transition-colors hover:bg-[#1F3D2B14] hover:text-[#1F3D2B] md:hidden"
                    type="button"
                    onClick={closePanel}
                  >
                    <CloseIcon className="size-5" />
                  </button>
                </div>
              </div>
              <div
                aria-label="Filtros de notificaciones"
                className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-[#EEF1ED] p-1"
                role="tablist"
              >
                <button
                  aria-selected={filter === "all"}
                  className={cn(
                    "min-h-10 rounded-xl text-sm font-black transition-colors focus:outline-none focus:ring-4 focus:ring-[#3A7D4420]",
                    filter === "all"
                      ? "bg-white text-[#1F3D2B] shadow-sm"
                      : "text-[#1F3D2B]/58 hover:text-[#1F3D2B]",
                  )}
                  role="tab"
                  type="button"
                  onClick={() => setFilter("all")}
                >
                  Todas
                </button>
                <button
                  aria-selected={filter === "unread"}
                  className={cn(
                    "min-h-10 rounded-xl text-sm font-black transition-colors focus:outline-none focus:ring-4 focus:ring-[#3A7D4420]",
                    filter === "unread"
                      ? "bg-white text-[#1F3D2B] shadow-sm"
                      : "text-[#1F3D2B]/58 hover:text-[#1F3D2B]",
                  )}
                  role="tab"
                  type="button"
                  onClick={() => setFilter("unread")}
                >
                  No leídas
                </button>
              </div>
            </div>

            <div
              className={cn(
                "overflow-y-auto p-4",
                expanded
                  ? "max-h-[calc(92vh-9.5rem)] md:max-h-[540px]"
                  : "max-h-[calc(78vh-9.5rem)] md:max-h-[420px]",
              )}
            >
              {/* TODO backend: conectar GET /api/v1/notifications cuando exista un endpoint real activo. */}
              <NotificationsEmptyState
                expanded={expanded}
                filter={filter}
                onClose={closePanel}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function NotificationsEmptyState({
  expanded,
  filter,
  onClose,
}: {
  expanded: boolean;
  filter: NotificationFilter;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-3xl border border-dashed border-[#1F3D2B1f] bg-white/64 px-5 py-8 text-center",
        expanded ? "min-h-80" : "min-h-64",
      )}
    >
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-3xl bg-[#D9A44124] text-[#3A7D44]">
          <BellIcon className="size-6" />
        </span>
        <h3 className="mt-4 text-lg font-black text-[#1F3D2B]">
          {filter === "unread" ? "No tienes pendientes" : "Aún no tienes notificaciones"}
        </h3>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#1E1E1E]/62">
          Cuando alguien comente, se apunte a una actividad o haya novedades en
          los pueblos que sigues, aparecerá aquí.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          <Link
            href="/community"
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#3A7D44] px-4 py-2 text-sm font-black text-white transition-colors hover:bg-[#2f6738]"
            onClick={onClose}
          >
            Ir a comunidad
          </Link>
          <Link
            href="/activities"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#1F3D2B18] bg-white/88 px-4 py-2 text-sm font-black text-[#1F3D2B] transition-colors hover:bg-white"
            onClick={onClose}
          >
            Explorar actividades
          </Link>
        </div>
      </div>
    </div>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
