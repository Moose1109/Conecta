"use client";

import { ShieldAlert, X } from "lucide-react";
import { useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Button } from "@/components/ui/button";
import { useModalDialog } from "@/components/ui/use-modal-dialog";
import { useTranslations } from "@/components/i18n/i18n-provider";

export function BlockUserDialog({
  onClose,
  open,
  targetName,
  triggerRef,
}: {
  onClose: () => void;
  open: boolean;
  targetName: string;
  triggerRef: RefObject<HTMLElement | null>;
}) {
  const { t } = useTranslations();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [confirmed, setConfirmed] = useState(false);

  useModalDialog({
    dialogRef,
    onClose: () => {
      setConfirmed(false);
      onClose();
    },
    open,
    triggerRef,
  });

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
        aria-label={t("trust.blockAction", { name: targetName })}
        aria-modal="true"
        className="absolute inset-x-3 top-1/2 mx-auto max-w-lg -translate-y-1/2 rounded-[26px] border border-[#184B3417] bg-ivory p-4 shadow-[0_28px_90px_rgba(14,51,37,0.22)] outline-none sm:p-5"
        role="dialog"
        tabIndex={-1}
      >
        <div className="mb-1 flex justify-end">
          <button
            aria-label={t("trust.closeNotice")}
            className="grid size-11 place-items-center rounded-full bg-[#184B340a] text-primary"
            data-dialog-initial-focus={confirmed ? undefined : true}
            type="button"
            onClick={onClose}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        {confirmed ? (
          <BackendPendingAlert
            description={t("trust.blockPendingDescription", { name: targetName })}
            title={t("trust.blockPendingTitle")}
          />
        ) : (
          <>
            <span className="grid size-12 place-items-center rounded-2xl bg-[#C96D4A1f] text-[#A95539]">
              <ShieldAlert aria-hidden="true" className="size-6" />
            </span>
            <h2 className="mt-4 text-lg font-extrabold tracking-[-0.015em] text-text-primary">
              {t("trust.blockAction", { name: targetName })}
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              {t("trust.blockConfirmDescription")}
            </p>
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row-reverse">
              <Button className="sm:flex-1" type="button" variant="terracotta" onClick={() => setConfirmed(true)}>
                {t("trust.blockConfirmAction")}
              </Button>
              <Button className="sm:flex-1" type="button" variant="secondary" onClick={onClose}>
                {t("common.cancel")}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
