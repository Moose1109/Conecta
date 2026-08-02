"use client";

import { X } from "lucide-react";
import { useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { useModalDialog } from "@/components/ui/use-modal-dialog";

export function ReportContentDialog({
  contentLabel,
  onClose,
  open,
  triggerRef,
}: {
  contentLabel: string;
  onClose: () => void;
  open: boolean;
  triggerRef: RefObject<HTMLElement | null>;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useModalDialog({ dialogRef, onClose, open, triggerRef });

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[150] isolate">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-forest-deep/34 backdrop-blur-[2px]"
        onPointerDown={onClose}
      />
      <div
        ref={dialogRef}
        aria-label={`Reporte pendiente de backend para ${contentLabel}`}
        aria-modal="true"
        className="absolute inset-x-3 top-1/2 mx-auto max-w-lg -translate-y-1/2 rounded-[26px] border border-[#184B3417] bg-ivory p-3 shadow-[0_28px_90px_rgba(14,51,37,0.22)] outline-none sm:p-4"
        role="dialog"
        tabIndex={-1}
      >
        <div className="mb-2 flex justify-end">
          <button
            aria-label="Cerrar aviso"
            className="grid size-11 place-items-center rounded-full bg-[#184B340a] text-primary"
            data-dialog-initial-focus
            type="button"
            onClick={onClose}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <BackendPendingAlert
          description={`No se ha enviado ningún reporte sobre ${contentLabel}. El backend todavía no ofrece el envío ni el seguimiento de reportes.`}
          title="Reporte pendiente de backend"
        />
      </div>
    </div>,
    document.body,
  );
}
