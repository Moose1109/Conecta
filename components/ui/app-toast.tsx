"use client";

import { CircleAlert, Info, X } from "lucide-react";
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const subscribeToClientState = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function AppToast({
  message,
  onDismiss,
  tone = "error",
}: {
  message?: string;
  onDismiss?: () => void;
  tone?: "error" | "info" | "success";
}) {
  const mounted = useSyncExternalStore(
    subscribeToClientState,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!mounted || !message) return null;

  const Icon = tone === "info" ? Info : CircleAlert;

  return createPortal(
    <div
      aria-atomic="true"
      aria-live={tone === "error" ? "assertive" : "polite"}
      className={cn(
        "fixed bottom-20 left-1/2 z-[90] flex w-[min(calc(100%-2rem),28rem)] -translate-x-1/2 items-start gap-3 rounded-2xl border bg-white px-4 py-3 text-sm font-semibold leading-5 shadow-[0_18px_55px_rgba(14,51,37,0.22)] sm:bottom-6",
        tone === "error" && "border-[#C96D4A4d] text-[#873E29]",
        tone === "info" && "border-[#D7A63C59] text-[#72551C]",
        tone === "success" && "border-[#347A484d] text-[#184B34]",
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <span className="min-w-0 flex-1">{message}</span>
      {onDismiss ? (
        <button
          aria-label="Cerrar mensaje"
          className="-m-2 grid size-11 shrink-0 place-items-center rounded-full transition-colors hover:bg-black/5 focus:outline-none focus:ring-4 focus:ring-[#347A4824]"
          onClick={onDismiss}
          type="button"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </div>,
    document.body,
  );
}
