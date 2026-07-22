"use client";

import Link from "next/link";
import { LockKeyhole, X } from "lucide-react";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { useModalDialog } from "@/components/ui/use-modal-dialog";

export function AuthRequiredModal({
  message = "Para realizar esta acción debes entrar con tu cuenta o crear una nueva.",
  onClose,
  open,
}: {
  message?: string;
  onClose: () => void;
  open: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useModalDialog({ dialogRef: panelRef, onClose, open });

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid touch-pan-y place-items-center overflow-y-auto overscroll-contain bg-[#0E3325]/54 px-4 py-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-sm"
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        aria-describedby="auth-required-description"
        aria-labelledby="auth-required-title"
        aria-modal="true"
        className="relative w-full max-w-md rounded-[28px] border border-white/80 bg-[#FFFCF7] p-6 shadow-[0_28px_90px_rgba(14,51,37,0.28)] outline-none sm:p-7"
        role="dialog"
        tabIndex={-1}
      >
        <button aria-label="Cerrar" className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-[#184B340a] text-[#184B34] hover:bg-[#184B3414]" data-dialog-initial-focus type="button" onClick={onClose}>
          <X aria-hidden="true" className="size-5" />
        </button>
        <span className="grid size-12 place-items-center rounded-2xl bg-[#D7A63C26] text-[#184B34]">
          <LockKeyhole aria-hidden="true" className="size-5" />
        </span>
        <h2 id="auth-required-title" className="mt-5 pr-10 text-2xl font-extrabold tracking-[-0.025em] text-[#18231D]">Necesitas iniciar sesión</h2>
        <p id="auth-required-description" className="mt-3 text-sm leading-6 text-[#687269]">{message}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/login" className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#184B34] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0E3325]">Entrar</Link>
          <Link href="/register" className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-[#184B3424] bg-white px-5 py-2.5 text-sm font-extrabold text-[#184B34] hover:bg-[#F7F2E8]">Crear cuenta</Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
