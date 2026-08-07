"use client";

import Link from "next/link";
import { LockKeyhole, X } from "lucide-react";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { useModalDialog } from "@/components/ui/use-modal-dialog";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { buildAuthHref } from "@/features/auth/next-path";

export function AuthRequiredModal({
  message,
  onClose,
  open,
  returnTo,
}: {
  message?: string;
  onClose: () => void;
  open: boolean;
  /** Current location (pathname + query + hash) to return to after authenticating. */
  returnTo?: string;
}) {
  const { t } = useTranslations();
  const resolvedMessage = message ?? t("auth.requiredModal.defaultMessage");
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
        <button aria-label={t("common.close")} className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-[#184B340a] text-[#184B34] hover:bg-[#184B3414]" data-dialog-initial-focus type="button" onClick={onClose}>
          <X aria-hidden="true" className="size-5" />
        </button>
        <span className="grid size-12 place-items-center rounded-2xl bg-[#D7A63C26] text-[#184B34]">
          <LockKeyhole aria-hidden="true" className="size-5" />
        </span>
        <h2 id="auth-required-title" className="mt-5 pr-10 text-2xl font-extrabold tracking-[-0.025em] text-[#18231D]">{t("auth.gate.needsLoginTitle")}</h2>
        <p id="auth-required-description" className="mt-3 text-sm leading-6 text-[#677168]">{resolvedMessage}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={buildAuthHref("/login", returnTo)} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#184B34] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0E3325]">{t("auth.signIn")}</Link>
          <Link href={buildAuthHref("/register", returnTo)} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-[#184B3424] bg-white px-5 py-2.5 text-sm font-extrabold text-[#184B34] hover:bg-[#F7F2E8]">{t("auth.createAccount")}</Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
